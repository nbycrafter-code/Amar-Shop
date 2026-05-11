import { getAllSizes } from "@/queries/sizes";
import { PageSet } from "./PageSet";
import { getAllColors } from "@/queries/colors";
import { initialColors, initialSizes } from "../data/initialData";


const SizesColorsPage = async() => {
  // const sizesResponse = await getAllSizes();
  // const colorsResponse = await getAllColors();
  return (
    <PageSet sizesData={initialSizes} colorsData={initialColors} />
  );
};

export default SizesColorsPage;