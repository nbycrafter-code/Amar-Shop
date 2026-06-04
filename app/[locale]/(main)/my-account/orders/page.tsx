
import { getOrdersByUserId } from "@/queries/orders";
import { PageSet } from "./PageSet";
import { auth } from "@/auth";



const OrdersPage = async() => {
  const session = await auth();
  const orders = await getOrdersByUserId(session?.user?.id);
  

  return (
    <PageSet orders={orders} />
  );
};

export default OrdersPage;
