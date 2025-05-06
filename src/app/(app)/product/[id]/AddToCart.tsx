"use client";

import { IProduct } from "@/types/product";
import { useContext } from "react";
import { CartContext } from "../../cart/CartProvider";

export default function AddToCart({ product }: { product: IProduct }) {
  const { addItemToCart } = useContext(CartContext);
  return (
    <button
      onClick={() =>
        addItemToCart({
          ...product,
          id: product.id + ".json" + product.category,
        })
      }
      className="border border-black w-full md:w-8/12 lg:w-5/12 p-1"
    >
      Agregar Al Carrito
    </button>
  );
}
