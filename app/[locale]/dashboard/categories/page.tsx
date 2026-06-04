import { getAllCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";
import { getSubCategories } from "@/queries/subcategories";

const CategoriesPage = async() => {
  const categoriesResponse = await getAllCategories();
    const subCategoriesResponse = await getSubCategories();
  return (
    <PageSet categoriesResponse={categoriesResponse}  subCategoriesResponse={subCategoriesResponse} />
  );
};

export default CategoriesPage;