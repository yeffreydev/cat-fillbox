"use client";

import { useContext } from "react";
import { CartContext } from "./CartProvider";
import { IProduct } from "@/types/product";

export default function DecreaseItem({ product }: { product: IProduct }) {
  const { decreaseItem } = useContext(CartContext);
  return (
    <button onClick={() => decreaseItem(product)} className="p-2">
      {" "}
      -{" "}
    </button>
  );
}
