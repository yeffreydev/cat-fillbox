"use client";
import { ProductI } from "@/types/product";
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useEffect, useState } from "react";

interface CartItemI {
  product: ProductI;
  quantity: number;
}
interface StateI {
  totalPrice: number;
  quantity: number;
  items: CartItemI[];
  setItems: Dispatch<SetStateAction<CartItemI[]>>;
  addItemToCart: (p: ProductI) => void;
  addItemsToCart: (products: ProductI[]) => void;
}

const initialSate: StateI = {
  totalPrice: 0,
  quantity: 0,
  items: [],
  setItems: () => {},
  addItemToCart: () => {},
  addItemsToCart: () => {},
};

export const CartContext = createContext(initialSate);

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItemI[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const addItemToCart = (p: ProductI) => {
    const newCartItem: CartItemI = { product: p, quantity: 1 };
    console.log(items.some((value) => value.product.id == p.id));
    if (!items.some((value) => value.product.id == p.id)) {
      return setItems([...items, newCartItem]);
    }
    setItems(
      items.map((item) => {
        if (item.product.id == p.id) item.quantity++;
        return item;
      })
    );
  };

  const addItemsToCart = (products: ProductI[]) => {
    products.forEach((item) => addItemToCart(item));
  };

  useEffect(() => {
    const totalPrice = items.reduce((acc, value) => value.product.price * value.quantity + acc, 0);
    setTotalPrice(totalPrice);
  }, [items]);

  useEffect(() => {
    const quantity = items.reduce((acc, value) => value.quantity + acc, 0);
    setQuantity(quantity);
  }, [items]);

  return <CartContext.Provider value={{ totalPrice, quantity, items, setItems, addItemsToCart, addItemToCart }}>{children}</CartContext.Provider>;
};

export default CartProvider;
