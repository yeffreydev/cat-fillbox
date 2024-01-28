import Image from "next/image";
import { CartItemI } from "./CartProvider";
import DecreaseItem from "./Decreaseitem";
import IncreaseItem from "./IncreaseItem";
import RemoveItem from "./RemoveItem";
export default function CartItem({ cartItem: { product, quantity } }: { cartItem: CartItemI }) {
  return (
    <div className="flex flex-col md:flex-row w-full items-start gap-10 border-b border-gray-200 p-2">
      <div className="flex gap-2 flex-1">
        <div className="w-[150px] border relative border-gray-200 h-[150px]">
          <Image className="w-full absolute p-2 h-full object-contain" src={"/static/imgs/" + product.image} width={200} height={200} alt={product.name} />
        </div>
        <div>
          <p>{product.name}</p>
          <div>
            <span>Product Price</span> <span className="text-bold text-lg">S/. {product.price}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 p-1">
        <div className="flex items-center gap-7 px-2 rounded text-2xl border border-gray-300 md:border-black ">
          <DecreaseItem product={product} />
          <span>{quantity}</span>
          <IncreaseItem product={product} />
        </div>
        <div>
          <RemoveItem product={product} />
        </div>
      </div>
      <div className="flex gap-2 md:gap-0 md:flex-col">
        <span>total Price</span>
        <span className="font-semibold">S/. {product.price * quantity}</span>
      </div>
    </div>
  );
}
