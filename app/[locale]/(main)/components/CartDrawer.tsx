'use client'
import { Truck, X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { taka } from "@/utils/currency";
import { useApp } from "../context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  settings?: any; // settings prop যোগ করা হলো
}

export const CartDrawer = ({ open, onClose, settings = {} }: CartDrawerProps) => {
  const { cart, removeFromCart, updateQuantity } = useApp();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // থিম কালার - সেটিংস থেকে নেওয়া
  const primaryColor = settings?.primaryColor || "#ef553f";
  const buttonHoverColor = settings?.buttonPrimaryHover || "#d43f2a";
  const textColor = settings?.textColor || "#1F2937";
  const textMuted = settings?.textMuted || "#6B7280";
  const borderColor = settings?.borderColor || "#E5E7EB";
  const backgroundColor = settings?.backgroundColor || "#FFFFFF";
  const hoverBg = settings?.hoverBackground || "#F3F4F6";
  const priceColor = settings?.primaryColor || "#ef553f";

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const getProductName = (item) => {
    return isBn ? (item.nameBn || item.name) : item.name;
  };

  const texts = {
    shoppingCart: isBn ? "শপিং কার্ট" : "Shopping Cart",
    yourCartIsEmpty: isBn ? "আপনার কার্ট খালি" : "Your cart is empty",
    continueShopping: isBn ? "শপিং চালিয়ে যান →" : "Continue Shopping →",
    subtotal: isBn ? "সাবটোটাল" : "Subtotal",
    viewCart: isBn ? "কার্ট দেখুন" : "View Cart",
    checkout: isBn ? "চেকআউট" : "Checkout"
  };

  return (
    <div className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* Drawer */}
      <aside className={`absolute right-0 top-0 h-full w-full max-w-[380px] shadow-2xl transition-transform duration-300 flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: backgroundColor }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b p-5 sticky top-0 z-10" style={{ borderBottomColor: borderColor, backgroundColor: backgroundColor }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: primaryColor }} />
            <h2 className="text-xl font-bold" style={{ color: textColor }}>{texts.shoppingCart}</h2>
            <span className="text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: hoverBg, color: textMuted }}>
              {cart.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ color: textMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverBg;
              e.currentTarget.style.color = textColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = textMuted;
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: hoverBg }}>
                <ShoppingBag size={40} style={{ color: textMuted }} />
              </div>
              <p className="mb-4" style={{ color: textMuted }}>{texts.yourCartIsEmpty}</p>
              <button
                onClick={onClose}
                className="font-medium hover:underline"
                style={{ color: primaryColor }}
              >
                {texts.continueShopping}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 border rounded-lg p-2 hover:shadow-md transition-shadow" 
                  style={{ backgroundColor: backgroundColor, borderColor: borderColor }}>
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={getProductName(item)}
                    className="h-16 w-16 rounded-lg border object-cover" 
                    style={{ borderColor: borderColor }}
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item._id}`}
                      onClick={onClose}
                      className="font-medium mb-1 line-clamp-2 text-sm transition-colors"
                      style={{ color: textColor }}
                      onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = textColor}
                    >
                      {getProductName(item)}
                    </Link>
                    <p className="font-bold text-md" style={{ color: priceColor }}>
                      {taka(item.price)}
                      <span className="text-[12px] font-normal ml-1" style={{ color: textMuted }}>
                        x {item.quantity}
                      </span>
                    </p>

                    <div className="flex gap-2">
                      {(item.selectedColor || item.selectedColorBn) && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] font-semibold" style={{ color: textMuted }}>
                            {isBn ? "রঙ:" : "Color:"}
                          </span>
                          {item.selectedColorHex && (
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: item.selectedColorHex, borderColor: borderColor }}
                            />
                          )}
                          <span className="text-[10px]" style={{ color: textMuted }}>
                            {isBn ? (item.selectedColorBn || item.selectedColor) : (item.selectedColor || item.selectedColorBn)}
                          </span>
                        </div>
                      )}

                      {(item.selectedSize || item.selectedSizeBn) && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] font-semibold" style={{ color: textMuted }}>
                            {isBn ? "সাইজ:" : "Size:"}
                          </span>
                          <span className="text-[10px]" style={{ color: textMuted }}>
                            {isBn ? (item.selectedSizeBn || item.selectedSize) : (item.selectedSize || item.selectedSizeBn)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2 border inline-flex rounded" style={{ borderColor: borderColor }}>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="p-1 transition-colors"
                        style={{ borderRight: `1px solid ${borderColor}` }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        aria-label={isBn ? "কমান" : "Decrease"}
                      >
                        <Minus size={12} style={{ color: textMuted }} />
                      </button>
                      <span className="w-4 text-center text-sm font-medium" style={{ color: textColor }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="p-1 transition-colors"
                        style={{ borderLeft: `1px solid ${borderColor}` }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        aria-label={isBn ? "বাড়ান" : "Increase"}
                      >
                        <Plus size={12} style={{ color: textMuted }} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="transition-colors self-start"
                    style={{ color: textMuted }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                    onMouseLeave={(e) => e.currentTarget.style.color = textMuted}
                    aria-label={isBn ? "সরান" : "Remove"}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Fixed Bottom */}
        {cart.length > 0 && (
          <div className="border-t sticky bottom-0" style={{ borderTopColor: borderColor, backgroundColor: backgroundColor }}>
            {/* Subtotal */}
            <div className="p-3" style={{ backgroundColor: hoverBg }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold" style={{ color: textMuted }}>{texts.subtotal}</span>
                <span className="text-xl font-bold" style={{ color: priceColor }}>
                  {taka(subtotal)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="p-3 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="border-2 font-medium py-2 px-3 rounded-lg text-center transition-all duration-200 text-sm"
                  style={{ borderColor: textColor, color: textColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = textColor;
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = textColor;
                  }}
                >
                  {texts.viewCart}
                </Link>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="text-white font-medium py-2 px-3 rounded-lg text-center transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                >
                  {texts.checkout}
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};