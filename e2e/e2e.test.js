// @ts-check
import { test, expect } from "@playwright/test";
import { PromisePool } from "@supercharge/promise-pool";

const BASE_URL = process.env.BASE_URL || `https://vldszn-cv.vercel.app`;

// https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
test.use({
  // @ts-ignore
  extraHTTPHeaders: {
    "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
  },
});

test("main page", async ({ page }) => {
  // Go to the main page of the site (/index.html)
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | About me/);

  // check nav bar
  await expect(page.getByRole("link", { name: "Main" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Links" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "About me" })).toBeVisible();

  await expect(
    page.getByText(
      `Hi! My name is Vlad. I am a frontend/full-stack engineer based in Warsaw, Poland.`,
      { exact: true }
    )
  ).toBeVisible();
});

test("links page", async ({ page }) => {
  await page.goto(`${BASE_URL}/links.html`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | Links/);

  // check nav bar
  await expect(page.getByRole("link", { name: "Main" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Links" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Links" })).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Programming" })
  ).toBeVisible();

  await expect(page.getByRole("heading", { name: "Tools" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "etc" })).toBeVisible();
});

test("all links are valid", async ({ page, request }) => {
  await page.goto(`${BASE_URL}/links.html`);

  const allURLsOnPage = await page
    .locator("a")
    // @ts-ignore
    .evaluateAll((els) => els.map((el) => el?.href));

  const t1 = performance.now();

  // https://www.npmjs.com/package/@supercharge/promise-pool
  const { results, errors } = await PromisePool.withConcurrency(10)
    .for(allURLsOnPage)
    .withTaskTimeout(15000) // milliseconds (15 seconds)
    .process(async (url, index) => {
      const res = await request.get(url);

      // we only care about 404s
      if (res.status() === 404) {
        throw new Error(`404 error: ${url}`);
      }

      return {
        index,
        url,
        ok: res.ok(),
        status: res.status(),
        statusText: res.statusText(),
      };
    });

  const t2 = performance.now();

  const statusNot200 = results.filter((r) => r.status !== 200);
  const status404 = results.filter((r) => r.status === 404);
  const statusOk = results.filter((r) => r.status === 200);

  console.log({
    errors,
    statusNot200,
    linksProcessedCount: results?.length,
    allURLsOnPage: allURLsOnPage.length,
    timeToCheckAllLinks: t2 - t1,
  });

  expect(errors?.length).toBe(0);
  expect(status404?.length).toBe(0);
  expect(statusOk?.length).toBeGreaterThan(0);
});
