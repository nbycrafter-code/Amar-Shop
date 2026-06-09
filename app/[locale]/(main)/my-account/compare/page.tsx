import { getSetting } from "@/queries/settings";
import { PageSet } from "./PageSet";

export default async function ComparePage() {
  const settings = await getSetting();

  return <PageSet settings={settings} />;
}