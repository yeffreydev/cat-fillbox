"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Handle logout by calling backend API
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      router.push("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out. Please try again.");
    }
  };

  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <header className="bg-blue-600 text-white shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold">
              <Link href="/">My App</Link>
            </div>
            <div className="flex space-x-4 items-center">
              <Link
                href="/admin/products"
                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Products
              </Link>
              <Link
                href="/admin/categories"
                className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Categories
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Logout
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
