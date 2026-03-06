import { ICategory } from "@/types/category";
import { categories } from "../data/categories";

export const getCategories = async () => {
  //categories
  await categories.get();
  return categories.list;
};

export const getCategoryBySlug = async (slug: string) => {
  if (!categories.list.length) {
    await categories.get();
  }
  const category = categories.list.find((item) => item.slug === slug);
  if (!category) {
    throw new Error(`Category with slug "${slug}" not found`);
  }
  return category as ICategory;
};
