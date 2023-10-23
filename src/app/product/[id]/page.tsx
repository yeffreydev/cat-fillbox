import { getProduct } from "@/lib/api/products";
import { getSiteSettings } from "@/lib/api/settings";
import { Metadata } from "next";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export async function generateMetadata({ params: { id }, searchParams }: { params: { id: string }; searchParams: { [key: string]: string | string[] | undefined } }): Promise<Metadata> {
  const product = await getProduct(id, searchParams["category"] as string | undefined);
  return {
    title: product?.name,
    description: product?.description,
  };
}

async function ProductPage({ params: { id }, searchParams }: { params: { id: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
  const product = await getProduct(id, searchParams["category"] as string | undefined);
  const settings = await getSiteSettings();
  if (!product) {
    return <div>Product Not Found</div>;
  }
  return (
    <div className="flex flex-col  md:flex-row w-10/12 m-auto gap-3 md:gap-5 min-h-[calc(100vh-70px)] pt-10">
      <div className="flex-1 flex md:justify-center">
        <div className="w-[300px] h-[280px] bg-gray-400"></div>
      </div>
      <div className="flex flex-1 flex-col gap-5 lg:gap-10 justify-start items-start">
        <h1 className="text-3xl font-semibold">{product?.name}</h1>
        <p>{product?.description}</p>
        <span className="text-2xl">S/. {product?.price}</span>
        <Link
          target="_blank"
          href={`https://api.whatsapp.com/send?phone=+${settings?.countryCode}${settings?.phone}&text=Hola FillBox, Me gustaria pedir el producto '${product.name}'`}
          className="uppercase flex items-center gap-2 bg-slate-800 text-white px-7 rounded-xl py-1"
        >
          Comprar <FaWhatsapp />
        </Link>
      </div>
    </div>
  );
}

export default ProductPage;
