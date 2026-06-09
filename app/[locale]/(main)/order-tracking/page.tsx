// app/order-tracking/page.tsx
import { getSetting } from "@/queries/settings";
import { PageSet } from "./PageSet";

const OrderTrackingPage = async() => {
  const settings = await getSetting();

  return <PageSet settings={settings} />;
};

export default OrderTrackingPage;