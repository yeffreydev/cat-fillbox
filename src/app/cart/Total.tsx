"use client";

import { useContext } from "react";
import { CartContext } from "./CartProvider";

export default function Total() {
  const { totalPrice } = useContext(CartContext);
  return (
    <>
      <span className="text-xl">Total a pagar</span> <span className="text-2xl">S/. {totalPrice}</span>
    </>
  );
}
