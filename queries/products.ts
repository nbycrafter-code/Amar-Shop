// app/queries/products.ts
import { Product } from "@/model/product-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import { getCategories } from "./categories";

// Types
export interface ProductData {
  _id?: string;
  name: string;
  nameBn: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  description: string;
  descriptionBn: string;
  image?: string;
  multiImages?: string[];
  video?: string;
  slug?: string;
  active?: boolean;
  sales?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductResponse {
  _id: string;
  name: string;
  nameBn: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  description: string;
  descriptionBn: string;
  image: string;
  multiImages: string[];
  video: string;
  slug: string;
  active: boolean;
  sales: number;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryWithProducts {
  _id: string;
  name: string;
  nameBn: string;
  slug: string;
  description?: string;
  descriptionBn?: string;
  image?: string;
  active?: boolean;
  products: ProductResponse[];
}

// Get all products
export async function getAllProducts(filter: any = {}): Promise<ProductResponse[]> {
  const products = await Product.find(filter).sort({ created_at: -1 }).lean();
  return replaceMongoIdInArray(products) as ProductResponse[];
}

// Get active products only
export async function getProducts(filter: any = {}): Promise<ProductResponse[]> {
  const products = await Product.find({ active: true, ...filter }).sort({ created_at: -1 }).lean();
  return replaceMongoIdInArray(products) as ProductResponse[];
}

// Get product details by ID
export async function getProductDetails(productId: string): Promise<ProductResponse | null> {
  try {
    const product = await Product.findById(productId).lean();
    return replaceMongoIdInObject(product) as ProductResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get product details");
  }
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<ProductResponse | null> {
  try {
    const product = await Product.findOne({ slug }).lean();
    return replaceMongoIdInObject(product) as ProductResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get product by slug");
  }
}

// Create new product
export async function createProductQuery(productData: ProductData): Promise<ProductResponse> {
  try {
    const product = await Product.create(productData);
    return JSON.parse(JSON.stringify(product)) as ProductResponse;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create product");
  }
}

// Update product
export async function updateProductQuery(productId: string, productData: Partial<ProductData>): Promise<ProductResponse | null> {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { ...productData, updated_at: new Date() },
      { new: true }
    ).lean();
    return replaceMongoIdInObject(product) as ProductResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update product");
  }
}

// Delete product
export async function deleteProductQuery(productId: string): Promise<boolean> {
  try {
    const result = await Product.findByIdAndDelete(productId);
    return !!result;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to delete product");
  }
}

// Toggle product status
export async function toggleProductStatusQuery(productId: string, active: boolean): Promise<ProductResponse | null> {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { active, updated_at: new Date() },
      { new: true }
    ).lean();
    return replaceMongoIdInObject(product) as ProductResponse | null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to toggle product status");
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({ category, active: true }).lean();
    return replaceMongoIdInArray(products) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get products by category");
  }
}

// Get products by brand
export async function getProductsByBrand(brand: string): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({ brand, active: true }).lean();
    return replaceMongoIdInArray(products) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get products by brand");
  }
}

// Search products
export async function searchProducts(query: string): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { nameBn: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      active: true
    }).limit(50).lean();
    return replaceMongoIdInArray(products) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to search products");
  }
}

// Get featured products
export async function getFeaturedProducts(limit: number = 10): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({ active: true })
      .sort({ sales: -1 })
      .limit(limit)
      .lean();
    return replaceMongoIdInArray(products) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get featured products");
  }
}

// More efficient version using MongoDB aggregation
export async function getCategoriesWiseProducts(): Promise<CategoryWithProducts[]> {
  try {
    const categories = await getCategories();
    
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({
          category: { $regex: new RegExp(`^${category.name}$`, 'i') },
          active: true
        }).lean();
        
        return {
          ...category,
          products: replaceMongoIdInArray(products) as ProductResponse[],
        };
      })
    );
    
    return categoriesWithProducts;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get categories wise products");
  }
}