'use client'

import { taka } from "@/utils/currency";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

export const PageSet = () => {
  const { cart, updateQuantity, removeFromCart } = useApp();
  const { language } = useLanguage();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 5;

  const isBn = language === 'bn';

  const couponMessage = isBn 
    ? "ন্যূনতম $১০০ এর উপরে অর্ডারে ২০% ছাড় পেতে GET20OFF কুপন কোড ব্যবহার করুন" 
    : "Use GET20OFF coupon code to get 20% off on minimum order above $100";

  const emptyCartMessage = isBn ? "আপনার কার্ট খালি" : "Your cart is empty";
  const continueShoppingText = isBn ? "শপিং চালিয়ে যান" : "Continue Shopping";

  const tableHeaders = {
    product: isBn ? "পণ্য" : "Product",
    price: isBn ? "দাম" : "Price",
    quantity: isBn ? "পরিমাণ" : "Quantity",
    subtotal: isBn ? "সাবটোটাল" : "Subtotal",
    action: isBn ? "অ্যাকশন" : "Action"
  };

  const totalsText = {
    cartTotals: isBn ? "কার্ট টোটাল" : "Cart totals",
    subtotal: isBn ? "সাবটোটাল" : "Subtotal",
    shipping: isBn ? "ডেলিভারি চার্জ" : "Shipping",
    total: isBn ? "মোট" : "Total",
    freeShippingNote: isBn ? "$১০০ এর উপরে অর্ডারে ফ্রি শিপিং" : "Free shipping on orders over $100",
    proceedToCheckout: isBn ? "চেকআউট এ যান" : "Proceed To Checkout",
    continueShopping: isBn ? "শপিং চালিয়ে যান" : "Continue Shopping"
  };

  const getProductName = (item) => {
    if (isBn) {
      return item.nameBn || item.name;
    }
    return item.name;
  };

  const getColorName = (item) => {
    if (isBn) {
      return item.selectedColorBn || item.selectedColor;
    }
    return item.selectedColor || item.selectedColorBn;
  };

  const getSizeName = (item) => {
    if (isBn) {
      return item.selectedSizeBn || item.selectedSize;
    }
    return item.selectedSize || item.selectedSizeBn;
  };

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <div className="container mx-auto px-4 grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        
        {/* Cart Items Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-4 overflow-x-auto shadow-sm">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            {isBn ? "শপিং কার্ট" : "Shopping Cart"}
          </h1>
          
          <div className="mt-4 rounded-lg border border-green-300 bg-green-50 p-3 text-sm text-green-700">
            {couponMessage}
          </div>

          {cart.length === 0 ? (
            <div className="mt-8 text-center py-12">
              <svg
                className="w-24 h-24 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11L17 13M7 13h10M9 21h.01M15 21h.01"
                />
              </svg>
              <p className="text-gray-500 mb-4">{emptyCartMessage}</p>
              <Link 
                href="/" 
                className="inline-block rounded-lg bg-[#ef553f] px-6 py-2.5 text-white hover:bg-[#d44a35] transition-colors font-medium"
              >
                {continueShoppingText}
              </Link>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">
                      {tableHeaders.product}
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">
                      {tableHeaders.price}
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">
                      {tableHeaders.quantity}
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-gray-700 text-sm">
                      {tableHeaders.subtotal}
                    </th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-700 text-sm">
                      {tableHeaders.action}
                    </th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {/* Product Info */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={getProductName(item)} 
                            className="h-16 w-16 object-cover rounded-md border border-gray-200" 
                            loading="lazy"
                          />
                          <div className="flex flex-col">
                            <Link 
                              href={`/product/${item.slug}`} 
                              className="text-sm text-gray-700 hover:text-[#ef553f] transition-colors font-medium mb-1 line-clamp-2"
                            >
                              {getProductName(item)}
                            </Link>
                            
                            {/* Show Selected Color */}
                            {(item.selectedColor || item.selectedColorBn) && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="font-medium">
                                  {isBn ? "রঙ:" : "Color:"}
                                </span>
                                <div className="flex items-center gap-1">
                                  {item.selectedColorHex && (
                                    <div 
                                      className="w-3 h-3 rounded-full border border-gray-300"
                                      style={{ backgroundColor: item.selectedColorHex }}
                                    />
                                  )}
                                  <span>
                                    {getColorName(item)}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            {/* Show Selected Size */}
                            {(item.selectedSize || item.selectedSizeBn) && (
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <span className="font-medium">
                                  {isBn ? "সাইজ:" : "Size:"}
                                </span>
                                <span>
                                  {getSizeName(item)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {/* Price */}
                      <td className="py-4 px-3">
                        <span className="font-semibold text-[#ef553f]">{taka(item.price)}</span>
                       </td>
                      
                      {/* Quantity Controls */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2 rounded-lg border border-gray-300 w-fit bg-white">
                          <button 
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} 
                            className="border-r border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-300 px-3 py-1.5 text-gray-700 font-semibold rounded-l-lg"
                            aria-label={isBn ? "কমান" : "Decrease"}
                          >
                            -
                          </button>
                          <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                            className="border-l border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-300 px-3 py-1.5 text-gray-700 font-semibold rounded-r-lg"
                            aria-label={isBn ? "বাড়ান" : "Increase"}
                          >
                            +
                          </button>
                        </div>
                       </td>
                      
                      {/* Subtotal */}
                      <td className="py-4 px-3">
                        <span className="font-semibold text-[#ef553f]">{taka(item.price * item.quantity)}</span>
                       </td>
                      
                      {/* Remove Button */}
                      <td className="py-4 px-3 text-center">
                        <button 
                          onClick={() => removeFromCart(item._id)} 
                          className="text-red-500 hover:text-red-700 transition-colors font-bold text-xl w-8 h-8 rounded-full hover:bg-red-50"
                          aria-label={isBn ? "সরান" : "Remove"}
                        >
                          ×
                        </button>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Cart Totals Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-4 h-fit shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            {totalsText.cartTotals}
          </h2>
          
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">{totalsText.subtotal}</span>
              <span className="font-medium">{taka(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-100">
              <span className="text-gray-600">{totalsText.shipping}</span>
              <div className="text-right">
                <span className="font-medium">
                  {shipping === 0 ? taka(0) : taka(shipping)}
                </span>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {totalsText.freeShippingNote}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold">
              <span>{totalsText.total}</span>
              <span className="text-[#ef553f] text-xl">{taka(subtotal + shipping)}</span>
            </div>
          </div>
          
          <Link 
            href="/checkout" 
            className="mt-6 block rounded-lg bg-[#ef553f] py-3 text-center font-semibold text-white hover:bg-[#d44a35] transition-colors shadow-sm hover:shadow"
          >
            {totalsText.proceedToCheckout}
          </Link>
          
          <Link 
            href="/" 
            className="mt-3 block text-center text-sm text-gray-500 hover:text-[#ef553f] transition-colors"
          >
            ← {totalsText.continueShopping}
          </Link>
        </section>
      </div>
    </div>
  );
};
