import { ProductI } from "@/types/product";
import Image from "next/image";
import { FaCartPlus } from "react-icons/fa6";
import Link from "next/link";
import AddToCartBtn from "./components/AddToCartBtn";

const ProductItem = ({ product }: { product: ProductI }) => {
  return (
    <div className="md:w-[350px] mx-auto w-10/12 p-3 rounded-lg hover:shadow shadow-gray-300 flex flex-col gap-4 items-start">
      <Link href={`/product/${product.id.split(".json")[0]}?category=${product.category}`} className="group w-full flex flex-col">
        <div className="h-[160px] relative overflow-hidden group-hover:shadow-lg shadow-gray-300 w-full">
          <Image
            loading="eager"
            className="relative box-border bg-white duration-100  group-hover:scale-110 object-contain w-full h-full"
            width={"300"}
            height={"200"}
            src={"/static/imgs/" + product.image}
            alt=""
          />
        </div>
        <h2 className="text-2xl font-semibold group-hover:underline">{product.name}</h2>
      </Link>

      <p>{product.description.length > 100 ? product.description.slice(0, 99) + "..." : product.description}</p>
      <div className="flex w-11/12 justify-between">
        <span className="text-2xl font-semibold">S/. {product.price}</span>
        <AddToCartBtn p={{ ...product, id: product.id + product.category.toLowerCase() }} />
      </div>
      <button className="bg-orange-400 text-black uppercase w-full mx-auto font-bold py-1">Comprar</button>
    </div>
  );
};

export default ProductItem;
