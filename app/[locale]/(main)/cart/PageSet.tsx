'use client'

import { taka } from "@/utils/currency";
import Link from "next/link";
import { useApp } from "../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

interface PageSetProps {
  settings?: any; // settings prop যোগ করা হলো
}

export const PageSet = ({ settings = {} }: PageSetProps) => {
  const { cart, updateQuantity, removeFromCart } = useApp();
  const { language } = useLanguage();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 5;

  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d44a35";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const backgroundColor = settings?.backgroundColor || "#F9FAFB";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const cardBg = settings?.cardBackground || "#FFFFFF";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const successColor = settings?.successColor || "#10B981";
  const successBg = settings?.successColor || "#10B981";
  const errorColor = settings?.errorColor || "#EF4444";
  const priceColor = settings?.primaryColor || "#ef553f";

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
    <div className="py-8 min-h-screen" style={{ backgroundColor: backgroundColor }}>
      <div className="container mx-auto px-4 grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        
        {/* Cart Items Section */}
        <section className="rounded-lg border p-4 overflow-x-auto shadow-sm" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <h1 className="text-xl md:text-2xl font-semibold" style={{ color: textColor }}>
            {isBn ? "শপিং কার্ট" : "Shopping Cart"}
          </h1>
          
          <div className="mt-4 rounded-lg border p-3 text-sm" style={{ backgroundColor: `${successColor}10`, borderColor: `${successColor}30`, color: successColor }}>
            {couponMessage}
          </div>

          {cart.length === 0 ? (
            <div className="mt-8 text-center py-12">
              <svg
                className="w-24 h-24 mx-auto mb-4"
                fill="none"
                stroke={textMuted}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11L17 13M7 13h10M9 21h.01M15 21h.01"
                />
              </svg>
              <p className="mb-4" style={{ color: textMuted }}>{emptyCartMessage}</p>
              <Link 
                href="/" 
                className="inline-block rounded-lg px-6 py-2.5 text-white transition-colors font-medium"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
              >
                {continueShoppingText}
              </Link>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                {/* Table Header */}
                <thead>
                  <tr className="border-b" style={{ borderBottomColor: borderColor, backgroundColor: hoverBg }}>
                    <th className="text-left py-3 px-3 font-semibold text-sm" style={{ color: textMuted }}>
                      {tableHeaders.product}
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-sm" style={{ color: textMuted }}>
                      {tableHeaders.price}
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-sm" style={{ color: textMuted }}>
                      {tableHeaders.quantity}
                    </th>
                    <th className="text-left py-3 px-3 font-semibold text-sm" style={{ color: textMuted }}>
                      {tableHeaders.subtotal}
                    </th>
                    <th className="text-center py-3 px-3 font-semibold text-sm" style={{ color: textMuted }}>
                      {tableHeaders.action}
                    </th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id} className="border-b transition-colors" style={{ borderBottomColor: borderColor }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      {/* Product Info */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.image} 
                            alt={getProductName(item)} 
                            className="h-16 w-16 object-cover rounded-md border" 
                            style={{ borderColor: borderColor }}
                            loading="lazy"
                          />
                          <div className="flex flex-col">
                            <Link 
                              href={`/product/${item.slug}`} 
                              className="text-sm font-medium mb-1 line-clamp-2 transition-colors"
                              style={{ color: textColor }}
                              onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                              onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                            >
                              {getProductName(item)}
                            </Link>
                            
                            {/* Show Selected Color */}
                            {(item.selectedColor || item.selectedColorBn) && (
                              <div className="flex items-center gap-2 text-xs" style={{ color: textMuted }}>
                                <span className="font-medium">
                                  {isBn ? "রঙ:" : "Color:"}
                                </span>
                                <div className="flex items-center gap-1">
                                  {item.selectedColorHex && (
                                    <div 
                                      className="w-3 h-3 rounded-full border" 
                                      style={{ backgroundColor: item.selectedColorHex, borderColor: borderColor }}
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
                              <div className="flex items-center gap-2 text-xs mt-0.5" style={{ color: textMuted }}>
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
                        <span className="font-semibold" style={{ color: priceColor }}>{taka(item.price)}</span>
                      </td>
                      
                      {/* Quantity Controls */}
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-2 rounded-lg border w-fit" style={{ borderColor: borderColor, backgroundColor: cardBg }}>
                          <button 
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} 
                            className="border-r px-3 py-1.5 font-semibold transition-colors duration-300 rounded-l-lg"
                            style={{ borderRightColor: borderColor, backgroundColor: hoverBg, color: textMuted }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = borderColor}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                            aria-label={isBn ? "কমান" : "Decrease"}
                          >
                            -
                          </button>
                          <span className="text-sm w-8 text-center font-medium" style={{ color: textColor }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                            className="border-l px-3 py-1.5 font-semibold transition-colors duration-300 rounded-r-lg"
                            style={{ borderLeftColor: borderColor, backgroundColor: hoverBg, color: textMuted }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = borderColor}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                            aria-label={isBn ? "বাড়ান" : "Increase"}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      
                      {/* Subtotal */}
                      <td className="py-4 px-3">
                        <span className="font-semibold" style={{ color: priceColor }}>{taka(item.price * item.quantity)}</span>
                      </td>
                      
                      {/* Remove Button */}
                      <td className="py-4 px-3 text-center">
                        <button 
                          onClick={() => removeFromCart(item._id)} 
                          className="font-bold text-xl w-8 h-8 rounded-full transition-colors"
                          style={{ color: textMuted }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = errorColor;
                            e.currentTarget.style.backgroundColor = `${errorColor}10`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = textMuted;
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
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
        <section className="rounded-lg border p-4 h-fit shadow-sm" style={{ backgroundColor: cardBg, borderColor: borderColor }}>
          <h2 className="text-xl font-semibold" style={{ color: textColor }}>
            {totalsText.cartTotals}
          </h2>
          
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-sm" style={{ color: textMuted }}>{totalsText.subtotal}</span>
              <span className="font-medium" style={{ color: textColor }}>{taka(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-t" style={{ borderTopColor: borderColor }}>
              <span className="text-sm" style={{ color: textMuted }}>{totalsText.shipping}</span>
              <div className="text-right">
                <span className="font-medium" style={{ color: textColor }}>
                  {shipping === 0 ? taka(0) : taka(shipping)}
                </span>
                {shipping > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                    {totalsText.freeShippingNote}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-semibold" style={{ borderTopColor: borderColor }}>
              <span style={{ color: textColor }}>{totalsText.total}</span>
              <span className="text-xl" style={{ color: priceColor }}>{taka(subtotal + shipping)}</span>
            </div>
          </div>
          
          <Link 
            href="/checkout" 
            className="mt-6 block rounded-lg py-3 text-center font-semibold text-white transition-colors shadow-sm hover:shadow"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
          >
            {totalsText.proceedToCheckout}
          </Link>
          
          <Link 
            href="/" 
            className="mt-3 block text-center text-sm transition-colors"
            style={{ color: textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
          >
            ← {totalsText.continueShopping}
          </Link>
        </section>
      </div>
    </div>
  );
};