import { getAllCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";

const CategoriesPage = async() => {
  const categoriesResponse = await getAllCategories();
  return (
    <PageSet categoriesResponse={categoriesResponse} />
  );
};

export default CategoriesPage;