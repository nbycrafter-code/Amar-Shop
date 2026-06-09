import { getCategories } from "@/queries/categories";
import { PageSet } from "./PageSet";
import { getSetting } from "@/queries/settings";

const CategoriesPage = async({}) => {
  const settings = await getSetting();
  const categories = await getCategories();

  return (
    <PageSet settings={settings} categories={categories} />
  );
};

export default CategoriesPage;
