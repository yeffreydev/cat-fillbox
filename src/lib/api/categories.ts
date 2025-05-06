import { ICategory } from "@/types/category";
import fs from "fs/promises";
import path from "path";

const dataPath = path.join(process.cwd(), "/data");

export const getCategories = async () => {
  //categories
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_PUBLIC_HOST + "/api/categories"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = (await res.json()) as ICategory[];
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
