import { getProducts } from '@/queries/products';
import HomePage from './components/HomePage';
import { initialProducts, initialOrders } from './data/initialData';
import { getAllOrders } from '@/queries/orders';

export default async function Dashboard() {
  const products = await getProducts();
  const orders = await getAllOrders();

  return (
    <HomePage 
      products={products}
      orders={orders}
    />
  );
}