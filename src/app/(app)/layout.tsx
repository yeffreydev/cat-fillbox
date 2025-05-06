import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getSiteSettings } from "@/lib/api/settings";
import { getCategories } from "@/lib/api/categories";
import CartProvider from "./cart/CartProvider";
import axios from "axios";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  //
  return {
    title: siteSettings?.name,
    description: siteSettings?.description,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await axios.get(
    process.env.NEXT_PUBLIC_PUBLIC_HOST + "/api/categories"
  );
  const categoriesData = categories.data;
  return (
    <html lang="es">
      <body className="flex flex-col gap-5">
        <CartProvider>
          <Header categories={categoriesData ?? []} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
