"use client";
import { IProduct } from "@/types/product";
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export interface CartItemI {
  product: IProduct;
  quantity: number;
}
interface StateI {
  totalPrice: number;
  quantity: number;
  items: CartItemI[];
  setItems: Dispatch<SetStateAction<CartItemI[]>>;
  addItemToCart: (p: IProduct) => void;
  addItemsToCart: (products: IProduct[]) => void;
  removeItem: (p: IProduct) => void;
  increaseItem: (p: IProduct) => void;
  decreaseItem: (p: IProduct) => void;
}

const initialSate: StateI = {
  totalPrice: 0,
  quantity: 0,
  items: [],
  setItems: () => {},
  addItemToCart: () => {},
  addItemsToCart: () => {},
  removeItem: () => {},
  increaseItem: () => {},
  decreaseItem: () => {},
};

export const CartContext = createContext(initialSate);

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItemI[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const addItemToCart = (p: IProduct) => {
    console.log(p);
    const newCartItem: CartItemI = { product: p, quantity: 1 };
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

  const removeItem = (p: IProduct) => {
    if (items.some((value) => value.product.id == p.id)) {
      setItems(items.filter((value) => value.product.id != p.id));
    }
  };

  const increaseItem = (p: IProduct) => {
    addItemToCart(p);
  };
  const decreaseItem = (p: IProduct) => {
    const cartItem = items.find((value) => value.product.id == p.id);
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      return removeItem(p);
    }
    setItems(
      items.map((item) => {
        if (item.product.id == p.id) item.quantity--;
        return item;
      })
    );
  };
  const addItemsToCart = (products: IProduct[]) => {
    products.forEach((item) => addItemToCart(item));
  };

  useEffect(() => {
    const totalPrice = items.reduce(
      (acc, value) => value.product.price * value.quantity + acc,
      0
    );
    setTotalPrice(totalPrice);
  }, [items]);

  useEffect(() => {
    const quantity = items.reduce((acc, value) => value.quantity + acc, 0);
    setQuantity(quantity);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        totalPrice,
        quantity,
        items,
        setItems,
        addItemsToCart,
        addItemToCart,
        removeItem,
        increaseItem,
        decreaseItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
