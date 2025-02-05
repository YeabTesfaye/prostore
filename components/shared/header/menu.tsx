import { EllipsisVertical, ShoppingCart, UserIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

import { Button } from '@/components/ui/button';
import ModeToogle from './mode-toggle';
import Link from 'next/link';
import UserButton from './user-button';

const Menu = () => {
  return (
    <>
      <div className="flex justify-end gap-3">
        <nav className="md:flex hidden w-full max-w-xs gap-1">
          <ModeToogle />
          <Button asChild variant="ghost">
            <Link href="/cart">
              <ShoppingCart />
              Cart
            </Link>
          </Button>
          <UserButton />
        </nav>
        <nav className="md:hidden">
          <Sheet>
            <SheetTrigger className="align-middle">
              <EllipsisVertical />
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start">
              <SheetTitle>Menu</SheetTitle>
              <ModeToogle />
              <Button asChild variant="ghost">
                <Link href="/cart">
                  <ShoppingCart />
                </Link>
              </Button>
              <UserButton />
              <SheetDescription></SheetDescription>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
};

export default Menu;
