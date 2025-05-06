import { ICategory } from "./category";

export interface IProduct {
  id: string | number;
  name: string;
  description: string;
  image: string;
  price: number;
  category?: ICategory;
  categoryId: number;
  devirations: { name: string; values: string[] }[];
  images: string[];
}
