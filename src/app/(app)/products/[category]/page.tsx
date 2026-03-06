import { getProductsByCategory } from "@/lib/api/products";
import ProductItem from "../../ProductItem";
import Image from "next/image";
import { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/api/categories";

export async function generateMetadata({
  params: { category },
}: {
  params: { category: string };
}): Promise<Metadata> {
  return {
    title: `${
      category[0].toUpperCase() + category.slice(1)
    } Products | Shop Now`,
    description: `Explore our wide range of ${category} products with exclusive discounts. Shop now and find the perfect item!`,
    openGraph: {
      title: `${category[0].toUpperCase() + category.slice(1)} Products`,
      description: `Discover the best ${category} products at unbeatable prices.`,
      images: [`/images/categories/${category.toLowerCase()}-cover.jpg`],
    },
  };
}

export default async function CategoryPage({
  params: { category },
}: {
  params: { category: string };
}) {
  const products = await getProductsByCategory(category);

  const categoryObject = await getCategoryBySlug(category);

  console.log("Category Object:", categoryObject);

  // Mock cover image URL based on category (replace with API in production)
  const coverImage = categoryObject.cover;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 min-h-[calc(100vh-80px)]">
      {/* Category Cover Image */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden mb-8">
        <Image
          className="object-cover w-full h-full bg-white"
          width={1200}
          height={400}
          src={coverImage}
          alt={`${category} category cover`}
          priority
        />
      </div>

      {/* Social Media / CTA Banner */}
      {/* <div className="bg-orange-100 p-4 rounded-md text-center mb-8">
        <p className="text-lg font-semibold text-gray-800">
          Follow us on social media for exclusive {category} deals! 🎉
        </p>
        <p className="text-sm text-gray-600">
          Join our community on Instagram, Facebook, and WhatsApp.
        </p>
      </div> */}

      {/* Products Grid */}
      <div>
        <h2 className="text-3xl font-semibold mb-6 capitalize">
          {category} Products
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No products found in this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item, index) => (
              <ProductItem product={item} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
