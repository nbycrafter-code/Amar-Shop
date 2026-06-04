import { getCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";

const CategoriesPage = async({}) => {

    const categories = await getCategories();

  return (
    <PageSet categories={categories} />
  );
};

export default CategoriesPage;
