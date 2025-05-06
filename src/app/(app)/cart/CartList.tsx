"use client";

import { useContext } from "react";
import CartItem from "./CartItem";
import { CartContext } from "./CartProvider";

export default function CartList() {
  const { items } = useContext(CartContext);
  return (
    <div className="flex w-full flex-col gap-10">
      {items.map((item, i) => {
        return <CartItem cartItem={item} key={i} />;
      })}
    </div>
  );
}
