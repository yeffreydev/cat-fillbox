"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaWhatsapp,
  FaShieldAlt,
  FaShippingFast,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useState } from "react";
import AddToCart from "./AddToCart";
import CountdownTimer from "./CountdownTimer";

interface ProductDetailsProps {
  product: any;
  settings: any;
  variations: {
    id: string;
    size: string;
    color: string;
    stock: number;
    image: string;
  }[];
  originalPrice: number;
  discountPercentage: number;
  stock: number;
  isLimitedStock: boolean;
  saleEndTime: string;
  frequentlyBought: {
    id: string;
    name: string;
    price: number;
    image: string;
  }[];
}

export default function ProductDetails({
  product,
  settings,
  variations,
  originalPrice,
  discountPercentage,
  stock,
  isLimitedStock,
  saleEndTime,
  frequentlyBought,
}: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(variations[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedFrequentlyBought, setSelectedFrequentlyBought] = useState<
    string[]
  >([]);

  const handleVariantChange = (variant: (typeof variations)[0]) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when variant changes
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(prev + delta, selectedVariant.stock))
    );
  };

  const toggleFrequentlyBought = (id: string) => {
    setSelectedFrequentlyBought((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Image Section */}
      <div className="flex-1">
        <div className="relative w-full max-w-[500px] h-[400px] md:h-[500px]  overflow-hidden  group">
          <Image
            className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110 bg-white"
            width={500}
            height={500}
            src={product.image || selectedVariant.image}
            alt={product.name || "Product image"}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8//8/AwAI/AL+5ezb1gAAAABJRU5ErkJggg=="
            priority
          />
          {discountPercentage > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}
        </div>
        {/* Thumbnail Gallery */}
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {variations.map((variant) => (
            <button
              key={variant.id}
              className={`w-16 h-16 rounded-md border ${
                selectedVariant.id === variant.id
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
              onClick={() => handleVariantChange(variant)}
              aria-label={`Select ${variant.color} ${variant.size}`}
            >
              <Image
                className="object-contain w-full h-full"
                width={64}
                height={64}
                src={variant.image}
                alt={`${variant.color} ${variant.size}`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          {product.name}
        </h1>

        {/* Social Proof */}
        <div className="text-sm text-gray-600">
          <span>🔥 47 personas están viendo este producto ahora</span>
        </div>

        {/* Price and Discount */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-semibold text-red-600">
            S/. {product.price.toFixed(2)}
          </span>
          {discountPercentage > 0 && (
            <span className="text-xl text-gray-500 line-through">
              S/. {originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Indicator and Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                isLimitedStock ? "text-red-500" : "text-green-500"
              }`}
            >
              {isLimitedStock
                ? `¡Solo quedan ${stock} unidades!`
                : `En stock (${stock} disponibles)`}
            </span>
            {isLimitedStock && (
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                ¡Stock limitado!
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${(stock / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Variations Selection */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Selecciona tu variante</h3>
          <div className="flex gap-3 flex-wrap">
            {variations.map((variant) => (
              <button
                key={variant.id}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                  selectedVariant.id === variant.id
                    ? "bg-orange-500 text-white border-orange-500"
                    : variant.stock === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                onClick={() =>
                  variant.stock > 0 && handleVariantChange(variant)
                }
                disabled={variant.stock === 0}
                aria-label={`Select ${variant.size} ${variant.color}`}
              >
                {variant.size} / {variant.color}{" "}
                {variant.stock > 0
                  ? `(${variant.stock} disponibles)`
                  : "(Agotado)"}
              </button>
            ))}
          </div>
          {selectedVariant.stock === 0 && (
            <button className="text-sm text-orange-500 hover:underline">
              Notificarme cuando esté disponible
            </button>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Cantidad</h3>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 border rounded-md text-lg hover:bg-gray-100"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              className="px-3 py-1 border rounded-md text-lg hover:bg-gray-100"
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= selectedVariant.stock}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col md:flex-row gap-4">
          <AddToCart product={{ ...product, selectedVariant, quantity }} />
          <Link
            target="_blank"
            href={`https://api.whatsapp.com/send?phone=+${settings?.countryPre}${settings?.phone}&text=Hola FillBox, Me gustaría pedir el producto '${product.name}' (${selectedVariant.size}, ${selectedVariant.color})`}
            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-md font-bold uppercase hover:bg-orange-600 transition-colors duration-200"
            aria-label="Buy now via WhatsApp"
          >
            <span>Comprar ahora</span>
            <FaWhatsapp size={20} />
          </Link>
        </div>

        {/* Sale Countdown */}
        <div className="text-center bg-yellow-100 p-4 rounded-md">
          <p className="text-sm font-semibold text-gray-800">
            ¡Oferta termina en <CountdownTimer endTime={saleEndTime} />!
          </p>
          <p className="text-xs text-gray-600">
            Aprovecha el descuento antes de que se acabe
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex gap-4 justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaShippingFast size={20} />
            <span>Envío Gratis</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaShieldAlt size={20} />
            <span>Pago Seguro</span>
          </div>
          {/* <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaMoneyBillWave size={20} />
            <span>Garantía de Devolución</span>
          </div> */}
        </div>

        {/* Frequently Bought Together */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Comprado frecuentemente con
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {frequentlyBought.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border rounded-md"
              >
                <input
                  type="checkbox"
                  checked={selectedFrequentlyBought.includes(item.id)}
                  onChange={() => toggleFrequentlyBought(item.id)}
                  className="w-5 h-5"
                  aria-label={`Add ${item.name} to cart`}
                />
                <Image
                  className="w-16 h-16 object-contain"
                  width={64}
                  height={64}
                  src={item.image}
                  alt={item.name}
                />
                <div>
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    S/. {item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex gap-4 justify-center z-50">
        <AddToCart product={{ ...product, selectedVariant, quantity }} />
        <Link
          target="_blank"
          href={`https://api.whatsapp.com/send?phone=+${settings?.countryPre}${settings?.phone}&text=Hola FillBox, Me gustaría pedir el producto '${product.name}' (${selectedVariant.size}, ${selectedVariant.color})`}
          className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md font-bold uppercase hover:bg-orange-600 transition-colors"
          aria-label="Buy now via WhatsApp"
        >
          <span>Comprar</span>
          <FaWhatsapp size={18} />
        </Link>
      </div>
    </div>
  );
}
