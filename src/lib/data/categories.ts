import { ICategory } from "@/types/category";
import fs from "fs/promises";
import path from "path";

const categoriesPath = path.join(process.cwd(), "data/categories.json");

export const categories = {
  list: [] as ICategory[],
  get: async () => {
    try {
      const data = JSON.parse(
        await fs.readFile(categoriesPath, "utf-8")
      ) as ICategory[];
      categories.list = data;
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};
