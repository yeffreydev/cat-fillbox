"use client";

import { useContext } from "react";
import { CartContext } from "./CartProvider";
import { ProductI } from "@/types/product";

export default function IncreaseItem({ product }: { product: ProductI }) {
  const { increaseItem } = useContext(CartContext);
  return (
    <button onClick={() => increaseItem(product)} className="p-2">
      {" "}
      +{" "}
    </button>
  );
}
