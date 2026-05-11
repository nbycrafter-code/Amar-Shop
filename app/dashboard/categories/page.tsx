import { getAllCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";
import { initialCategories } from "../data/initialData";

const CategoriesPage = async() => {
  // const categoriesResponse = await getAllCategories();
  return (
    <PageSet categoriesResponse={initialCategories} />
  );
};

export default CategoriesPage;