'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { formUrlQuery } from '@/lib/utils';

type Props = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(page);
  // Handle Page Change
  const onClick = (btnType: string) => {
    let pageValue = currentPage;

    if (btnType === 'next') {
      pageValue = currentPage + 1;
    } else if (btnType === 'prev') {
      pageValue = currentPage - 1;
    }
    if (pageValue > 0 && pageValue <= totalPages) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: urlParamName || 'page',
        value: pageValue.toString(),
      });
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
