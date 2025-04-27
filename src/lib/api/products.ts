import { ProductI } from "@/types/product";
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

  //rpdocuts
  const productsPath = path.join(dataPath, "/products.json");
  const products = await fs.readFile(productsPath, "utf-8");
  let productsArray = JSON.parse(products) as ProductI[];

  productsArray = productsArray.map((product) => {
    const findCategory = categoriesArray.find(
      (category) => category.id === product.categoryId
    );
    product.category = findCategory?.name || "";
    return product;
  });

  return productsArray;
};

export const getProduct = async (id: string, category: string | undefined) => {
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
  const category = categoriesArray.find((cat) => cat.slug === slug);
  if (!category) {
    return [];
  }
  const allProducts = await getAllProducts();
  const products = allProducts.filter(
    (product) => product.categoryId === category.id
  );
  return products;
};
