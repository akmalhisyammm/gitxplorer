import {
  BookMarked,
  CircleDot,
  GitFork,
  Link as LucideLink,
  Mail,
  MapPin,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import relativeTime from 'dayjs/plugin/relativeTime';

import { APP_NAME, APP_URL } from '@/constants/app';
import { FilterMenu } from '@/components/filter-menu';
import { PaginationMenu } from '@/components/pagination-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { dayjsWithPlugins } from '@/lib/day';
import { octokit } from '@/lib/octokit';

import type { Metadata } from 'next';

export const generateMetadata = async ({
  params,
}: {
  params: {
    organization: string;
  };
}): Promise<Metadata> => {
  const response = await octokit.request('GET /orgs/{org}', {
    org: params.organization,
  });

  const organization = response.data;

  return {
    title: organization.login,
    description: organization.description,
    alternates: {
      canonical: `/${organization.login}`,
    },
    openGraph: {
      title: `${organization.login} | ${APP_NAME}`,
      url: `${APP_URL}/${organization.login}`,
      description: organization.description || undefined,
    },
  };
};

const OrganizationDetail = async ({
  params,
  searchParams,
}: {
  params: {
    organization: string;
  };
  searchParams: Record<
    'q' | 'sort' | 'order' | 'per_page' | 'page',
    string | undefined
  >;
}) => {
  const q = `${searchParams?.q || ''} org:${params.organization}`;
  const sort = (searchParams?.sort || 'stars') as
    | 'stars'
    | 'forks'
    | 'help-wanted-issues'
    | 'updated';
  const order = (searchParams?.order || 'desc') as 'desc' | 'asc';
  const per_page = Number(searchParams?.per_page) || 12;
  const page = Number(searchParams?.page) || 1;

  const organizationResponse = await octokit.request('GET /orgs/{org}', {
    org: params.organization,
  });

  const organization = organizationResponse.data;

  const repositoriesResponse = await octokit.request(
    'GET /search/repositories',
    {
      q,
      sort,
      order,
      per_page,
      page,
    },
  );

  const repositories = repositoriesResponse.data.items;
  const totalPage = Math.ceil(repositoriesResponse.data.total_count / per_page);

  return (
    <>
      <section>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{organization.login}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      <section>
        <div className="flex flex-col items-center gap-6 p-6 border rounded-lg sm:flex-row">
          <Avatar className="w-full h-full sm:w-36 sm:h-36 max-w-80">
            <AvatarImage
              src={organization.avatar_url}
              alt={organization.login}
            />
            <AvatarFallback>{organization.login[0]}</AvatarFallback>
          </Avatar>
          <div className="w-full space-y-4">
            <h1 className="text-2xl font-bold">{organization.login}</h1>
            <p className="text-muted-foreground">
              {organization.description || '(No description)'}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <BookMarked size={16} className="text-muted-foreground" />
                <small className="text-muted-foreground">
                  {organization.public_repos} repositories
                </small>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} className="text-muted-foreground" />
                <small className="text-muted-foreground">
                  {organization.followers} followers
                </small>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={16} className="text-muted-foreground" />
                <small className="text-muted-foreground">
                  {organization.location || '(Unknown location)'}
                </small>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {organization.blog && (
                <div className="flex items-center gap-1">
                  <LucideLink size={16} />
                  <Link
                    href={organization.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {organization.blog}
                  </Link>
                </div>
              )}
              {organization.twitter_username && (
                <div className="flex items-center gap-1">
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    width="16"
                    height="16"
                  >
                    <title>X</title>
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                  <Link
                    href={`https://twitter.com/${organization.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    @{organization.twitter_username}
                  </Link>
                </div>
              )}
              {organization.email && (
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <Link
                    href={`mailto:${organization.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {organization.email}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Repositories</h1>
          <small className="text-sm text-muted-foreground">
            Select a repository to view its commits, issues, and more.
          </small>
        </div>

        <FilterMenu
          searchPlaceholder="Search repositories"
          sortOptions={['stars', 'forks', 'help-wanted-issues', 'updated']}
          pathname={`/${params.organization}`}
          searchParams={searchParams}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repositories.map((repository) => (
            <Link
              key={repository.id}
              href={`/${params.organization}/${repository.name}`}
            >
              <Card className="flex flex-col justify-between h-full cursor-pointer hover:text-blue-500 dark:hover:text-blue-400">
                <CardHeader className="space-y-4">
                  <Badge variant="secondary" className="capitalize w-fit">
                    {repository.visibility}
                  </Badge>
                  <CardTitle>{repository.name}</CardTitle>
                  <CardDescription>{repository.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap items-center gap-4">
                    {repository.language && (
                      <div className="flex items-center gap-1">
                        <small className="text-muted-foreground">
                          {repository.language}
                        </small>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-muted-foreground" />
                      <small className="text-muted-foreground">
                        {repository.stargazers_count}
                      </small>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork size={16} className="text-muted-foreground" />
                      <small className="text-muted-foreground">
                        {repository.forks_count}
                      </small>
                    </div>
                    <div className="flex items-center gap-1">
                      <CircleDot size={16} className="text-muted-foreground" />
                      <small className="text-muted-foreground">
                        {repository.open_issues_count}
                      </small>
                    </div>
                  </div>
                  <div>
                    <small className="text-muted-foreground">
                      Updated{' '}
                      {dayjsWithPlugins(repository.updated_at, [
                        relativeTime,
                      ]).fromNow()}
                    </small>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <PaginationMenu
          page={page}
          totalPage={totalPage}
          pathname={`/${params.organization}`}
          searchParams={searchParams}
        />
      </section>
    </>
  );
};

export default OrganizationDetail;
