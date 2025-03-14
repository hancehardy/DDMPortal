// This is a server component
import OrderViewClient from '@/components/OrderViewClient';

export default function OrderPage({ params }: { params: { id: string } }) {
  return <OrderViewClient id={params.id} />;
} 