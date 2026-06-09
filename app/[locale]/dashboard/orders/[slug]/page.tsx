// app/dashboard/orders/[slug]/page.tsx
import { getOrderByOrderId } from "@/queries/orders";
import { PageSet } from "./PageSet";

interface PageProps {
  params: {
    slug: string;
  };
}

const SingleOrderDetailsPage = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch order data on server
  const order = await getOrderByOrderId(slug);
  console.log("==================================");
  console.log("==================================");
  console.log(slug);
  console.log(order);
  

  // Pass data to client component
  return <PageSet order={order} />;
};

export default SingleOrderDetailsPage;