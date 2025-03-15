// This is a server component
import OrderViewClient from '@/components/OrderViewClient';

export default async function OrderPage({ params }: { params: { id: string } }) {
  // Await the params to satisfy Next.js requirements
  const id = await Promise.resolve(params.id);
  
  return <OrderViewClient id={id} />;
} 