import CartItem from "./CartItem";

export default function CartPage() {
  return (
    <div className="w-11/12 md:w-10/12 lg:w-8/12 mx-auto flex flex-col">
      <div className="flex w-full flex-col gap-10">
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
      </div>
      <div className="py-5 flex flex-col items-end gap-3 justify-end w-full text-right">
        <div className="flex gap-2">
          <span className="text-xl">Total a pagar</span> <span className="text-2xl">S/. 2000</span>
        </div>
        <div>
          <p className="text-sm">los impuestos han sido incluidos en el precio del producto.</p>
        </div>
        <div>
          <button className="uppercase w-[300px]  text-black bg-orange-200 font-semibold p-2 border border-gray-300 ">comprar </button>
        </div>
      </div>
    </div>
  );
}
