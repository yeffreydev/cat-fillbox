import { NextResponse } from "next/server";
import { getSupabaseWithSession } from "@/lib/supabase";
import { ICategory } from "@/types/category";

export async function GET() {
  try {
    const supabase = await getSupabaseWithSession();
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error.message, error.code);
      throw error;
    }

    const categories: ICategory[] = await Promise.all(
      data.map(async (item) => {
        const { data: coverSignedData } = await supabase.storage
          .from("category-images")
          .createSignedUrl(item.cover, 60);
        return {
          ...item,
          cover: coverSignedData?.signedUrl || item.cover,
        };
      })
    );

    console.log("Fetched categories successfully:", categories.length);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Unexpected error in GET /api/categories:", error);
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
        "Unauthorized POST /api/categories attempt:",
        authError?.message || "No user"
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const cover = formData.get("cover") as File;

    // Upload cover image
    const coverFileName = `${Date.now()}-${cover.name}`;
    const { error: coverUploadError } = await supabase.storage
      .from("category-images")
      .upload(coverFileName, cover);
    if (coverUploadError) {
      console.error(
        "Error uploading category cover:",
        coverUploadError.message
      );
      throw coverUploadError;
    }

    // Insert category
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        description,
        slug,
        cover: coverFileName,
      })
      .select()
      .single();
    if (error) {
      console.error("Error inserting category:", error.message, error.code);
      throw error;
    }

    // Generate signed URL for response
    const { data: coverSignedData } = await supabase.storage
      .from("category-images")
      .createSignedUrl(coverFileName, 60);

    const category: ICategory = {
      ...data,
      cover: coverSignedData?.signedUrl || data.cover,
    };

    console.log(
      "Category created successfully:",
      category.id,
      "by user:",
      user.id
    );
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error in POST /api/categories:", error);
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
        "Unauthorized PUT /api/categories attempt:",
        authError?.message || "No user"
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const cover = formData.get("cover") as File | string;

    let coverFileName = typeof cover === "string" ? cover : null;

    // Upload new cover image if provided
    if (typeof cover !== "string") {
      coverFileName = `${Date.now()}-${cover.name}`;
      const { error: coverUploadError } = await supabase.storage
        .from("category-images")
        .upload(coverFileName, cover);
      if (coverUploadError) {
        console.error(
          "Error uploading category cover:",
          coverUploadError.message
        );
        throw coverUploadError;
      }
    }

    // Update category
    const { data, error } = await supabase
      .from("categories")
      .update({
        name,
        description,
        slug,
        cover: coverFileName,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating category:", error.message, error.code);
      throw error;
    }

    // Generate signed URL for response
    const { data: coverSignedData } = await supabase.storage
      .from("category-images")
      .createSignedUrl(coverFileName!, 60);

    const category: ICategory = {
      ...data,
      cover: coverSignedData?.signedUrl || data.cover,
    };

    console.log(
      "Category updated successfully:",
      category.id,
      "by user:",
      user.id
    );
    return NextResponse.json(category);
  } catch (error: any) {
    console.error("Unexpected error in PUT /api/categories:", error);
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
        "Unauthorized DELETE /api/categories attempt:",
        authError?.message || "No user"
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();

    // Fetch category to get cover image path
    const { data: category, error: fetchError } = await supabase
      .from("categories")
      .select("cover")
      .eq("id", id)
      .single();
    if (fetchError) {
      console.error(
        "Error fetching category for deletion:",
        fetchError.message
      );
      throw fetchError;
    }

    // Delete cover image from storage
    const coverPath = category.cover.split("/").pop();
    if (coverPath) {
      const { error: storageError } = await supabase.storage
        .from("category-images")
        .remove([coverPath]);
      if (storageError) {
        console.error("Error deleting category cover:", storageError.message);
        throw storageError;
      }
    }

    // Delete category
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("Error deleting category:", error.message, error.code);
      throw error;
    }

    console.log("Category deleted successfully:", id, "by user:", user.id);
    return NextResponse.json({ message: "Category deleted" });
  } catch (error: any) {
    console.error("Unexpected error in DELETE /api/categories:", error);
    if (error.code === "AuthSessionMissingError") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
