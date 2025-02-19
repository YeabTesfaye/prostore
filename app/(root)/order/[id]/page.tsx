import { getOrderById } from '@/lib/actions/order.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';

export const metadata: Metadata = {
  title: 'Order Details',
};
const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  const { id } = params;
  const order = await getOrderById(id);
  if (!order) notFound();
  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        payPalClientId={process.env.PAYPAL_CLIENT_ID!}
      />
    </>
  );
};

export default OrderDetailsPage;
