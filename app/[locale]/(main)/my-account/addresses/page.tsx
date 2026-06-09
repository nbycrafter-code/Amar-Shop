import { getSetting } from "@/queries/settings";
import { PageSet } from "./PageSet";


const AddressesPage = async() => {
  const settings = await getSetting();

  return (
    <PageSet settings={settings} />
  );
};

export default AddressesPage;