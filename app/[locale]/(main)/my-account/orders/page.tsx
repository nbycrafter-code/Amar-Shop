
import { getOrdersByUserId } from "@/queries/orders";
import { PageSet } from "./PageSet";
import { auth } from "@/auth";
import { getSetting } from "@/queries/settings";



const OrdersPage = async() => {
  const session = await auth();
  const settings = await getSetting();
  const orders = await getOrdersByUserId(session?.user?.id);
  
  return (
    <PageSet settings={settings} orders={orders} />
  );
};

export default OrdersPage;
