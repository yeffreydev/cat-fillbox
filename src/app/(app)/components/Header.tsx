"use client";
import Link from "next/link";
import { useContext } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { CartContext } from "../cart/CartProvider";
import { ICategory } from "@/types/category";
import Image from "next/image";

interface Props {
  categories: ICategory[];
}
function Header({ categories }: Props) {
  const { quantity } = useContext(CartContext);
  return (
    <nav className="flex justify-between w-11/12 mx-auto h-[70px] items-center">
      <Link href={"/"}>
        <Image
          src={"/android-chrome-512x512.png"}
          width={50}
          height={50}
          alt="FillBox Logo"
        />
      </Link>
      <ul className="flex-1 flex items-center gap-3 justify-end">
        {categories.map((item, index) => {
          console.log(item);
          return (
            <li key={index}>
              <Link href={"/products/" + item.slug}>{item.name}</Link>
            </li>
          );
        })}
        <li>
          <Link className="text-xl relative" href={"/cart"}>
            {quantity != 0 && (
              <span className="text-red-500 absolute top-[-70%] right-[-30%] text-sm font-bold">
                {quantity <= 9 ? quantity : "+9"}
              </span>
            )}
            <FiShoppingCart />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
