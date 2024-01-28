import { getProduct } from "@/lib/api/products";
import { getSiteSettings } from "@/lib/api/settings";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import AddToCart from "./AddToCart";

export async function generateMetadata({ params: { id }, searchParams }: { params: { id: string }; searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const product = await getProduct(id, searchParams["category"] as string | undefined);
  return {
    title: product?.name,
    description: product?.description,
  };
}

async function ProductPage({ params: { id }, searchParams }: { params: { id: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
  let product = await getProduct(id, searchParams["category"] as string | undefined);

  const settings = await getSiteSettings();
  if (!product) {
    return <div>Product Not Found</div>;
  }
  product = { ...product, id, category: searchParams["category"]! as string };
  return (
    <div className="flex flex-col  md:flex-row w-10/12 m-auto gap-3 md:gap-5 min-h-[calc(100vh-70px)] pt-10">
      <div className="flex-1 flex md:justify-center">
        <div className="w-[300px] h-[280px] relative">
          <Image className="absolute object-contain w-full h-full" width={400} height={300} src={`/static/imgs/${product.image}`} alt="" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-5 lg:gap-10 justify-start items-start">
        <h1 className="text-3xl font-semibold">{product?.name}</h1>
        <p>{product?.description}</p>
        <span className="text-2xl">S/. {product?.price}</span>
        {/* <div className="flex gap-5 text-2xl font-semibold">
          <span> - </span>
          <span> 1 </span>
          <span> + </span>
        </div> */}
        <AddToCart product={product} />
        <Link
          target="_blank"
          href={`https://api.whatsapp.com/send?phone=+${settings?.countryPre}${settings?.phone}&text=Hola FillBox, Me gustaria  pedir el producto '${product.name}'`}
          className="uppercase flex items-center justify-center gap-2 w-full md:w-8/12 lg:w-5/12 bg-slate-800 text-white px-7  py-1"
        >
          <span>Comprar</span> <FaWhatsapp />
        </Link>
      </div>
    </div>
  );
}

export default ProductPage;
