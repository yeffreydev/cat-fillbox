import { IProduct } from "@/types/product";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";
import AddToCartBtn from "./components/AddToCartBtn";
import { getSiteSettings } from "@/lib/api/settings";

const ProductItem = async ({ product }: { product: IProduct }) => {
  const settings = await getSiteSettings();

  return (
    <div className="w-full max-w-[350px] mx-auto p-4  flex flex-col gap-4 bg-white transition-shadow duration-300">
      <Link href={`/product/${product.id}`} className="group flex flex-col">
        <div className="relative h-[200px] w-full overflow-hidden rounded-md group-hover:shadow-md transition-shadow duration-300">
          <Image
            loading="lazy"
            className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105 bg-white"
            width={300}
            height={200}
            src={product.image}
            alt={product.name || "Product image"}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8//8/AwAI/AL+5ezb1gAAAABJRU5ErkJggg=="
          />
        </div>
        <h2 className="text-xl font-semibold mt-2 group-hover:underline truncate">
          {product.name}
        </h2>
      </Link>

      <p className="text-gray-600 text-sm h-[60px] overflow-hidden line-clamp-3">
        {product.description}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold text-gray-800">
          S/. {product.price}
        </span>
        <AddToCartBtn
          p={{
            ...product,
            id: product.id + (product.category?.name.toLowerCase() || ""),
          }}
        />
      </div>

      <Link
        target="_blank"
        href={`https://api.whatsapp.com/send?phone=+${settings?.countryPre}${settings?.phone}&text=Hola FillBox, Me gustaría pedir el producto '${product.name}'`}
        className="bg-orange-400 flex justify-center gap-2 items-center text-black uppercase w-full py-2 font-bold hover:bg-orange-500 transition-colors duration-200"
      >
        <span>Comprar</span>
        <FaWhatsapp size={20} />
      </Link>
    </div>
  );
};

export default ProductItem;
