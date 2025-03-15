// This is a server component
import EditOrderClient from '@/components/EditOrderClient';

export default async function EditOrderPage({ params }: { params: { id: string } }) {
  // Await the params to satisfy Next.js requirements
  const id = await Promise.resolve(params.id);
  
  return <EditOrderClient id={id} />;
} 