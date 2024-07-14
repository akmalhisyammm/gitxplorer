# GitXplorer

Web application to explore GitHub organizations and their repositories with ease, integrated with [GitHub REST API](https://docs.github.com/en/rest).

## Motivation

The motivation behind GitXplorer is to create a seamless and efficient way to explore GitHub organizations and their repositories. As developers, we often need to search for specific organizations, view their details, and open their repositories. Existing tools and interfaces can be cumbersome and slow. GitXplorer aims to streamline this process, making it faster and more intuitive to find GitHub organizations and their repositories.

## Features

- Quick search and filter of GitHub organizations and their repositories.
- Detailed view of organization and repository information.
- Configurable theme, it will respect the system's theme initially, but you can always change it.
- Utilization of Server Components and Client Components for maximum performance.
- Fully responsive and user-friendly interface with a modern design.

## Tech Stack

- [Next.js](https://nextjs.org/) as the React framework for the web
- [Shadcn UI](https://ui.shadcn.com/) as the component-based UI library
- [GitHub Actions](https://github.com/features/actions) as the CI/CD part of the application
- [Vercel](https://vercel.com/) as the deployment platform

## Requirements

You only need these software packages to run this application:

- [Node.js](https://nodejs.org/en)
- [Bun](https://bun.sh/) (optional — you can use another package manager like `npm`, `yarn`, etc.)

## Development

To start development quickly, please follow the steps below:

```bash
git clone https://github.com/akmalhisyammm/gitxplorer.git
cd gitxplorer
bun install
bun dev
```

To create a production build, follow these steps:

```bash
bun run build
bun start
```

## Tests

There are two test libraries used in this project, [Vitest](https://vitest.dev/) for unit tests and [Playwright](https://playwright.dev/) for end-to-end tests.

To run unit tests, do the commands below:

```bash
bun run test
bun test:ci
```

To run end-to-end tests, do the commands below:

```bash
bun e2e
bun e2e:ci
```


## Credits

- Icons made by [Flaticon](https://www.flaticon.com/).

## License

This project is licensed under the MIT License. Please see the [LICENSE](./LICENSE) for more information.
