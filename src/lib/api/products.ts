import { ICategory } from "@/types/category";
import { IProduct } from "@/types/product";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "data");

export const getCategories = async () => {
  const categoriesPath = path.join(dataPath, "categories.json");

  const categoriesString = await fs.readFile(categoriesPath, "utf-8");

  const categoriesArray = JSON.parse(categoriesString) as ICategory[];
  return categoriesArray;
};

export const getAllProducts = async () => {
  try {
    const productsPath = path.join(dataPath, "products.json");
    const [productsString, categories] = await Promise.all([
      fs.readFile(productsPath, "utf-8"),
      getCategories(),
    ]);
    const products = JSON.parse(productsString) as IProduct[];
    const categoriesMap = new Map(
      categories.map((category) => [category.id, category])
    );

    return products.map((product) => ({
      ...product,
      categoryId: Number(product.categoryId),
      price: Number(product.price),
      images: product.images?.length ? product.images : [product.image],
      devirations: product.devirations ?? [],
      category: categoriesMap.get(Number(product.categoryId)),
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProduct = async (id: string) => {
  const allProducts = await getAllProducts();
  const product = allProducts.find(
    (product) => Number(product.id) === Number(id)
  );
  if (!product) {
    return null;
  }
  return product;
};

export const getProductsByCategory = async (slug: string) => {
  const allProducts = await getAllProducts();
  const products = allProducts.filter(
    (product) => product.category?.slug === slug
  );
  return products;
};
