'use client';

import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateURLQuery } from '@/utils/url';

export const FilterMenu = ({
  searchPlaceholder,
  sortOptions,
  pathname,
  searchParams,
}: {
  searchPlaceholder: string;
  sortOptions: string[];
  pathname: string;
  searchParams: Record<
    'q' | 'sort' | 'order' | 'per_page' | 'page',
    string | undefined
  >;
}) => {
  const router = useRouter();

  const onSearch = useDebouncedCallback((value: string) => {
    router.replace(
      `${pathname}?${generateURLQuery({ ...searchParams, q: value, page: undefined })}`,
    );
  }, 500);

  const onSort = (value: string) => {
    router.replace(
      `${pathname}?${generateURLQuery({ ...searchParams, sort: value, page: undefined })}`,
    );
  };

  const onOrder = (value: string) => {
    router.replace(
      `${pathname}?${generateURLQuery({ ...searchParams, order: value, page: undefined })}`,
    );
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Input
        type="search"
        placeholder={searchPlaceholder}
        defaultValue={searchParams.q}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full"
      />

      <Select defaultValue={searchParams.sort} onValueChange={onSort}>
        <SelectTrigger
          className={`w-full md:w-1/4 ${searchParams.sort && 'capitalize'}`}
        >
          <SelectValue placeholder="Sort by">
            {searchParams.sort || 'Sort by'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option} className="capitalize">
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select defaultValue={searchParams.order} onValueChange={onOrder}>
        <SelectTrigger className="w-full md:w-1/4">
          <SelectValue placeholder="Order by">
            {searchParams.order
              ? searchParams.order === 'asc'
                ? 'Ascending'
                : 'Descending'
              : 'Order by'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Order by</SelectLabel>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
