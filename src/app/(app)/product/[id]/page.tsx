import { getProduct } from "@/lib/api/products";
import { getSiteSettings } from "@/lib/api/settings";
import { Metadata } from "next";
import Image from "next/image";
import { FaStar, FaRegStar } from "react-icons/fa";
import ProductDetails from "./ProductDetails";
export const revalidate = 600; // 10 minutes

const relatedProducts = [
  {
    id: "rel1",
    name: "Related Product 1",
    price: 59.99,
    image: "/images/related1.jpg",
  },
  {
    id: "rel2",
    name: "Related Product 2",
    price: 79.99,
    image: "/images/related2.jpg",
  },
];

const frequentlyBought = [
  {
    id: "fb1",
    name: "Polo Basic Black",
    price: 39.0,
    image: "/products/t-shirt-black-001.jpg",
  },
  {
    id: "fb2",
    name: "Polo Cat Lover",
    price: 45.0,
    image: "/products/gato-shirt.webp",
  },
];

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const product = await getProduct(id);
  return {
    title: product?.name
      ? `${product.name} - Limited Offer | Shop Now`
      : "Product Page",
    description: product?.description
      ? `${product.description.slice(0, 160)} | Buy now with ${
          product.discount || 25
        }% off!`
      : "Discover our exclusive product with great discounts!",
    openGraph: {
      title: product?.name,
      description: product?.description,
      images: [product?.image || "/images/default-product.jpg"],
    },
  };
}

async function ProductPage({ params: { id } }: { params: { id: string } }) {
  const product = await getProduct(id);
  const settings = await getSiteSettings();

  if (!product) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        Product Not Found
      </div>
    );
  }

  // Mock discount and stock data
  const originalPrice = product.price * 1.25; // 25% discount
  const discountPercentage = 25;
  const stock = 8;
  const isLimitedStock = stock <= 5;
  const saleEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const fallbackImages = product.images?.length ? product.images : [product.image];
  const productVariations = fallbackImages.map((image, index) => ({
    id: String(index + 1),
    size: ["S", "M", "L"][index] ?? "M",
    color: ["Negro", "Gris", "Blanco"][index] ?? "Negro",
    stock: index === fallbackImages.length - 1 ? 4 : 10,
    image,
  }));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 min-h-[calc(100vh-80px)]">
      {/* Main Product Section */}
      <ProductDetails
        product={product}
        settings={settings}
        variations={productVariations}
        originalPrice={originalPrice}
        discountPercentage={discountPercentage}
        stock={stock}
        isLimitedStock={isLimitedStock}
        saleEndTime={saleEndTime}
        frequentlyBought={frequentlyBought}
      />

      {/* Customer Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Opiniones de clientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaRegStar className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              "¡Gran producto! La calidad es excelente y llegó muy rápido."
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Image
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
                src="/android-chrome-192x192.png"
                alt="Juan P. avatar"
              />
              <p className="text-xs text-gray-500">Juan P. - 2 días atrás</p>
            </div>
          </div>
          <div className="p-4 border rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
            </div>
            <p className="text-sm text-gray-600">
              "Me encantó la variedad de opciones y el precio con descuento."
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Image
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
                src="/android-chrome-192x192.png"
                alt="María S. avatar"
              />
              <p className="text-xs text-gray-500">María S. - 3 días atrás</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">También te puede gustar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((related) => (
            <div
              key={related.id}
              className="p-4 border rounded-md hover:shadow-md transition-shadow"
            >
              <Image
                className="w-full h-[150px] object-contain"
                width={150}
                height={150}
                src={product.image || "/images/default-product.jpg"}
                alt={related.name}
              />
              <h3 className="text-sm font-semibold mt-2">{related.name}</h3>
              <p className="text-sm text-gray-600">
                S/. {related.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
