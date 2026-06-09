// app/my-account/dashboard/page.tsx
import { getSetting } from "@/queries/settings";
import { PageSet } from "./PageSet";

export default async function DashboardPage() {
  const settings = await getSetting();

  return <PageSet settings={settings} />;
}