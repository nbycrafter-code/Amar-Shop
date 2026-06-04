import { getProductsByCategory } from "@/queries/products";
import { PageSet } from "./PageSet";
import { getCategories, getCategoryBySlug } from "@/queries/categories";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import { getSubCategoriesByCategory } from "@/queries/subcategories";

const CategoryWisePage = async ({ params }) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [categories, brands, sizes, colors, singleCategory, products] =
    await Promise.all([
      getCategories(),
      getBrands(),
      getSizes(),
      getColors(),
      getCategoryBySlug(slug),
      getProductsByCategory(slug),
    ]);

    const subcategories = await getSubCategoriesByCategory(singleCategory?.id);
    

  return (
    <PageSet
      categories={categories}
      brands={brands}
      sizes={sizes}
      colors={colors}
      products={products}
      categoryData={singleCategory}
      subcategories={subcategories}
    />
  );
};

export default CategoryWisePage;