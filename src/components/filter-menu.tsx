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

type FilterMenuProps = {
  searchPlaceholder: string;
  sortOptions: string[];
  pathname: string;
  searchParams: Record<
    'q' | 'sort' | 'order' | 'per_page' | 'page',
    string | undefined
  >;
};

export const FilterMenu = ({
  searchPlaceholder,
  sortOptions,
  pathname,
  searchParams,
}: FilterMenuProps) => {
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

  const onLimit = (value: string) => {
    router.replace(
      `${pathname}?${generateURLQuery({ ...searchParams, per_page: value, page: undefined })}`,
    );
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <Input
        type="search"
        placeholder={searchPlaceholder}
        defaultValue={searchParams.q}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full"
      />

      <Select
        defaultValue={searchParams.sort || sortOptions[0]}
        onValueChange={onSort}
      >
        <SelectTrigger className="w-full lg:w-72">
          <SelectValue placeholder="Sort">Select sort</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort</SelectLabel>
            {sortOptions.map((option) => (
              <SelectItem key={option} value={option} className="capitalize">
                {option.split('-').join(' ')}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.order || 'desc'}
        onValueChange={onOrder}
      >
        <SelectTrigger className="w-full lg:w-72">
          <SelectValue placeholder="Order">Select order</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Order</SelectLabel>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.per_page || '12'}
        onValueChange={onLimit}
      >
        <SelectTrigger className="w-full lg:w-72">
          <SelectValue placeholder="Limit">Select limit</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Limit</SelectLabel>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="18">18</SelectItem>
            <SelectItem value="24">24</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
