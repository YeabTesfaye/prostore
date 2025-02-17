import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getUserByUserId } from '@/data/user';
import PaymentMethodForm from './payment-method-form';
import CheckoutSteps from '@/components/checkout-steps';

export const metadata: Metadata = {
  title: 'Payment Method',
};

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/sign-in?callbackUrl=/payment-method');
  }

  const user = await getUserByUserId(userId);

  const preferredPaymentMethod = user?.paymentMethod ?? null;

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={preferredPaymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
