"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Define types for product
interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  hoverImage?: string;
  isSale?: boolean;
  isNew?: boolean;
  isOffer?: boolean;
  discount?: number;
  quantity?: number;
  countdown?: { days: number; hours: number; mins: number; secs: number };
  // Add these new properties
  selectedColor?: string;
  selectedSize?: string;
  colors?: string[];
  sizes?: string[];
  brand?: string;
  description?: string;
  nameBn?: string; // Add Bengali name support
}

// Define cart item type (extends product with quantity)
interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

// Define context type
interface AppContextType {
  // Language
  language: "en" | "bn";
  setLanguage: (value: "en" | "bn") => void;
  isBn: boolean;
  changeLanguage: (value: string) => void;

  // Search
  search: string;
  setSearch: (value: string) => void;

  // Wishlist
  wishlist: Product[];
  setWishlist: (value: Product[]) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (value: boolean) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;

  // Compare
  compareList: Product[];
  setCompareList: (value: Product[]) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (value: boolean) => void;
  addToCompare: (product: Product) => void;
  removeFromCompare: (id: number) => void;
  isInCompare: (id: number) => boolean;
  clearAllCompare: () => void;

  // Cart
  cart: CartItem[];
  setCart: (value: CartItem[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void; // Add clearCart function
  cartTotal: number;
  cartCount: number;

  // Quick View
  activeProduct: Product | null;
  setActiveProduct: (value: Product | null) => void;
  isQuickViewOpen: boolean;
  setIsQuickViewOpen: (value: boolean) => void;
}

// Create context with default value
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const isBn = language === "bn";
  useEffect(() => {
    const storedLang = localStorage.getItem("language");
    if (storedLang) {
      setLanguage(storedLang);
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      let newCart;

      if (existing) {
        newCart = prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        const qtyNum = product.quantity ? Number(product.quantity) : 1;
        if (isNaN(qtyNum) || qtyNum <= 0) {
          return prev; // Don't add if quantity is invalid
        }
        newCart = [...prev, { ...product, quantity: qtyNum }];
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const newCart = prev.filter((item) => item._id !== id);
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) => {
        const newCart = prev.map((item) =>
          item._id === id ? { ...item, quantity } : item,
        );
        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  useEffect(() => {
    const carted = localStorage.getItem("cart");
    const wishlisted = localStorage.getItem("wishlist");
    const compared = localStorage.getItem("compare");
    if (carted) {
      setCart(JSON.parse(carted));
    }
    if (wishlisted) {
      setWishlist(JSON.parse(wishlisted));
    }
    if (wishlisted) {
      setWishlist(JSON.parse(wishlisted));
    }
    if (compared) {
      setCompareList(JSON.parse(compared));
    }
  }, []);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      // আগে check করবে product আছে কিনা
      if (prev.find((item) => item._id === product._id)) return prev;

      // নতুন wishlist তৈরি
      const newWishlist = [...prev, product];

      // localStorage এ save
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));

      return newWishlist;
    });

    setIsWishlistOpen(true);
  };

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => {
      const updatedWishlist = prev.filter(
        (item) => item._id !== id
      );

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );

      return updatedWishlist;
    });
  };

  const isInWishlist = (id: number) => wishlist.some((item) => item._id === id);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const isInCompare = (id: number) =>
    compareList.some((item) => item._id === id);

  const addToCompare = (product: Product) => {
    // Check if product already in compare list
    if (isInCompare(product._id)) {
      // Optional: Show toast message that product already in compare
      console.log("Product already in compare list");
      return;
    }

    // Check if compare list already has 4 items
    if (compareList.length >= 4) {
      console.log("You can compare up to 4 products only");
      return;
    }

    // Add product to compare list
    setCompareList((prev) => {
      if (prev.find((item) => item._id === product._id)) return prev;

      const updatedCompareList = [...prev, product];

      localStorage.setItem("compare", JSON.stringify(updatedCompareList));

      return updatedCompareList;
    });

    setIsCompareOpen(true);
  };

  const removeFromCompare = (id: number) => {
    setCompareList(compareList.filter((item) => item._id !== id));
  };

  const clearAllCompare = () => {
    setCompareList([]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        isBn,
        changeLanguage,

        search,
        setSearch,

        wishlist,
        setWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,

        compareList,
        setCompareList,
        isCompareOpen,
        setIsCompareOpen,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearAllCompare,

        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart, // Add clearCart to the context value
        cartTotal,
        cartCount,

        activeProduct,
        setActiveProduct,
        isQuickViewOpen,
        setIsQuickViewOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
