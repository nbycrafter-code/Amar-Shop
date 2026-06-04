import { Product, IProduct } from "@/models/product-model";
import { Category } from "@/models/category-model";
import { Brand } from "@/models/brand-model";
import { Size } from "@/models/size-model";
import { Color } from "@/models/color-model";
import { SubCategory } from "@/models/subcategory-model";
import { replaceMongoIdInArray, replaceMongoIdInObject } from "@/lib/convertData";
import mongoose from "mongoose";
import { getCategories } from "./categories";

// Types
export interface ProductData {
  name: string;
  nameBn: string;
  price: number;
  stock: number;
  categoryId: string;
  subCategoryId?: string | null;
  brandId: string;
  sizeIds: string[];
  colorIds: string[];
  description: string;
  descriptionBn: string;
  image?: string;
  multiImages?: string[];
  video?: string;
  slug: string;
  active?: boolean;
}

export interface ProductResponse {
  _id: string;
  id?: string;
  name: string;
  nameBn: string;
  price: number;
  oldPrice: number;
  discount: number;
  discountType: string;
  stock: number;
  categoryId: string;
  categoryName: string;
  categoryNameBn: string;
  categorySlug: string;
  subCategoryId: string | null;
  subCategoryName: string | null;
  subCategoryNameBn: string | null;
  subCategorySlug: string | null;
  brandId: string;
  brandName: string;
  brandNameBn: string;
  brandSlug: string;
  sizeIds: string[];
  sizeNames: string[];
  sizeNamesBn?: string[];
  colorIds: string[];
  colorNames: string[];
  colorNamesBn: string[];
  colorHexes: string[];
  description: string;
  descriptionBn: string;
  image: string;
  multiImages: string[];
  video: string;
  slug: string;
  section: string;
  badge: string;
  productType: string;
  active: boolean;
  sales: number;
  isNew?: boolean;
  rating?: number;
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

interface SearchProductsOptions {
  category?: string | null;
  query?: string | null;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

interface SearchProductsResult {
  products: ProductResponse[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// Helper function to populate product data
async function populateProduct(product: any): Promise<ProductResponse | null> {
  if (!product) return null;

  const productObj = product.toObject ? product.toObject() : product;

  // Get category details
  let categoryName = '', categoryNameBn = '', categorySlug = '';
  if (productObj.categoryId) {
    const category = await Category.findById(productObj.categoryId).lean();
    if (category) {
      categoryName = category.name;
      categoryNameBn = category.nameBn || category.name;
      categorySlug = category.slug;
    }
  }

  // Get subcategory details
  let subCategoryName: string | null = null,
    subCategoryNameBn: string | null = null,
    subCategorySlug: string | null = null;
  if (productObj.subCategoryId) {
    const subCategory = await SubCategory.findById(productObj.subCategoryId).lean();
    if (subCategory) {
      subCategoryName = subCategory.name;
      subCategoryNameBn = subCategory.nameBn || subCategory.name;
      subCategorySlug = subCategory.slug;
    }
  }

  // Get brand details
  let brandName = '', brandNameBn = '', brandSlug = '';
  if (productObj.brandId) {
    const brand = await Brand.findById(productObj.brandId).lean();
    if (brand) {
      brandName = brand.name;
      brandNameBn = brand.nameBn || brand.name;
      brandSlug = brand.slug;
    }
  }

  // Get size details
  const sizeNames: string[] = [];
  const sizeNamesBn: string[] = [];
  if (productObj.sizeIds && productObj.sizeIds.length > 0) {
    const sizes = await Size.find({ _id: { $in: productObj.sizeIds } }).lean();
    sizes.forEach(s => {
      sizeNames.push(s.name);
      if (s.nameBn) sizeNamesBn.push(s.nameBn);
    });
  }

  // Get color details
  const colorNames: string[] = [];
  const colorNamesBn: string[] = [];
  const colorHexes: string[] = [];
  if (productObj.colorIds && productObj.colorIds.length > 0) {
    const colors = await Color.find({ _id: { $in: productObj.colorIds } }).lean();
    colors.forEach(c => {
      colorNames.push(c.name);
      colorNamesBn.push(c.nameBn || c.name);
      colorHexes.push(c.hex);
    });
  }

  // Calculate isNew (products from last 30 days)
  const isNew = productObj.created_at ?
    (new Date().getTime() - new Date(productObj.created_at).getTime()) <= 30 * 24 * 60 * 60 * 1000 :
    false;

  return {
    ...productObj,
    _id: productObj._id.toString(),
    id: productObj._id.toString(),
    categoryId: productObj.categoryId?.toString(),
    categoryName,
    categoryNameBn,
    categorySlug,
    subCategoryId: productObj.subCategoryId?.toString() || null,
    subCategoryName,
    subCategoryNameBn,
    subCategorySlug,
    brandId: productObj.brandId?.toString(),
    brandName,
    brandNameBn,
    brandSlug,
    sizeIds: productObj.sizeIds?.map((id: any) => id.toString()) || [],
    sizeNames,
    sizeNamesBn,
    colorIds: productObj.colorIds?.map((id: any) => id.toString()) || [],
    colorNames,
    colorNamesBn,
    colorHexes,
    isNew: isNew || productObj.badge === 'new',
  };
}

// Get all products
export async function getAllProducts(filter: any = {}): Promise<ProductResponse[]> {
  const products = await Product.find(filter).sort({ created_at: -1 }).lean();
  const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
  return populatedProducts.filter(p => p !== null) as ProductResponse[];
}

// Get active products only
export async function getProducts(filter: any = {}): Promise<ProductResponse[]> {
  const products = await Product.find({ active: true, ...filter }).sort({ created_at: -1 }).lean();
  const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
  return populatedProducts.filter(p => p !== null) as ProductResponse[];
}

// Get product details by ID
export async function getProductDetails(productId: string): Promise<ProductResponse | null> {
  try {
    const product = await Product.findById(productId).lean();
    if (!product) return null;
    return await populateProduct(product);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get product details");
  }
}

// Get product by slug
export async function getProductBySlug(slug: string): Promise<ProductResponse | null> {
  try {
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;
    return await populateProduct(product);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get product by slug");
  }
}

// Create new product
export async function createProductQuery(productData: ProductData): Promise<ProductResponse> {
  try {
    const createData: any = {
      ...productData,
      categoryId: new mongoose.Types.ObjectId(productData.categoryId),
      brandId: new mongoose.Types.ObjectId(productData.brandId),
      sizeIds: productData.sizeIds.map(id => new mongoose.Types.ObjectId(id)),
      colorIds: productData.colorIds.map(id => new mongoose.Types.ObjectId(id)),
    };

    if (productData.subCategoryId) {
      createData.subCategoryId = new mongoose.Types.ObjectId(productData.subCategoryId);
    }

    const product = await Product.create(createData);
    const populated = await populateProduct(product);
    return populated!;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create product");
  }
}

// Update product
export async function updateProductQuery(productId: string, productData: Partial<ProductData>): Promise<ProductResponse | null> {
  try {
    const updateData: any = { ...productData, updated_at: new Date() };

    if (productData.categoryId) {
      updateData.categoryId = new mongoose.Types.ObjectId(productData.categoryId);
    }
    if (productData.subCategoryId !== undefined) {
      updateData.subCategoryId = productData.subCategoryId ? new mongoose.Types.ObjectId(productData.subCategoryId) : null;
    }
    if (productData.brandId) {
      updateData.brandId = new mongoose.Types.ObjectId(productData.brandId);
    }
    if (productData.sizeIds) {
      updateData.sizeIds = productData.sizeIds.map(id => new mongoose.Types.ObjectId(id));
    }
    if (productData.colorIds) {
      updateData.colorIds = productData.colorIds.map(id => new mongoose.Types.ObjectId(id));
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    ).lean();

    if (!product) return null;
    return await populateProduct(product);
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
    if (!product) return null;
    return await populateProduct(product);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to toggle product status");
  }
}

// Get products by category slug
export async function getProductsByCategory(
  categorySlug: string,
  limit: number = 50
): Promise<ProductResponse[]> {
  try {
    const category = await Category.findOne({ slug: categorySlug }).lean();

    if (!category) {
      return [];
    }

    const products = await Product.find({
      active: true,
      categoryId: category._id
    })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    return populatedProducts.filter(p => p !== null) as ProductResponse[];
  } catch (error) {
    console.error("Get products by category error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get products by category");
  }
}

// Get products by brand ID
export async function getProductsByBrand(brandId: string): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({
      brandId: new mongoose.Types.ObjectId(brandId),
      active: true
    }).lean();
    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    return populatedProducts.filter(p => p !== null) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get products by brand");
  }
}

// Search products
// export async function searchProducts(query: string): Promise<ProductResponse[]> {
//   try {
//     const products = await Product.find({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { nameBn: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } },
//         { descriptionBn: { $regex: query, $options: 'i' } }
//       ],
//       active: true
//     }).limit(50).lean();

//     const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
//     return populatedProducts.filter(p => p !== null) as ProductResponse[];
//   } catch (error) {
//     throw new Error(error instanceof Error ? error.message : "Failed to search products");
//   }
// }
export async function searchProducts(
  category: string | null, 
  query: string | null,
  limit: number = 50
): Promise<ProductResponse[]> {
  console.log("Input category:", category);
  console.log("Input query:", query);
  
  try {
    // Build the query object
    let queryObject: any = {
      active: true
    };
    
    // Add category filter if provided
    if (category && category !== 'All' && category !== 'null' && category !== '') {
      // First find category by slug or name
      const categoryDoc = await Category.findOne({
        $or: [
          { slug: category },
          { name: category },
          { nameBn: category }
        ]
      }).lean();
      
      if (categoryDoc) {
        queryObject.categoryId = categoryDoc._id;
      }
    }
    
    // Add search filter if provided
    if (query && query.trim()) {
      const searchRegex = query.trim();
      queryObject.$or = [
        { name: { $regex: searchRegex, $options: 'i' } },
        { nameBn: { $regex: searchRegex, $options: 'i' } },
        { description: { $regex: searchRegex, $options: 'i' } },
        { descriptionBn: { $regex: searchRegex, $options: 'i' } },
        { sku: { $regex: searchRegex, $options: 'i' } },
        { tags: { $regex: searchRegex, $options: 'i' } }
      ];
    }
    
    // Find products
    let productsQuery = Product.find(queryObject)
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();
    
    const products = await productsQuery;
    
    console.log(`Found ${products.length} products`);
    
    // Populate products with related data (same as getNewArrivals)
    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    const filteredProducts = populatedProducts.filter(p => p !== null) as ProductResponse[];
    
    // If search query exists, also filter by category and brand names
    if (query && query.trim() && filteredProducts.length > 0) {
      const searchRegex = query.trim().toLowerCase();
      return filteredProducts.filter(product => 
        product.name?.toLowerCase().includes(searchRegex) ||
        product.nameBn?.toLowerCase().includes(searchRegex) ||
        product.description?.toLowerCase().includes(searchRegex) ||
        product.descriptionBn?.toLowerCase().includes(searchRegex) ||
        product.categoryName?.toLowerCase().includes(searchRegex) ||
        product.categoryNameBn?.toLowerCase().includes(searchRegex) ||
        product.brandName?.toLowerCase().includes(searchRegex) ||
        product.brandNameBn?.toLowerCase().includes(searchRegex) ||
        product.sku?.toLowerCase().includes(searchRegex) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchRegex))
      );
    }
    
    return filteredProducts;
    
  } catch (error) {
    console.error("Search products error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to search products");
  }
}
//and
export async function searchProductsWithPagination(options: SearchProductsOptions): Promise<SearchProductsResult> {
  try {
    const {
      category = null,
      query = null,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice = null,
      maxPrice = null
    } = options;

    let filter: any = {
      active: true
    };

    // Build search conditions
    let searchConditions: any[] = [];

    if (query && query.trim()) {
      const searchRegex = { $regex: query, $options: 'i' };
      searchConditions = [
        { name: searchRegex },
        { nameBn: searchRegex },
        { description: searchRegex },
        { descriptionBn: searchRegex },
        { shortDescription: searchRegex },
        { sku: searchRegex },
        { tags: searchRegex },
        { 'brand.name': searchRegex },
        { 'category.name': searchRegex }
      ];
    }

    // Add category filter
    if (category && category !== 'All' && category !== 'null') {
      filter['category.slug'] = category;
    }

    // Add price range filter
    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null) filter.price.$gte = minPrice;
      if (maxPrice !== null) filter.price.$lte = maxPrice;
    }

    // Combine search conditions
    if (searchConditions.length > 0) {
      filter.$or = searchConditions;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    let sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    const validProducts = populatedProducts.filter(p => p !== null) as ProductResponse[];

    return {
      products: validProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    };

  } catch (error) {
    console.error("Search products error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to search products");
  }
}

// Get featured products (by sales)
export async function getFeaturedProducts(limit: number = 10): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({ active: true })
      .sort({ sales: -1 })
      .limit(limit)
      .lean();
    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    return populatedProducts.filter(p => p !== null) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get featured products");
  }
}

// Get new arrivals
export async function getNewArrivals(limit: number = 12): Promise<ProductResponse[]> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const products = await Product.find({ 
      active: true,
      badge: 'new',
      $or: [
        { created_at: { $gte: thirtyDaysAgo } }
      ]
    })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();
    
    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    return populatedProducts.filter(p => p !== null) as ProductResponse[];
  } catch (error) {
    console.error("Get new arrivals error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to get new arrivals");
  }
}

// Get products by badge (NEW, SALE, etc.)
export async function getProductsByBadge(badge: string): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({
      badge: badge,
      active: true
    }).lean();

    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    return populatedProducts.filter(p => p !== null) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get badge products");
  }
}

// Get categories with products
export async function getCategoriesWiseProducts(): Promise<CategoryWithProducts[]> {
  try {
    const categories = await getCategories();

    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.find({
          categoryId: new mongoose.Types.ObjectId(category._id),
          active: true,
        }).lean();

        const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));

        return {
          ...category,
          products: populatedProducts.filter(p => p !== null) as ProductResponse[],
        };
      })
    );

    return categoriesWithProducts;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to get categories wise products"
    );
  }
}

// Get related products by category
export async function getRelatedProducts(productId: string, categoryId: string, limit: number = 8): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({
      categoryId: new mongoose.Types.ObjectId(categoryId),
      active: true,
      _id: { $ne: new mongoose.Types.ObjectId(productId) }
    })
      .limit(limit)
      .lean();

    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    return populatedProducts.filter(p => p !== null) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get related products");
  }
}

// Get products by subcategory slug
export async function getProductsBySubCategory(subSlug: string): Promise<ProductResponse[]> {
  try {
    const subCategoryDoc = await SubCategory.findOne({
      slug: subSlug,
      active: true,
    }).lean();

    if (!subCategoryDoc) {
      return [];
    }

    const products = await Product.find({
      subCategoryId: new mongoose.Types.ObjectId(subCategoryDoc._id),
      active: true,
    }).lean();

    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    return populatedProducts.filter(p => p !== null) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get products by subcategory");
  }
}

// Get products by category/subcategory slug
export async function getProductsByCategoryAndSubCategory(
  categorySlug: string,
  subCategorySlug: string
): Promise<ProductResponse[]> {
  try {
    // First get the category
    const categoryDoc = await Category.findOne({
      slug: categorySlug,
      active: true,
    }).lean();

    if (!categoryDoc) {
      return [];
    }

    // Then get the subcategory
    const subCategoryDoc = await SubCategory.findOne({
      slug: subCategorySlug,
      categoryId: new mongoose.Types.ObjectId(categoryDoc._id),
      active: true,
    }).lean();

    if (!subCategoryDoc) {
      return [];
    }

    // Get products that match both category and subcategory
    const products = await Product.find({
      categoryId: new mongoose.Types.ObjectId(categoryDoc._id),
      subCategoryId: new mongoose.Types.ObjectId(subCategoryDoc._id),
      active: true,
    }).lean();

    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    return populatedProducts.filter(p => p !== null) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get products by category and subcategory");
  }
}

// Get products by subcategory ID
export async function getProductsBySubCategoryId(subCategoryId: string): Promise<ProductResponse[]> {
  try {
    const products = await Product.find({
      subCategoryId: new mongoose.Types.ObjectId(subCategoryId),
      active: true,
    }).lean();

    const populatedProducts = await Promise.all(products.map(p => populateProduct(p)));
    return populatedProducts.filter(p => p !== null) as ProductResponse[];
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to get products by subcategory ID");
  }
}