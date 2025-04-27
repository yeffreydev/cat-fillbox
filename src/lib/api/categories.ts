import { CategoryI } from "@/types/category";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "/data");

export const getCategories = async () => {
  //categories
  const categoriesPath = path.join(dataPath, "/categories.json");

  const categoriesString = await fs.readFile(categoriesPath, "utf-8");

  const categoriesArray = JSON.parse(categoriesString) as CategoryI[];
  return categoriesArray;
};
