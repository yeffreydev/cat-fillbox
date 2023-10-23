import ProductItem from "./ProductItem";
import { getAllProducts } from "@/lib/api/products";
export default async function Page() {
  const products = await getAllProducts();
  return (
    <div className="flex flex-col w-11/12 mx-auto gap-5">
      {/* social media  */}
      {/* <div className="h-[100px] w-full border"></div> */}
      {/* productos  */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {products.map((item, index) => {
          return <ProductItem product={item} key={index} />;
        })}
      </div>
    </div>
  );
}
