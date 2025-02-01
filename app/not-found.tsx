'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Image
        src="/images/logo.svg"
        width={48}
        height={48}
        priority
        alt={`${APP_NAME} logo`}
      />
      <div className="p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-destructive">
          The page you are looking for does not exist.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
