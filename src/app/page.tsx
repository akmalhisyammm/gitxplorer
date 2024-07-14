import { Users } from 'lucide-react';
import Link from 'next/link';

import { FilterMenu } from '@/components/filter-menu';
import { PaginationGroup } from '@/components/pagination-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { octokit } from '@/lib/octokit';

const Home = async ({
  searchParams,
}: {
  searchParams: Record<
    'q' | 'sort' | 'order' | 'per_page' | 'page',
    string | undefined
  >;
}) => {
  const q = `${searchParams.q || ''} type:org`;
  const sort = (searchParams.sort || 'followers') as
    | 'followers'
    | 'repositories'
    | 'joined';
  const order = (searchParams.order || 'desc') as 'desc' | 'asc';
  const per_page = Number(searchParams.per_page) || 12;
  const page = Number(searchParams.page) || 1;

  const response = await octokit
    .request('GET /search/users', {
      q,
      sort,
      order,
      per_page,
      page,
    })
    .catch(() => ({
      data: {
        total_count: 0,
        incomplete_results: false,
        items: [],
      },
    }));

  const organizations = response.data.items;
  const totalPage = Math.ceil(response.data.total_count / per_page);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Organizations</h1>
        <small className="text-sm text-muted-foreground">
          Select an organization to view its repositories, members, and more.
        </small>
      </div>
      <FilterMenu
        searchPlaceholder="Search organizations"
        sortOptions={['followers', 'repositories', 'joined']}
        pathname="/"
        searchParams={searchParams}
      />
      {organizations.length ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((organization) => (
              <Link key={organization.id} href={`/${organization.login}`}>
                <Card className="h-full cursor-pointer hover:text-blue-800 dark:hover:text-blue-300">
                  <CardHeader className="space-y-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={organization.avatar_url}
                        alt={organization.login}
                      />
                      <AvatarFallback>{organization.login[0]}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="pb-1 overflow-hidden text-ellipsis">
                      {organization.login}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
          <PaginationGroup
            page={page}
            totalPage={totalPage}
            hasMore={page < totalPage}
            pathname="/"
            searchParams={searchParams}
          />
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center h-80">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <Users size={80} />
            </div>
            <CardTitle>No organizations found</CardTitle>
          </CardHeader>
          <CardContent>
            {searchParams.q || searchParams.sort || searchParams.order ? (
              <CardDescription>
                There are no organizations matching the search criteria.
              </CardDescription>
            ) : (
              <CardDescription>
                There are no organizations to display at the moment.
              </CardDescription>
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default Home;
