// app/order-success/page.tsx
import { getSetting } from "@/queries/settings";
import { PageSet } from "./PageSet";

const OrderSuccessPage = async() => {
  const settings = await getSetting();

  return (
    <PageSet settings={settings} />
  );
}

export default OrderSuccessPage;