"use client";

import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import CategoryTable from "@/components/CategoryTable";
import CategoryForm from "@/components/CategoryForm";
import CategoryDetails from "@/components/CategoryDetails";
import { ICategory } from "@/types/category";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    const interval = setInterval(fetchCategories, 50 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: ICategory) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleViewDetails = (category: ICategory) => {
    setSelectedCategory(category);
    setIsDetailsOpen(true);
  };

  const handleDelete = (category: ICategory) => {
    setCategoryToDelete(category);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const res = await fetch("/api/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: categoryToDelete.id }),
        });
        if (!res.ok) throw new Error("Failed to delete category");
        setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
        setIsDeleteAlertOpen(false);
        setCategoryToDelete(null);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleSave = async (data: { formData: FormData }) => {
    try {
      const method = selectedCategory ? "PUT" : "POST";
      const res = await fetch("/api/categories", {
        method,
        body: data.formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save category");
      }
      const savedCategory: ICategory = await res.json();
      if (selectedCategory) {
        setCategories(
          categories.map((c) => (c.id === savedCategory.id ? savedCategory : c))
        );
      } else {
        setCategories([...categories, savedCategory]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      alert(`Error: ${(error as Error).message}`);
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
            Category Management
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={handleCreate}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <FaPlus className="mr-2" /> Add Category
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
        />
        {isFormOpen && (
          <CategoryForm
            category={selectedCategory}
            onSave={handleSave}
            onClose={() => setIsFormOpen(false)}
          />
        )}
        {isDetailsOpen && selectedCategory && (
          <CategoryDetails
            category={selectedCategory}
            onClose={() => setIsDetailsOpen(false)}
          />
        )}
        {isDeleteAlertOpen && categoryToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">{categoryToDelete.name}</span>?
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
