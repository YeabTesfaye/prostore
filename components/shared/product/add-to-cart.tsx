'use client';
import { Minus, Plus, Loader } from 'lucide-react';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CartItem, Cart } from '@/types';
import { ToastAction } from '@/components/ui/toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';

const AddToCart = ({
  item,
  cart,
}: {
  item: Omit<CartItem, 'cartId'>;
  cart?: Cart;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Remove item from cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);

    toast({
      variant: res.success ? 'default' : 'destructive',
      description: res.message,
    });

    return;
  };
  const handleAddToCart = async () => {
    startTransition(async () => {});
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
        description: res.message,
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

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to cart
    </Button>
  );
};

export default AddToCart;
