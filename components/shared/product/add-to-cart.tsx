'use client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart } from '@/lib/actions/cart.actions';

const AddToCart = ({ item }: { item: Omit<CartItem, 'cartId'> }) => {
  const { toast } = useToast();
  const router = useRouter();
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
      return;
    }

    // Handle success add to cart
    if (res.success) {
      toast({
        description: `${item.name} added to cart`,
        action: (
          <ToastAction
            className="bg-primary text-white hover:bg-gray-800 dark:bg-blue-400 dark:hover:bg-blue-600"
            altText="Go To Cart"
            onClick={() => router.push('/cart')}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    }
  };
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus />
      Add to cart
    </Button>
  );
};

export default AddToCart;
