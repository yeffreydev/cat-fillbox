"use client";
import { IProduct } from "@/types/product";
import { useContext } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CartContext } from "./CartProvider";

export default function RemoveItem({ product }: { product: IProduct }) {
  const { removeItem } = useContext(CartContext);
  return (
    <button
      onClick={() => removeItem(product)}
      className="text-red-500 text-xl"
    >
      <AiOutlineDelete />
    </button>
  );
}
