import { getSetting } from "@/queries/settings";
import { PageSet } from "./PageSet";

export default async function WishlistPage() {
  const settings = await getSetting();

  return <PageSet settings={settings} />;
}