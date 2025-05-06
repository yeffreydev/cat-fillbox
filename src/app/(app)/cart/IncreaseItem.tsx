"use client";

import { useContext } from "react";
import { CartContext } from "./CartProvider";
import { IProduct } from "@/types/product";

export default function IncreaseItem({ product }: { product: IProduct }) {
  const { increaseItem } = useContext(CartContext);
  return (
    <button onClick={() => increaseItem(product)} className="p-2">
      {" "}
      +{" "}
    </button>
  );
}
