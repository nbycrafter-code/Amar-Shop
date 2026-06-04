import { getAllSizes } from "@/queries/sizes";
import { PageSet } from "./PageSet";
import { getAllColors } from "@/queries/colors";


const SizesColorsPage = async() => {
  const sizesResponse = await getAllSizes();
  const colorsResponse = await getAllColors();
  return (
    <PageSet sizesData={sizesResponse} colorsData={colorsResponse} />
  );
};

export default SizesColorsPage;