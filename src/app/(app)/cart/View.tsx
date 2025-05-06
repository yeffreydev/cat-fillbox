"use client";
import { useContext, useEffect, useState } from "react";
import CartList from "./CartList";
import Total from "./Total";
import { CartContext } from "./CartProvider";
import Link from "next/link";
import { SiteSettingsI } from "@/types/settings";

export default function View({ settings }: { settings: SiteSettingsI }) {
  const { quantity, items } = useContext(CartContext);
  const [text, setText] = useState("");
  useEffect(() => {
    let text = "Deseo Comprar los Siguientes Items: \n\n";
    items.forEach((item) => {
      text += " * " + item.quantity + " de **" + item.product.name + "** \n";
    });
    setText(text);
  }, [items]);
  return (
    <div className="w-11/12 md:w-10/12 lg:w-8/12 mx-auto flex flex-col">
      {quantity == 0 ? (
        <div className="flex flex-col gap-3 justify-center items-center">
          <p className="text-2xl">El Carrito esta Vacío</p>
          <Link
            href={"/"}
            className="bg-gray-700 text-white text-center p-2 w-full md:w-7/12 lg:w-4/12"
          >
            Ir a Comprar
          </Link>
        </div>
      ) : (
        <>
          <CartList />
          <div className="py-5 flex flex-col items-end gap-3 justify-end w-full text-right">
            <div className="flex gap-2">
              <Total />
            </div>
            <div>
              <p className="text-sm">
                los impuestos han sido incluidos en el precio del producto.
              </p>
            </div>
            <div>
              <Link
                target="_blank"
                href={`https://api.whatsapp.com/send?phone=+${settings?.countryPre}${settings?.phone}&text=${text}`}
                className="uppercase w-[300px]  text-black bg-orange-400 font-semibold p-2 border border-gray-300 "
              >
                comprar{" "}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
