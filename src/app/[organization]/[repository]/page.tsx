import {
  CircleDot,
  GitFork,
  History,
  Link as LucideLink,
  Scale,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import relativeTime from 'dayjs/plugin/relativeTime';

import { APP_NAME, APP_URL } from '@/constants/app';
import { PaginationGroup } from '@/components/pagination-group';
import { RenderHTML } from '@/components/render-html';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { dayjsWithPlugins } from '@/lib/day';
import { octokit } from '@/lib/octokit';

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

type RepositoryDetailProps = {
  params: {
    organization: string;
    repository: string;
  };
  searchParams: {
    page?: string;
  };
};

export const generateMetadata = async ({
  params,
}: RepositoryDetailProps): Promise<Metadata> => {
  const repositoryResponse = await octokit.request(
    'GET /repos/{owner}/{repo}',
    {
      owner: params.organization,
      repo: params.repository,
    },
  );

  const repository = repositoryResponse.data;

  return {
    title: repository.full_name,
    description: repository.description,
    alternates: {
      canonical: `/${repository?.full_name}`,
    },
    openGraph: {
      title: `${repository?.full_name} | ${APP_NAME}`,
      url: `${APP_URL}/${repository?.full_name}`,
      description: repository.description || undefined,
    },
  };
};

const RepositoryDetail = async ({
  params,
  searchParams,
}: RepositoryDetailProps) => {
  const page = Number(searchParams.page) || 1;

  const repositoryResponse = await octokit
    .request('GET /repos/{owner}/{repo}', {
      owner: params.organization,
      repo: params.repository,
    })
    .catch(() => ({
      data: null,
    }));

  const contributorsResponse = await octokit
    .request('GET /repos/{owner}/{repo}/contributors', {
      owner: params.organization,
      repo: params.repository,
    })
    .catch(() => ({
      data: [],
    }));

  const commitsResponse = await octokit
    .request('GET /repos/{owner}/{repo}/commits', {
      owner: params.organization,
      repo: params.repository,
      per_page: 6,
      page,
    })
    .catch(() => ({
      headers: {
        link: '',
      },
      data: [],
    }));

  const readmeResponse = await octokit
    .request('GET /repos/{owner}/{repo}/readme', {
      owner: params.organization,
      repo: params.repository,
    })
    .catch(() => ({
      data: null,
    }));

  const repository = repositoryResponse.data;
  const contributors = contributorsResponse.data;
  const commits = commitsResponse.data;
  const hasMoreCommits = commitsResponse.headers.link?.includes('rel="next"');

  let readmeHtml = '';

  if (readmeResponse.data && repository) {
    const readmeHtmlResponse = await octokit.request('POST /markdown', {
      text: Buffer.from(readmeResponse.data.content, 'base64').toString(),
    });

    readmeHtml = readmeHtmlResponse.data
      .replace(
        /href="([^http|https].*?)\//g,
        `href="https://raw.githubusercontent.com/${params.organization}/${params.repository}/${repository.default_branch}/$1/`,
      )
      .replace(
        /src="([^http|https].*?)\//g,
        `src="https://raw.githubusercontent.com/${params.organization}/${params.repository}/${repository.default_branch}/$1/`,
      );
  }

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
              <BreadcrumbLink href={`/${params.organization}`}>
                {params.organization}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{params.repository}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      <section className="flex flex-col items-center gap-2 lg:justify-between lg:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Avatar>
            <AvatarImage
              src={repository?.owner.avatar_url}
              alt={repository?.owner.login || params.organization}
            />
            <AvatarFallback>
              {repository?.owner.login[0] || params.organization[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-center">{repository?.name}</h1>
          <Badge variant="secondary">{repository?.visibility}</Badge>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star size={16} />
            <small className="text-sm">
              {repository?.stargazers_count} stars
            </small>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <GitFork size={16} />
            <small className="text-sm">{repository?.forks_count} forks</small>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CircleDot size={16} />
            <small className="text-sm">
              {repository?.open_issues_count} issues
            </small>
          </div>
        </div>
      </section>

      <Separator />

      <div className="flex flex-col-reverse gap-6 lg:flex-row">
        <div className="w-full space-y-4">
          <section className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">Commits</h1>
              <small className="text-sm text-muted-foreground">
                List of commits on branch <b>{repository?.default_branch}</b>.
              </small>
            </div>
            {commits.length ? (
              <>
                <div className="space-y-4">
                  {commits.map((commit) => (
                    <Card key={commit.sha}>
                      <CardHeader className="space-y-2">
                        <div className="flex items-center gap-2">
                          {commit.commit.verification?.verified ? (
                            <Badge
                              variant="secondary"
                              className="text-white bg-green-500 dark:bg-green-700 w-fit hover:bg-green-500/80 dark:hover:bg-green-700/80"
                            >
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="w-fit">
                              Unverified
                            </Badge>
                          )}
                          <small className="overflow-hidden text-muted-foreground text-ellipsis">
                            {commit.sha}
                          </small>
                        </div>
                        <CardTitle className="text-md">
                          {commit.commit.message.split('\n')[0]}
                        </CardTitle>
                      </CardHeader>
                      <CardFooter>
                        <div className="flex items-center gap-2">
                          {commit.author && (
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                src={commit.author.avatar_url}
                                alt={commit.author.login}
                              />
                              <AvatarFallback>
                                {commit.author.login[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {commit.commit.author?.date && (
                            <small className="text-sm">
                              {commit.author?.login} committed{' '}
                              {dayjsWithPlugins(commit.commit.author.date, [
                                relativeTime,
                              ]).fromNow()}
                            </small>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <PaginationGroup
                  page={page}
                  hasMore={hasMoreCommits}
                  pathname={`/${params.organization}/${params.repository}`}
                  searchParams={searchParams}
                />
              </>
            ) : (
              <Card className="flex flex-col items-center justify-center h-80">
                <CardHeader className="space-y-4">
                  <div className="flex justify-center">
                    <History size={80} />
                  </div>
                  <CardTitle>No commits found</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    There are no commits on branch{' '}
                    <b>{repository?.default_branch}</b>.
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </section>

          {Boolean(readmeHtml) && (
            <section className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">README</h1>
                <small className="text-sm text-muted-foreground">
                  The README file for this repository.
                </small>
              </div>
              <div className="p-6 border rounded-lg">
                <RenderHTML html={readmeHtml} />
              </div>
            </section>
          )}
        </div>

        <aside className="flex flex-col w-full gap-4 lg:max-w-96">
          <section className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">About</h1>
              <small className="text-sm text-muted-foreground">
                Information about this repository.
              </small>
            </div>
            {repository?.description && <p>{repository?.description}</p>}
            {repository?.homepage && (
              <div className="flex items-center gap-2">
                <LucideLink size={16} />
                <Link
                  href={repository?.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-800 hover:underline dark:text-blue-300"
                >
                  {repository?.homepage}
                </Link>
              </div>
            )}
            {Boolean(repository?.topics?.length) && (
              <div className="flex flex-wrap gap-2">
                {repository?.topics?.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            )}
            {repository?.license && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Scale size={16} />
                <small className="text-sm">{repository?.license.name}</small>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star size={16} />
              <small className="text-sm">
                {repository?.stargazers_count} stars
              </small>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitFork size={16} />
              <small className="text-sm">{repository?.forks_count} forks</small>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CircleDot size={16} />
              <small className="text-sm">
                {repository?.open_issues_count} issues
              </small>
            </div>
          </section>

          {Boolean(contributors.length) && (
            <section className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">Contributors</h1>
                <small className="text-sm text-muted-foreground">
                  List of contributors to this repository.
                </small>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {contributors.map((contributor) => (
                  <HoverCard key={contributor.id}>
                    <Link
                      href={`/${contributor.login}`}
                      passHref
                      legacyBehavior
                    >
                      <HoverCardTrigger>
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={contributor.avatar_url}
                            alt={contributor.login}
                          />
                          <AvatarFallback>
                            {contributor.login?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </HoverCardTrigger>
                    </Link>
                    <HoverCardContent>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={contributor.avatar_url}
                            alt={contributor.login}
                          />
                          <AvatarFallback>
                            {contributor.login?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-lg font-bold">
                            {contributor.login}
                          </h2>
                          <small className="text-muted-foreground">
                            {contributor.contributions} contributions
                          </small>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </>
  );
};

export default RepositoryDetail;
