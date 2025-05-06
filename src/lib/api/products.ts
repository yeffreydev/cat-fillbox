import { IProduct } from "@/types/product";
import axios from "axios";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "/data");

export const getCategories = async () => {
  //categories
  const categoriesPath = path.join(dataPath, "/categories.json");

  const categoriesString = await fs.readFile(categoriesPath, "utf-8");

  const categoriesArray = JSON.parse(categoriesString) as {
    id: number;
    name: string;
    description: string;
    image: string;
    slug: string;
  }[];
  return categoriesArray;
};

export const getAllProducts = async () => {
  const products = await axios.get<IProduct[]>(
    process.env.NEXT_PUBLIC_PUBLIC_HOST + "/api/products"
  );
  console.log(products.data);

  return products.data;
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
