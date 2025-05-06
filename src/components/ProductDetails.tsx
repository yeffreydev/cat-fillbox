import { ICategory } from "@/types/category";
import { IProduct } from "@/types/product";
import React from "react";
import { FaTimes } from "react-icons/fa";

interface ProductDetailsProps {
  product: IProduct;
  categories: ICategory[];
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  categories,
  onClose,
}) => {
  const category = categories.find((c) => c.id === product.categoryId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {product.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <FaTimes />
          </button>
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-gray-800 font-medium mb-2">
          Price: ${product.price}
        </p>
        <p className="text-gray-800 font-medium mb-2">
          Category: {category?.name || "N/A"}
        </p>
        <div className="mb-4">
          <p className="text-gray-800 font-medium">Variations:</p>
          {product.devirations.map((dev, index) => (
            <p key={index} className="text-gray-600">
              {dev.name}: {dev.values.join(", ")}
            </p>
          ))}
        </div>
        <div className="mb-4">
          <p className="text-gray-800 font-medium">Additional Images:</p>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="h-20 w-full object-cover rounded"
              />
            ))}
          </div>
        </div>
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

export default ProductDetails;
