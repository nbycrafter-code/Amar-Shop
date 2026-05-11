import { replaceMongoIdInArray } from "@/lib/convertData";
import {
  ShoppingBag,
  Store,
  Image as ImageIcon,
  Shirt,
  User,
  Briefcase,
  Backpack,
  LucideIcon,
} from "lucide-react";
import { ReactElement } from "react";

// Types
export interface Countdown {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

export interface Category {
  name: string;
  icon: ReactElement;
  slug: string;
}

export interface Product {
  id: number;
  productCode: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  hoverImage: string;
  isSale?: boolean;
  discount?: number;
  isNew?: boolean;
  countdown?: Countdown;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

// Categories Data
export async function getCategories(): Promise<Category[]> {
  const categories: Category[] = [
    {
      name: "All Products",
      icon: '<ShoppingBag size={20} className="text-blue-500" />',
      slug: "products",
    },
    {
      name: "Eid Collection 2026",
      icon: '<Store size={20} className="text-purple-500" />',
      slug: "eid-collection-2026",
    },
    {
      name: "Eid Exclusive 2026",
      icon: '<ImageIcon size={20} className="text-pink-500" />',
      slug: "eid-exclusive-2026",
    },
    {
      name: "Katan Panjabi",
      icon: '<Shirt size={20} className="text-blue-400" />',
      slug: "katan-panjabi",
    },
    {
      name: "Premium Koti",
      icon: '<User size={20} className="text-green-500" />',
      slug: "premium-koti",
    },
    {
      name: "Embroidery Panjabi",
      icon: '<Briefcase size={20} className="text-yellow-500" />',
      slug: "embroidery-panjabi",
    },
    {
      name: "Print Panjabi",
      icon: '<Backpack size={20} className="text-blue-500" />',
      slug: "print-panjabi",
    },
  ];

  return categories;
}

// Products Data
export async function getProducts(): Promise<Product[]> {
  const products: Product[] = [
    {
      id: 1,
      productCode: "PRD-001",
      name: "Bass Dual EQ Bluetooth 5.0 Wireless Speaker",
      category: "Eid-collection-2026",
      price: 160,
      originalPrice: 180,
      rating: 4,
      reviews: 120,
      image: "/assets/images/products/product-01.jpg",
      hoverImage: "/assets/images/products/product-02.jpg",
      isSale: true,
      discount: 15,
      countdown: { days: 269, hours: 11, mins: 26, secs: 22 },
    },
    {
      id: 2,
      productCode: "PRD-002",
      name: "Bella Voste Metallic Nail Paints(15) 9 Ml",
      category: "Eid-exclusive-2026",
      price: 9,
      originalPrice: 12,
      rating: 5,
      reviews: 85,
      image: "/assets/images/products/product-03.jpg",
      hoverImage: "/assets/images/products/product-04.jpg",
      isNew: true,
    },
    {
      id: 3,
      productCode: "PRD-003",
      name: "Glow Oil Control Compact SPF 30 with Vitamin C",
      category: "Eid-exclusive-2026",
      price: 69,
      originalPrice: 89,
      rating: 4,
      reviews: 200,
      image: "/assets/images/products/product-05.jpg",
      hoverImage: "/assets/images/products/product-06.jpg",
      isSale: true,
    },
    {
      id: 4,
      productCode: "PRD-004",
      name: "Apple MacBook Air MGNA3HNA 13.3 inch",
      category: "Eid-collection-2026",
      price: 1199,
      originalPrice: 1299,
      rating: 5,
      reviews: 500,
      image: "/assets/images/products/product-07.jpg",
      hoverImage: "/assets/images/products/product-08.jpg",
      isSale: true,
    },
    {
      id: 5,
      productCode: "PRD-005",
      name: "Bodyloviz Trippin Mimosas Shower Gel 240 Ml",
      category: "Eid-collection-2026",
      price: 29,
      originalPrice: 35,
      rating: 4,
      reviews: 150,
      image: "/assets/images/products/product-09.jpg",
      hoverImage: "/assets/images/products/product-10.jpg",
      isNew: true,
    },
    {
      id: 6,
      productCode: "PRD-006",
      name: "T-400 Motorized Running Indoor Treadmill",
      category: "Katan-panjabi",
      price: 300,
      originalPrice: 350,
      rating: 4,
      reviews: 80,
      image: "/assets/images/products/product-11.jpg",
      hoverImage: "/assets/images/products/product-12.jpg",
      isSale: true,
      countdown: { days: 246, hours: 11, mins: 26, secs: 21 },
    },
    {
      id: 7,
      productCode: "PRD-007",
      name: "13-inch MacBook Charger - Magsafe 2 connector",
      category: "Katan-panjabi",
      price: 20,
      originalPrice: 25,
      rating: 5,
      reviews: 300,
      image: "/assets/images/products/product-13.jpg",
      hoverImage: "/assets/images/products/product-14.jpg",
    },
    {
      id: 8,
      productCode: "PRD-008",
      name: "B Natural Mixed Fruit, Rich in Vitamin C & fiber",
      category: "Premium-koti",
      price: 18,
      originalPrice: 22,
      rating: 4,
      reviews: 90,
      image: "/assets/images/products/product-15.jpg",
      hoverImage: "/assets/images/products/product-15-1.jpg",
    },
    {
      id: 9,
      productCode: "PRD-009",
      name: "Kiwi Green Imported 3 Pc (Approx 255 g - 315 g)",
      category: "Premium-koti",
      price: 40,
      originalPrice: 45,
      rating: 5,
      reviews: 110,
      image: "/assets/images/products/product-16.jpg",
      hoverImage: "/assets/images/products/product-16-1.jpg",
      isSale: true,
    },
    {
      id: 10,
      productCode: "PRD-010",
      name: "Avocado 3 Pc (Approx 0.82 kg - 1.2 kg)",
      category: "Embroidery-panjabi",
      price: 69,
      originalPrice: 79,
      rating: 4,
      reviews: 75,
      image: "/assets/images/products/product-17.jpg",
      hoverImage: "/assets/images/products/product-17-1.jpg",
    },
    {
      id: 11,
      productCode: "PRD-011",
      name: "Black Stainless Steel Kitchen Knife (Set of 3)",
      category: "Embroidery-panjabi",
      price: 9,
      originalPrice: 15,
      rating: 4,
      reviews: 200,
      image: "/assets/images/products/product-18.jpg",
      hoverImage: "/assets/images/products/product-19.jpg",
      isSale: true,
    },
    {
      id: 12,
      productCode: "PRD-012",
      name: "Scoobies Unicorn Glow-in-the-Dark Bag",
      category: "Print-panjabi",
      price: 28,
      originalPrice: 35,
      rating: 5,
      reviews: 60,
      image: "/assets/images/products/product-20.jpg",
      hoverImage: "/assets/images/products/product-21.jpg",
    },
    // New Products (13-30)
    {
      id: 13,
      productCode: "PRD-013",
      name: "Premium Cotton Katan Panjabi (Sky Blue)",
      category: "Katan-panjabi",
      price: 85,
      originalPrice: 120,
      rating: 5,
      reviews: 45,
      image: "/assets/images/products/product-22.jpg",
      hoverImage: "/assets/images/products/product-23.jpg",
      isSale: true,
      discount: 29,
    },
    {
      id: 14,
      productCode: "PRD-014",
      name: "Hand Embroidery Silk Panjabi (Maroon)",
      category: "Embroidery-panjabi",
      price: 120,
      originalPrice: 180,
      rating: 5,
      reviews: 67,
      image: "/assets/images/products/product-24.jpg",
      hoverImage: "/assets/images/products/product-25.jpg",
      isSale: true,
      isNew: true,
    },
    {
      id: 15,
      productCode: "PRD-015",
      name: "Classic White Premium Koti Panjabi",
      category: "Premium-koti",
      price: 95,
      originalPrice: 140,
      rating: 4,
      reviews: 89,
      image: "/assets/images/products/product-26.jpg",
      hoverImage: "/assets/images/products/product-27.jpg",
      isSale: true,
    },
    {
      id: 16,
      productCode: "PRD-016",
      name: "Black Digital Print Panjabi",
      category: "Print-panjabi",
      price: 55,
      originalPrice: 75,
      rating: 4,
      reviews: 112,
      image: "/assets/images/products/product-28.jpg",
      hoverImage: "/assets/images/products/product-29.jpg",
    },
    {
      id: 17,
      productCode: "PRD-017",
      name: "Eid Special Designer Kurta Set",
      category: "Eid-collection-2026",
      price: 150,
      originalPrice: 220,
      rating: 5,
      reviews: 234,
      image: "/assets/images/products/product-30.jpg",
      hoverImage: "/assets/images/products/product-31.jpg",
      isSale: true,
      isNew: true,
      discount: 32,
    },
    {
      id: 18,
      productCode: "PRD-018",
      name: "Men's Slim Fit Katan Panjabi (Navy Blue)",
      category: "Katan-panjabi",
      price: 75,
      originalPrice: 110,
      rating: 4,
      reviews: 156,
      image: "/assets/images/products/product-32.jpg",
      hoverImage: "/assets/images/products/product-33.jpg",
      isSale: true,
    },
    {
      id: 19,
      productCode: "PRD-019",
      name: "Heavy Stone Work Embroidery Panjabi",
      category: "Embroidery-panjabi",
      price: 200,
      originalPrice: 300,
      rating: 5,
      reviews: 45,
      image: "/assets/images/products/product-34.jpg",
      hoverImage: "/assets/images/products/product-35.jpg",
      isSale: true,
      isNew: true,
    },
    {
      id: 20,
      productCode: "PRD-020",
      name: "Eid Exclusive Premium Gift Pack",
      category: "Eid-exclusive-2026",
      price: 250,
      originalPrice: 350,
      rating: 5,
      reviews: 78,
      image: "/assets/images/products/product-36.jpg",
      hoverImage: "/assets/images/products/product-38.jpg",
      isSale: true,
      countdown: { days: 30, hours: 5, mins: 30, secs: 15 },
    },
    {
      id: 21,
      productCode: "PRD-021",
      name: "Summer Cotton Print Panjabi (Light Green)",
      category: "Print-panjabi",
      price: 45,
      originalPrice: 65,
      rating: 4,
      reviews: 203,
      image: "/assets/images/products/product-37.jpg",
      hoverImage: "/assets/images/products/product-38.jpg",
    },
    {
      id: 22,
      productCode: "PRD-022",
      name: "Premium Linen Koti Panjabi (Beige)",
      category: "Premium-koti",
      price: 110,
      originalPrice: 160,
      rating: 5,
      reviews: 67,
      image: "/assets/images/products/product-40.jpg",
      hoverImage: "/assets/images/products/product-41.jpg",
      isSale: true,
    },
    {
      id: 23,
      productCode: "PRD-023",
      name: "Royal Blue Katan Panjabi with Dupatta",
      category: "Katan-panjabi",
      price: 130,
      originalPrice: 190,
      rating: 5,
      reviews: 89,
      image: "/assets/images/products/product-42.jpg",
      hoverImage: "/assets/images/products/product-43.jpg",
      isSale: true,
      isNew: true,
    },
    {
      id: 24,
      productCode: "PRD-024",
      name: "Eid Collection Velvet Panjabi (Wine Red)",
      category: "Eid-collection-2026",
      price: 180,
      originalPrice: 260,
      rating: 4,
      reviews: 123,
      image: "/assets/images/products/product-44.jpg",
      hoverImage: "/assets/images/products/product-45.jpg",
      isSale: true,
    },
    {
      id: 25,
      productCode: "PRD-025",
      name: "Floral Embroidery Panjabi (Olive Green)",
      category: "Embroidery-panjabi",
      price: 95,
      originalPrice: 135,
      rating: 4,
      reviews: 56,
      image: "/assets/images/products/product-46.jpg",
      hoverImage: "/assets/images/products/product-47.jpg",
    },
    {
      id: 26,
      productCode: "PRD-026",
      name: "Eid Exclusive Fragrance Gift Set",
      category: "Eid-exclusive-2026",
      price: 65,
      originalPrice: 95,
      rating: 5,
      reviews: 134,
      image: "/assets/images/products/product-48.jpg",
      hoverImage: "/assets/images/products/product-49.jpg",
      isSale: true,
      isNew: true,
    },
    {
      id: 27,
      productCode: "PRD-027",
      name: "Geometric Print Panjabi (Charcoal Grey)",
      category: "Print-panjabi",
      price: 50,
      originalPrice: 70,
      rating: 4,
      reviews: 178,
      image: "/assets/images/products/product-50.jpg",
      hoverImage: "/assets/images/products/product-51.jpg",
    },
    {
      id: 28,
      productCode: "PRD-028",
      name: "Pure Silk Premium Koti Panjabi (Golden)",
      category: "Premium-koti",
      price: 250,
      originalPrice: 380,
      rating: 5,
      reviews: 34,
      image: "/assets/images/products/product-52.jpg",
      hoverImage: "/assets/images/products/product-53.jpg",
      isSale: true,
      isNew: true,
    },
    {
      id: 29,
      productCode: "PRD-029",
      name: "Eid Special Kids Panjabi Set",
      category: "Eid-exclusive-2026",
      price: 65,
      originalPrice: 95,
      rating: 5,
      reviews: 89,
      image: "/assets/images/products/product-54.jpg",
      hoverImage: "/assets/images/products/product-55.jpg",
      isSale: true,
    },
    {
      id: 30,
      productCode: "PRD-030",
      name: "Premium Katan Panjabi Combo (Pack of 2)",
      category: "print-panjabi",
      price: 150,
      originalPrice: 230,
      rating: 5,
      reviews: 145,
      image: "/assets/images/products/product-56.jpg",
      hoverImage: "/assets/images/products/product-57.jpg",
      isSale: true,
      discount: 35,
      countdown: { days: 15, hours: 8, mins: 45, secs: 30 },
    },
  ];

  return products;
}

// Get Products by Category
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const products = await getProducts();
  const catProducts = products.filter(
    (product) => product.category.toLowerCase() === categorySlug.toLowerCase(),
  );
  return catProducts;
}

// Get Product by ID
export async function getProductById(productId: number | string): Promise<Product | null> {
  const products = await getProducts();
  const product = products.find((product) => product.id == Number(productId));
  return product || null;
}

// Get Categories with Products
export async function getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
  const categories = await getCategories();
  const products = await getProducts();
  const categoriesWithProducts: CategoryWithProducts[] = categories.map((category) => {
    const catProducts = products.filter(
      (product) =>
        product.category.toLowerCase() === category.slug.toLowerCase(),
    );
    return {
      ...category,
      products: catProducts,
    };
  });
  return categoriesWithProducts;
}

// Search Products
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts();
  const searchResults = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  });
  return searchResults;
}