import { ProductI } from "@/types/product";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "/data");

export const getCategories = async () => {
  const productsPath = path.join(dataPath, "/products");
  const categories = await fs.readdir(productsPath);
  return categories;
};

export const getAllProducts = async () => {
  const categories = await getCategories();
  const allProducts: ProductI[] = [];

  await Promise.all(
    categories.map(async (categoryName) => {
      const categoryPath = path.join(dataPath, "/products/" + categoryName);
      const productNames = await fs.readdir(categoryPath);
      await Promise.all(
        productNames.map(async (productName) => {
          const productPath = path.join(categoryPath, `/${productName}`);
          const stringProduct = await fs.readFile(productPath, "utf-8");
          allProducts.push({ id: productName, category: categoryName, ...JSON.parse(stringProduct) });
        })
      );
    })
  );

  return allProducts;
};

export const getProduct = async (id: string, category: string | undefined) => {
  if (!category) {
    return undefined;
  }
  const productPath = path.join(dataPath, `/products/${category}/${id}.json`);
  const stringProduct = await fs.readFile(productPath, "utf-8");
  const product = JSON.parse(stringProduct) as ProductI;
  return product;
};

export const getProductsByCategory = async (category: string) => {
  const categoryPath = path.join(dataPath, `/products/${category}`);
  const productNames = await fs.readdir(categoryPath);
  const products: ProductI[] = [];
  await Promise.all(
    productNames.map(async (productId) => {
      const productPath = path.join(categoryPath, `/${productId}`);
      const stringProduct = await fs.readFile(productPath, "utf-8");
      const product = JSON.parse(stringProduct) as ProductI;
      products.push({ ...product, id: productId, category });
    })
  );
  return products;
};
