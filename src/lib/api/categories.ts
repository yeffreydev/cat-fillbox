import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "/data");

export const getCategories = async () => {
  const productsPath = path.join(dataPath, "/products");
  const categories = await fs.readdir(productsPath);
  return categories;
};
