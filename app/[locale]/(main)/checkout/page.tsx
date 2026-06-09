// app/checkout/page.tsx

import { getSetting } from "@/queries/settings";
import { PageSet } from "./PageSet";


export default async function CheckoutPage() {
  const settings = await getSetting();

  return <PageSet settings={settings} />;
}