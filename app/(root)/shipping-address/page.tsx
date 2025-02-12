import { auth } from '@/auth';
import { getUserByUserId } from '@/data/user';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ShippingAddressForm from './shipping-address-form';
import { shippingAddress } from '@/types';
import CheckoutSteps from '@/components/checkout-steps';

export const metadata: Metadata = {
  title: 'Shipping Address',
};
const ShippingAddressPage = async () => {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect('/');

  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in?callbackUrl=/shipping-address');
  }

  const user = await getUserByUserId(userId);

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user?.address as shippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
