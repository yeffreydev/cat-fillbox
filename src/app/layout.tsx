import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getSiteSettings } from "../lib/api/settings";
import { getCategories } from "@/lib/api/categories";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  //
  return {
    title: siteSettings?.name,
    description: siteSettings?.description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return (
    <html lang="es">
      <body className="flex flex-col gap-5">
        <Header categories={categories ?? []} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
