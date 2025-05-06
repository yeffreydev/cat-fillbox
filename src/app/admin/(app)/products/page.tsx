"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import ProductTable from "@/components/ProductTable";
import ProductForm from "@/components/ProductForm";
import ProductDetails from "@/components/ProductDetails";
import { IProduct } from "@/types/product";
import { ICategory } from "@/types/category";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 50 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleViewDetails = (product: IProduct) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleDelete = (product: IProduct) => {
    setProductToDelete(product);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const res = await fetch("/api/products", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: productToDelete.id }),
        });
        if (!res.ok) throw new Error("Failed to delete product");
        setProducts(products.filter((p) => p.id !== productToDelete.id));
        setIsDeleteAlertOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSave = async (data: { formData: FormData }) => {
    try {
      const method = selectedProduct ? "PUT" : "POST";
      const res = await fetch("/api/products", {
        method,
        body: data.formData,
      });
      if (!res.ok) throw new Error("Failed to save product");
      const savedProduct: IProduct = await res.json();
      if (selectedProduct) {
        setProducts(
          products.map((p) => (p.id === savedProduct.id ? savedProduct : p))
        );
      } else {
        setProducts([...products, savedProduct]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/login", {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to logout");
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Product Management
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleCreate}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <FaPlus className="mr-2" /> Add Product
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
        <ProductTable
          products={products}
          categories={categories}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
        {isFormOpen && (
          <ProductForm
            product={selectedProduct}
            categories={categories}
            onSave={handleSave}
            onClose={() => setIsFormOpen(false)}
          />
        )}
        {isDetailsOpen && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            categories={categories}
            onClose={() => setIsDetailsOpen(false)}
          />
        )}
        {isDeleteAlertOpen && productToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">{productToDelete.name}</span>?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsDeleteAlertOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
