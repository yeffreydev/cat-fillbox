import { ProductI } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

const ProductItem = ({ product }: { product: ProductI }) => {
  return (
    <Link
      href={`/product/${product.id.split(".json")[0]}?category=${product.category}`}
      className="md:w-[350px] mx-auto w-10/12 p-3 group rounded-lg hover:shadow shadow-gray-300 flex flex-col gap-3 items-start"
    >
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
      <p>{product.description.length > 100 ? product.description.slice(0, 99) + "..." : product.description}</p>
      <span className="text-xl">S/. {product.price}</span>
      {/* <button className="bg-slate-800 px-3 py-0.5 rounded-lg uppercase">Comprar </button> */}
    </Link>
  );
};

export default ProductItem;
