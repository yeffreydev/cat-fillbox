"use client";

import { CartContext } from "@/app/cart/CartProvider";
import { ProductI } from "@/types/product";
import { useContext } from "react";

export default function AddToCart({ product }: { product: ProductI }) {
  const { addItemToCart } = useContext(CartContext);
  return (
    <button onClick={() => addItemToCart({ ...product, id: product.id + ".json" + product.category })} className="border border-black w-full md:w-8/12 lg:w-5/12 p-1">
      Agregar Al Carrito
    </button>
  );
}
