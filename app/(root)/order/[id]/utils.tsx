import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  deliverOrder,
  updateOrderToPaidByCOD,
} from '@/lib/actions/order.actions';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useTransition } from 'react';

// Check the loading status of the PayPal script
export function PrintLoadingState() {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  let status = '';

  if (isPending) {
    status = 'Loading PayPal...';
  } else if (isRejected) {
    status = 'Error in loading PayPal.';
  }
  return status;
}

// Button to makr the order as deliverd
export const MarkAsDeliveredButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <Button
      type="button"
      disabled={isPending}
      className="w-full"
      onClick={() =>
        startTransition(async () => {
          const res = await deliverOrder(orderId);
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message,
          });
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message,
          });
        })
      }
    >
      {isPending ? 'processing...' : 'Mark As Delivered'}
    </Button>
  );
};

export // Button To mark the order as paid
const MarkAsPaidButton = ({ orderId }: { orderId: string }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  return (
    <Button
      type="button"
      className="w-full"
      disabled={isPending}
      variant="default"
      onClick={() =>
        startTransition(async () => {
          const res = await updateOrderToPaidByCOD(orderId);
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message,
          });
        })
      }
    >
      {isPending ? 'processing...' : 'Mark As Paid'}
    </Button>
  );
};
