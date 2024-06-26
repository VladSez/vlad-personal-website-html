// @ts-check
import { test, expect } from "@playwright/test";
import { PromisePool } from "@supercharge/promise-pool";

const BASE_URL = process.env.BASE_URL || `https://vldszn-cv.vercel.app`;

// https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation
// bypass vercel auth protection for e2e tests
test.use({
  // @ts-ignore
  extraHTTPHeaders: {
    "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
  },
});

test("/index.html", async ({ page }) => {
  // Go to the main page of the site (/index.html)
  await page.goto(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | About me/);

  // check open graph meta tags
  const metaDescription = page.locator('meta[property="description"]');
  await expect(metaDescription).toHaveAttribute(
    "content",
    "Vlad Sazonau is a frontend/full-stack enthusiast."
  );

  // open graph meta tags
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute("content", "About me");

  const ogImageAlt = page.locator('meta[property="og:image:alt"]');
  await expect(ogImageAlt).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog. About me."
  );

  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");

  expect(ogImageUrl).toBe(
    "https://vldszn-cv.vercel.app/assets/og-about-me.jpeg"
  );

  // twitter meta tags
  const twiiterMetaTitle = page.locator('meta[name="twitter:title"]');
  await expect(twiiterMetaTitle).toHaveAttribute("content", "About me");

  const twiiterMetaDescription = page.locator(
    'meta[name="twitter:description"]'
  );
  await expect(twiiterMetaDescription).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog."
  );

  const twitterImageUrl = await page
    .locator('meta[name="twitter:image"]')
    .getAttribute("content");

  expect(twitterImageUrl).toBe(
    "https://vldszn-cv.vercel.app/assets/og-about-me.jpeg"
  );

  // check nav bar
  await expect(page.getByRole("link", { name: "Main" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Links" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Videos" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "About me" })).toBeVisible();

  await expect(
    page.getByText(
      `Hi! My name is Vlad. I am a frontend/full-stack engineer based in Warsaw, Poland.`,
      { exact: true }
    )
  ).toBeVisible();

  // check footer
  const footer = page.getByRole("contentinfo");

  await expect(footer).toBeVisible();

  await expect(footer.getByRole("link", { name: "LinkedIn" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "CV" })).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "Website source" })
  ).toBeVisible();
});

test("/links.html", async ({ page }) => {
  await page.goto(`${BASE_URL}/links.html`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | Links/);

  // open graph meta tags
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute("content", "Links");

  const ogImageAlt = page.locator('meta[property="og:image:alt"]');
  await expect(ogImageAlt).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog. Links."
  );

  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");

  expect(ogImageUrl).toBe("https://vldszn-cv.vercel.app/assets/og-links.jpeg");

  // twitter meta tags
  const twiiterMetaTitle = page.locator('meta[name="twitter:title"]');
  await expect(twiiterMetaTitle).toHaveAttribute("content", "Links");

  const twiiterMetaDescription = page.locator(
    'meta[name="twitter:description"]'
  );
  await expect(twiiterMetaDescription).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog."
  );

  const twitterImageUrl = await page
    .locator('meta[name="twitter:image"]')
    .getAttribute("content");

  expect(twitterImageUrl).toBe(
    "https://vldszn-cv.vercel.app/assets/og-links.jpeg"
  );

  // check nav bar
  await expect(page.getByRole("link", { name: "Main" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Links" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Videos" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Links" })).toBeVisible();

  // check table of contents
  await expect(
    page.getByRole("heading", { name: "Table of Contents" })
  ).toBeVisible();

  const tableOfContents = page.getByTestId("table-of-contents");
  await expect(tableOfContents).toBeVisible();

  const programmingLink = tableOfContents.getByRole("link", {
    name: "programming",
  });
  await expect(programmingLink).toBeVisible();
  await expect(programmingLink).toHaveAttribute("href", "#programming");

  await programmingLink.click();
  expect(page.url()).toBe(`${BASE_URL}/links.html#programming`);

  const githubLink = tableOfContents.getByRole("link", { name: "github" });
  await expect(githubLink).toBeVisible();
  await expect(githubLink).toHaveAttribute("href", "#github");

  const toolsLink = tableOfContents.getByRole("link", { name: "tools" });
  await expect(toolsLink).toBeVisible();
  await expect(toolsLink).toHaveAttribute("href", "#tools");

  const etcLink = tableOfContents.getByRole("link", { name: "etc" });
  await expect(etcLink).toBeVisible();
  await expect(etcLink).toHaveAttribute("href", "#etc");

  const videosLink = tableOfContents.getByRole("link", { name: "videos" });
  await expect(videosLink).toBeVisible();
  await expect(videosLink).toHaveAttribute("href", "#videos");

  // check content

  const programmingSectionHeading = page.getByRole("heading", {
    name: "Programming",
  });
  await expect(programmingSectionHeading).toBeVisible();
  await expect(programmingSectionHeading).toHaveAttribute("id", "programming");

  const githubSectionHeading = page.getByRole("heading", { name: "Github" });
  await expect(githubSectionHeading).toBeVisible();
  await expect(githubSectionHeading).toHaveAttribute("id", "github");

  const toolsSectionHeading = page.getByRole("heading", { name: "Tools" });
  await expect(toolsSectionHeading).toBeVisible();
  await expect(toolsSectionHeading).toHaveAttribute("id", "tools");

  const etcSectionHeading = page.getByRole("heading", { name: "etc" });
  await expect(etcSectionHeading).toBeVisible();
  await expect(etcSectionHeading).toHaveAttribute("id", "etc");

  // check footer
  const footer = page.getByRole("contentinfo");

  await expect(footer).toBeVisible();

  await expect(footer.getByRole("link", { name: "LinkedIn" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "CV" })).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "Website source" })
  ).toBeVisible();
});

test("all links are valid on /links.html", async ({ page, request }) => {
  await page.goto(`${BASE_URL}/links.html`);

  const allURLsOnPage = await page
    .locator("a")
    // @ts-ignore
    .evaluateAll((els) => els.map((el) => el?.href));

  const t1 = performance.now();

  // https://www.npmjs.com/package/@supercharge/promise-pool
  const { results, errors } = await PromisePool.withConcurrency(12)
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

  const duplicateURLs = allURLsOnPage.filter(
    (url, index, self) => self.indexOf(url) !== index
  );

  console.log({
    errors,
    statusNot200,
    linksProcessedCount: results?.length,
    allURLsOnPage: allURLsOnPage.length,
    duplicateURLs,
    timeToCheckAllLinks: t2 - t1,
  });

  expect(errors?.length).toBe(0);
  expect(status404?.length).toBe(0);
  expect(duplicateURLs?.length).toBe(0);

  expect(statusOk?.length).toBeGreaterThan(0);
});

test("all links are valid on /index.html", async ({ page, request }) => {
  await page.goto(`${BASE_URL}/index.html`);

  const allURLsOnPage = await page
    .locator("a")
    // @ts-ignore
    .evaluateAll((els) => els.map((el) => el?.href));

  const t1 = performance.now();

  // https://www.npmjs.com/package/@supercharge/promise-pool
  const { results, errors } = await PromisePool.withConcurrency(5)
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

test("/videos.html", async ({ page }) => {
  await page.goto(`${BASE_URL}/videos.html`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | Videos/);

  // check open graph meta tags
  const metaDescription = page.locator('meta[property="description"]');
  await expect(metaDescription).toHaveAttribute(
    "content",
    "Vlad Sazonau is a frontend/full-stack enthusiast."
  );

  // open graph meta tags
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute("content", "Videos");

  const ogImageAlt = page.locator('meta[property="og:image:alt"]');
  await expect(ogImageAlt).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog. Videos."
  );

  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");

  expect(ogImageUrl).toBe("https://vldszn-cv.vercel.app/assets/og-videos.jpeg");

  // twitter meta tags
  const twiiterMetaTitle = page.locator('meta[name="twitter:title"]');
  await expect(twiiterMetaTitle).toHaveAttribute("content", "Videos");

  const twiiterMetaDescription = page.locator(
    'meta[name="twitter:description"]'
  );
  await expect(twiiterMetaDescription).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog."
  );

  const twitterImageUrl = await page
    .locator('meta[name="twitter:image"]')
    .getAttribute("content");

  expect(twitterImageUrl).toBe(
    "https://vldszn-cv.vercel.app/assets/og-videos.jpeg"
  );

  // check nav bar
  await expect(page.getByRole("link", { name: "Main" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Links" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Videos" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Videos" })).toBeVisible();

  const videosContainer = page.getByTestId("videos-list");
  await expect(videosContainer).toBeVisible();

  // check that youtube iframes are displayed on page
  const youtubeIframes = page.locator("iframe[src*='youtube.com']");
  await expect(youtubeIframes).toBeVisible();

  const videosCount = await youtubeIframes.count();
  expect(videosCount).toBeGreaterThan(0);

  // check footer
  const footer = page.getByRole("contentinfo");

  await expect(footer).toBeVisible();
  await expect(footer.getByRole("link", { name: "LinkedIn" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "CV" })).toBeVisible();
  await expect(
    footer.getByRole("link", { name: "Website source" })
  ).toBeVisible();
});
