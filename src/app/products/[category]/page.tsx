import ProductItem from "@/app/ProductItem";
import { getProductsByCategory } from "@/lib/api/products";
export default async function Page({ params: { category } }: { params: { category: string } }) {
  const products = await getProductsByCategory(category);
  return (
    <div className="flex flex-col w-11/12 mx-auto gap-5">
      {/* social media  */}
      {/* <div className="h-[100px] w-full border"></div> */}
      {/* productos  */}
      <div>
        <h1 className="p-3 text-3xl font-semibold">{category[0].toUpperCase() + category.slice(1)}</h1>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {products.map((item, index) => {
          return <ProductItem product={item} key={index} />;
        })}
      </div>
    </div>
  );
}
