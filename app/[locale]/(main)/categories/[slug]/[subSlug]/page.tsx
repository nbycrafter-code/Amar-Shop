import { getProductsBySubCategory } from "@/queries/products";
import { PageSet } from "./PageSet";
import { getCategories } from "@/queries/categories";
import { getBrands } from "@/queries/brands";
import { getSizes } from "@/queries/sizes";
import { getColors } from "@/queries/colors";
import { getSubCategoryBySlug } from "@/queries/subcategories";

const SubCategoryWisePage = async ({ params }) => {
  const resolvedParams = await params;
  const subSlug = resolvedParams.subSlug;  

  const [categories, brands, sizes, colors, subCategoryData, products] =
    await Promise.all([
      getCategories(),
      getBrands(),
      getSizes(),
      getColors(),
      getSubCategoryBySlug(subSlug),
      getProductsBySubCategory(subSlug),
    ]);

  return (
    <PageSet
      categories={categories}
      brands={brands}
      sizes={sizes}
      colors={colors}
      subCategoryData={subCategoryData}
      products={products}
    />
  );
};

export default SubCategoryWisePage;