import { expect, type Page, test } from '@playwright/test';

const renderPage = async (page: Page, route?: string) => {
  const loadedRoute = route ? route : '/';

  await page.goto(loadedRoute);
  await expect(page).toHaveURL(loadedRoute);
};

test('should render the application properly', async ({ page }) => {
  // Load the page and check if it's loaded properly.
  await renderPage(page);

  // Sanity checks for markups, check header and footer.
  await expect(page.getByText('GitXplorer')).toBeVisible();
  await expect(
    page.getByText(`© ${new Date().getFullYear()} • Muhammad Akmal Hisyam`),
  ).toBeVisible();

  // Should also render a link to author's personal website.
  const linkToSource = page.getByRole('link', {
    name: 'Muhammad Akmal Hisyam',
  });
  await expect(linkToSource).toBeVisible();
  await expect(linkToSource).toHaveAttribute(
    'href',
    'https://akmalhisyam.my.id',
  );
});

test('should render home page properly', async ({ page }) => {
  // Load the page and check if it's loaded properly.
  await renderPage(page);

  // Check if the home page is rendered properly.
  await expect(page.getByText('Organizations')).toBeVisible();
  await expect(
    page.getByText(
      'Select an organization to view its repositories, members, and more.',
    ),
  ).toBeVisible();
});

test('should render 404 page when accessing invalid route', async ({
  page,
}) => {
  // Load the page and check if it's loaded properly.
  await renderPage(page, '/not/found/page');

  // Check if the 404 page is rendered properly.
  await expect(page.getByText('404 | Not Found')).toBeVisible();
  await expect(
    page.getByText('The page you are looking for does not exist.'),
  ).toBeVisible();
});
