import { notFound } from 'next/navigation';
import {
  BookDashed,
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
import { PaginationGroup } from '@/components/pagination-group';
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

type OrganizationDetailProps = {
  params: {
    organization: string;
  };
  searchParams: Record<
    'q' | 'sort' | 'order' | 'per_page' | 'page',
    string | undefined
  >;
};

export const generateMetadata = async ({
  params,
}: OrganizationDetailProps): Promise<Metadata> => {
  const response = await octokit
    .request('GET /orgs/{org}', {
      org: params.organization,
    })
    .catch(() => ({
      data: null,
    }));

  const organization = response.data;

  return {
    title: organization?.login || 'Not Found',
    description:
      organization?.description ||
      'The page you are looking for does not exist.',
    alternates: {
      canonical: `/${organization?.login || params.organization}`,
    },
    openGraph: {
      title: `${organization?.login || 'Not Found'} | ${APP_NAME}`,
      url: `${APP_URL}/${organization?.login || params.organization}`,
      description:
        organization?.description ||
        'The page you are looking for does not exist.',
    },
  };
};

const OrganizationDetail = async ({
  params,
  searchParams,
}: OrganizationDetailProps) => {
  const q = `${searchParams.q || ''} org:${params.organization}`;
  const sort = (searchParams.sort || 'stars') as
    | 'stars'
    | 'forks'
    | 'help-wanted-issues'
    | 'updated';
  const order = (searchParams.order || 'desc') as 'desc' | 'asc';
  const per_page = Number(searchParams.per_page) || 12;
  const page = Number(searchParams.page) || 1;

  const organizationResponse = await octokit
    .request('GET /orgs/{org}', {
      org: params.organization,
    })
    .catch(async () => {
      const response = await octokit
        .request('GET /users/{username}', {
          username: params.organization,
        })
        .catch(() => notFound());

      return {
        data: {
          ...response.data,
          description: response.data.bio,
        },
      };
    });

  const repositoriesResponse = await octokit
    .request('GET /search/repositories', {
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

  const organization = organizationResponse.data;
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
        <Card className="flex flex-col items-center gap-6 p-6 sm:flex-row">
          <Avatar className="w-full h-full sm:w-36 sm:h-36 max-w-80">
            <AvatarImage
              src={organization.avatar_url}
              alt={organization.login}
            />
            <AvatarFallback>{organization.login[0]}</AvatarFallback>
          </Avatar>
          <div className="w-full space-y-4">
            <h1 className="text-2xl font-bold">{organization.login}</h1>
            {organization.description && (
              <p className="text-muted-foreground">
                {organization.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookMarked size={16} />
                <small className="text-sm">
                  {organization.public_repos} repositories
                </small>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users size={16} />
                <small className="text-sm">
                  {organization.followers} followers
                </small>
              </div>
              {organization.location && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin size={16} />
                  <small className="text-sm">{organization.location}</small>
                </div>
              )}
            </div>
            {(organization.blog ||
              organization.twitter_username ||
              organization.email) && (
              <div className="flex flex-wrap items-center gap-4">
                {organization.blog && (
                  <div className="flex items-center gap-1">
                    <LucideLink size={16} />
                    <Link
                      href={organization.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-800 hover:underline dark:text-blue-300"
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
                      className="text-sm text-blue-800 hover:underline dark:text-blue-300"
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
                      className="text-sm text-blue-800 hover:underline dark:text-blue-300"
                    >
                      {organization.email}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Repositories</h1>
          <small className="text-sm text-muted-foreground">
            Select a repository to view its commits, contributors, and more.
          </small>
        </div>
        <FilterMenu
          searchPlaceholder="Search repositories"
          sortOptions={['stars', 'forks', 'help-wanted-issues', 'updated']}
          pathname={`/${params.organization}`}
          searchParams={searchParams}
        />
        {repositories.length ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {repositories.map((repository) => (
                <Link
                  key={repository.id}
                  href={`/${params.organization}/${repository.name}`}
                >
                  <Card className="flex flex-col justify-between h-full cursor-pointer hover:text-blue-800 dark:hover:text-blue-300">
                    <CardHeader className="space-y-4">
                      <Badge className="capitalize w-fit">
                        {repository.visibility}
                      </Badge>
                      <CardTitle className="pb-1 text-hidden text-ellipsis">
                        {repository.name}
                      </CardTitle>
                      <CardDescription>
                        {repository.description}
                      </CardDescription>
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
                          <GitFork
                            size={16}
                            className="text-muted-foreground"
                          />
                          <small className="text-muted-foreground">
                            {repository.forks_count}
                          </small>
                        </div>
                        <div className="flex items-center gap-1">
                          <CircleDot
                            size={16}
                            className="text-muted-foreground"
                          />
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
            <PaginationGroup
              page={page}
              totalPage={totalPage}
              hasMore={page < totalPage}
              pathname={`/${params.organization}`}
              searchParams={searchParams}
            />
          </>
        ) : (
          <Card className="flex flex-col items-center justify-center h-80">
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <BookDashed size={80} />
              </div>
              <CardTitle>No repositories found</CardTitle>
            </CardHeader>
            <CardContent>
              {searchParams.q || searchParams.sort || searchParams.order ? (
                <CardDescription>
                  There are no repositories matching the search criteria.
                </CardDescription>
              ) : (
                <CardDescription>
                  This organization has no public repositories.
                </CardDescription>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
};

export default OrganizationDetail;
