"use client";

import { IProduct } from "@/types/product";
import { useContext } from "react";
import { FaCartPlus } from "react-icons/fa6";
import { CartContext } from "../cart/CartProvider";

export default function AddToCartBtn({ p }: { p: IProduct }) {
  const { addItemToCart } = useContext(CartContext);
  return (
    <button
      onClick={() => addItemToCart(p)}
      className="text-black p-1 text-2xl"
    >
      <FaCartPlus />
    </button>
  );
}
