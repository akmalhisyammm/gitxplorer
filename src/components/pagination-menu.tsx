import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '@/components/ui/pagination';
import { generateURLQuery } from '@/utils/url';

export const PaginationMenu = ({
  page,
  totalPage,
  pathname,
  searchParams,
}: {
  page: number;
  totalPage: number;
  pathname: string;
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  totalPage = totalPage > 80 ? 80 : totalPage;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`${pathname}?${generateURLQuery({ ...searchParams, page: (page - 1).toString() })}`}
            className={
              page === 1 ? 'pointer-events-none text-muted-foreground' : ''
            }
          />
        </PaginationItem>

        {page > 2 && totalPage > 3 && (
          <PaginationItem>
            <PaginationLink
              href={`${pathname}?${generateURLQuery({ ...searchParams, page: '1' })}`}
              isActive={page === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {page > 3 && totalPage > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {Array.from({ length: 3 }, (_, i) => {
          if (page === totalPage) {
            return i + page - 2;
          }
          if (page > 1) {
            return i + page - 1;
          }
          return i + page;
        }).map((i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href={`${pathname}?${generateURLQuery({ ...searchParams, page: i.toString() })}`}
              isActive={i === page}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        ))}

        {page < totalPage - 2 && totalPage > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {page < totalPage - 1 && totalPage > 3 && (
          <PaginationItem>
            <PaginationLink
              href={`${pathname}?${generateURLQuery({ ...searchParams, page: totalPage.toString() })}`}
              isActive={page === totalPage}
            >
              {totalPage}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={`${pathname}?${generateURLQuery({ ...searchParams, page: (page + 1).toString() })}`}
            className={
              page === totalPage
                ? 'pointer-events-none text-muted-foreground'
                : ''
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
