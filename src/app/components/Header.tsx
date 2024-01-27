"use client";
import Link from "next/link";
import { useContext } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { CartContext } from "../cart/CartProvider";

interface Props {
  categories: string[];
}
function Header({ categories }: Props) {
  const { quantity } = useContext(CartContext);
  return (
    <nav className="flex justify-between w-11/12 mx-auto h-[70px] items-center">
      <Link href={"/"}>
        <h1 className=" text-xl font-semibold">FillBox</h1>
      </Link>
      <ul className="flex-1 flex items-center gap-3 justify-end">
        {categories.map((item, index) => {
          return (
            <li key={index}>
              <a href={"/products/" + item}>{item[0].toUpperCase() + item.slice(1)}</a>
            </li>
          );
        })}
        <li>
          <Link className="text-xl relative" href={"/cart"}>
            {quantity != 0 && <span className="text-red-500 absolute top-[-70%] right-[-30%] text-sm font-bold">{quantity <= 9 ? quantity : "+9"}</span>}
            <FiShoppingCart />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
