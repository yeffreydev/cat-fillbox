import axios from "axios";
import ProductItem from "./ProductItem";
import { IProduct } from "@/types/product";
export default async function Page() {
  const res = await axios.get<IProduct[]>(
    process.env.NEXT_PUBLIC_PUBLIC_HOST + "/api/products"
  );
  const products = res.data;
  console.log(products);
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
