import { getSetting } from "@/queries/settings";
import { PageSet } from "./PageSet";

export default async function AccountDetailsPage() {
  const settings = await getSetting();

  return <PageSet settings={settings} />;
}