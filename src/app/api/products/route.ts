import { NextResponse } from "next/server";
import { getSupabaseWithSession } from "@/lib/supabase";
import { IProduct } from "@/types/product";

export async function GET() {
  try {
    const supabase = await getSupabaseWithSession();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)");
    if (error) {
      console.error("Error fetching products:", error.message, error.code);
      throw error;
    }

    const products: IProduct[] = await Promise.all(
      data.map(async (item) => {
        const { data: imageSignedData } = await supabase.storage
          .from("product-images")
          .createSignedUrl(item.image, 60);

        const signedImageUrls = await Promise.all(
          item.images.map(async (img: string) => {
            const { data: signedData } = await supabase.storage
              .from("product-images")
              .createSignedUrl(img, 60);
            return signedData?.signedUrl || img;
          })
        );

        return {
          ...item,
          categoryId: item.category_id,
          category: item.category,
          image: imageSignedData?.signedUrl || item.image,
          images: signedImageUrls,
          devirations: Object.entries(item.devirations).map(
            ([name, values]) => ({
              name,
              values: values as string[],
            })
          ),
        };
      })
    );

    console.log("Fetched products successfully:", products.length);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Unexpected error in GET /api/products:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseWithSession();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn(
        "Unauthorized POST /api/products attempt:",
        authError?.message || "No user"
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);
    const devirations = JSON.parse(formData.get("devirations") as string);
    const image = formData.get("image") as File;
    const images = formData.getAll("images") as File[];

    // Upload main image
    const imageFileName = `${Date.now()}-${image.name}`;
    const { error: imageUploadError } = await supabase.storage
      .from("product-images")
      .upload(imageFileName, image);
    if (imageUploadError) {
      console.error("Error uploading product image:", imageUploadError.message);
      throw imageUploadError;
    }

    // Upload additional images
    const imageFileNames: string[] = [];
    for (const img of images) {
      const imgFileName = `${Date.now()}-${img.name}`;
      const { error: imgUploadError } = await supabase.storage
        .from("product-images")
        .upload(imgFileName, img);
      if (imgUploadError) {
        console.error(
          "Error uploading additional image:",
          imgUploadError.message
        );
        throw imgUploadError;
      }
      imageFileNames.push(imgFileName);
    }

    // Convert devirations to JSON
    const devirationsJson = devirations.reduce(
      (
        acc: Record<string, string[]>,
        dev: { name: string; values: string[] }
      ) => {
        acc[dev.name] = dev.values;
        return acc;
      },
      {}
    );

    // Insert product
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        description,
        image: imageFileName,
        price,
        category_id: categoryId,
        devirations: devirationsJson,
        images: imageFileNames,
      })
      .select()
      .single();
    if (error) {
      console.error("Error inserting product:", error.message, error.code);
      throw error;
    }

    // Generate signed URLs for response
    const { data: imageSignedData } = await supabase.storage
      .from("product-images")
      .createSignedUrl(imageFileName, 60);

    const signedImageUrls = await Promise.all(
      imageFileNames.map(async (img) => {
        const { data: signedData } = await supabase.storage
          .from("product-images")
          .createSignedUrl(img, 60);
        return signedData?.signedUrl || img;
      })
    );

    const product: IProduct = {
      ...data,
      categoryId: data.category_id,
      image: imageSignedData?.signedUrl || data.image,
      images: signedImageUrls,
      devirations: Object.entries(data.devirations).map(([name, values]) => ({
        name,
        values: values as string[],
      })),
    };

    console.log(
      "Product created successfully:",
      product.id,
      "by user:",
      user.id
    );
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error in POST /api/products:", error);
    if (error.code === "AuthSessionMissingError") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await getSupabaseWithSession();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn(
        "Unauthorized PUT /api/products attempt:",
        authError?.message || "No user"
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);
    const devirations = JSON.parse(formData.get("devirations") as string);
    const image = formData.get("image") as File | string;
    const images = formData.getAll("images") as (File | string)[];

    let imageFileName = typeof image === "string" ? image : null;
    let imageFileNames = images.filter(
      (img) => typeof img === "string"
    ) as string[];

    // Upload new main image if provided
    if (typeof image !== "string") {
      imageFileName = `${Date.now()}-${image.name}`;
      const { error: imageUploadError } = await supabase.storage
        .from("product-images")
        .upload(imageFileName, image);
      if (imageUploadError) {
        console.error(
          "Error uploading product image:",
          imageUploadError.message
        );
        throw imageUploadError;
      }
    }

    // Upload new additional images if provided
    for (const img of images) {
      if (typeof img !== "string") {
        const imgFileName = `${Date.now()}-${img.name}`;
        const { error: imgUploadError } = await supabase.storage
          .from("product-images")
          .upload(imgFileName, img);
        if (imgUploadError) {
          console.error(
            "Error uploading additional image:",
            imgUploadError.message
          );
          throw imgUploadError;
        }
        imageFileNames.push(imgFileName);
      }
    }

    // Convert devirations to JSON
    const devirationsJson = devirations.reduce(
      (
        acc: Record<string, string[]>,
        dev: { name: string; values: string[] }
      ) => {
        acc[dev.name] = dev.values;
        return acc;
      },
      {}
    );

    // Update product
    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        description,
        image: imageFileName,
        price,
        category_id: categoryId,
        devirations: devirationsJson,
        images: imageFileNames,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating product:", error.message, error.code);
      throw error;
    }

    // Generate signed URLs for response
    const { data: imageSignedData } = await supabase.storage
      .from("product-images")
      .createSignedUrl(data.image, 60);

    const signedImageUrls = await Promise.all(
      data.images.map(async (img: string) => {
        const { data: signedData } = await supabase.storage
          .from("product-images")
          .createSignedUrl(img, 60);
        return signedData?.signedUrl || img;
      })
    );

    const product: IProduct = {
      ...data,
      categoryId: data.category_id,
      image: imageSignedData?.signedUrl || data.image,
      images: signedImageUrls,
      devirations: Object.entries(data.devirations).map(([name, values]) => ({
        name,
        values: values as string[],
      })),
    };

    console.log(
      "Product updated successfully:",
      product.id,
      "by user:",
      user.id
    );
    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Unexpected error in PUT /api/products:", error);
    if (error.code === "AuthSessionMissingError") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await getSupabaseWithSession();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn(
        "Unauthorized DELETE /api/products attempt:",
        authError?.message || "No user"
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    // Fetch product to get image paths
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("image, images")
      .eq("id", id)
      .single();
    if (fetchError) {
      console.error("Error fetching product for deletion:", fetchError.message);
      throw fetchError;
    }

    // Delete images from storage
    const imagePaths = [product.image, ...product.images].filter(
      (path): path is string => !!path
    );
    if (imagePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove(imagePaths);
      if (storageError) {
        console.error("Error deleting product images:", storageError.message);
        throw storageError;
      }
    }
    console.log("Deleted product images successfully:", imagePaths);

    // Delete product
    const { error } = await supabase.from("products").delete().eq("id", id);
    console.log("Deleted product from database:", id);
    if (error) {
      console.error("Error deleting product:", error.message, error.code);
      throw error;
    }

    console.log("Product deleted successfully:", id, "by user:", user.id);
    return NextResponse.json({ message: "Product deleted" });
  } catch (error: any) {
    console.error("Unexpected error in DELETE /api/products:", error);
    if (error.code === "AuthSessionMissingError") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
