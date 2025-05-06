import React from "react";
import { FaTimes } from "react-icons/fa";
import { ICategory } from "@/types/category";

interface CategoryDetailsProps {
  category: ICategory;
  onClose: () => void;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  category,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {category.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>
        <img
          src={category.cover}
          alt={category.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <p className="text-gray-600 mb-4">{category.description}</p>
        <p className="text-gray-800 font-medium mb-2">Slug: {category.slug}</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CategoryDetails;
