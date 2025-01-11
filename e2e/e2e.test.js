// @ts-check
import { test, expect } from "@playwright/test";
import { PromisePool } from "@supercharge/promise-pool";

const BASE_URL = process.env.BASE_URL || `https://vladsazon.com`;

test("/index.html", async ({ page }) => {
  // Go to the main page of the site (/index.html)
  await page.goto(BASE_URL);
  await expect(page).toHaveURL(BASE_URL);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | About me/);

  await checkThatAllScriptsAreAttached(page);

  // check open graph meta tags
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog. Vlad Sazonau is a frontend/full-stack enthusiast."
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

  const OG_IMAGE_INDEX_URL = "https://vladsazon.com/assets/og-about-me.jpeg";

  expect(ogImageUrl).toBe(OG_IMAGE_INDEX_URL);

  // check that open graph image is accessible
  const ogImageResponse = await fetch(ogImageUrl ?? "").catch(console.error);

  expect(ogImageResponse?.ok).toBeTruthy();
  expect(ogImageResponse?.status).toBe(200);

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

  expect(twitterImageUrl).toBe(OG_IMAGE_INDEX_URL);

  // check that twitter image is accessible
  const twitterImageResponse = await fetch(twitterImageUrl ?? "").catch(
    console.error
  );

  expect(twitterImageResponse?.ok).toBeTruthy();
  expect(twitterImageResponse?.status).toBe(200);

  // check nav bar
  await checkNavLinks(page);

  // check heading
  await expect(page.getByRole("heading", { name: "About me" })).toBeVisible();

  // check main content
  const aboutMeSection = page.getByTestId("about-me-section");
  await expect(aboutMeSection).toBeVisible();

  // check footer
  await checkFooterLinks(page);
});

test("/links.html", async ({ page }) => {
  await page.goto(`${BASE_URL}/links.html`);
  await expect(page).toHaveURL(`${BASE_URL}/links.html`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | Links/);

  await checkThatAllScriptsAreAttached(page);

  // open graph meta tags
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog. Vlad Sazonau is a frontend/full-stack enthusiast."
  );

  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute("content", "Links");

  const ogImageAlt = page.locator('meta[property="og:image:alt"]');
  await expect(ogImageAlt).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog. Links."
  );

  const OG_IMAGE_LINKS_URL = "https://vladsazon.com/assets/og-links.jpeg";

  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");

  expect(ogImageUrl).toBe(OG_IMAGE_LINKS_URL);

  // check that open graph image is accessible
  const ogImageResponse = await fetch(ogImageUrl ?? "").catch(console.error);

  expect(ogImageResponse?.ok).toBeTruthy();
  expect(ogImageResponse?.status).toBe(200);

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

  expect(twitterImageUrl).toBe(OG_IMAGE_LINKS_URL);

  // check that twitter image is accessible
  const twitterImageResponse = await fetch(twitterImageUrl ?? "").catch(
    console.error
  );

  expect(twitterImageResponse?.ok).toBeTruthy();
  expect(twitterImageResponse?.status).toBe(200);

  // check nav bar
  await checkNavLinks(page);

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

  // check main content
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
  await checkFooterLinks(page);
});

test("all links are valid on /links.html and there are no duplicates", async ({
  page,
  request,
}) => {
  await page.goto(`${BASE_URL}/links.html`);
  await expect(page).toHaveURL(`${BASE_URL}/links.html`);

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
  await expect(page).toHaveURL(`${BASE_URL}/index.html`);

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

  await expect(page).toHaveURL(`${BASE_URL}/videos.html`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | Videos/);

  await checkThatAllScriptsAreAttached(page);

  const cssFileLiteYoutube = page
    .locator('link[rel="stylesheet"]')
    .and(
      page.locator(
        'link[href="https://cdnjs.cloudflare.com/ajax/libs/lite-youtube-embed/0.3.2/lite-yt-embed.css"]'
      )
    );

  expect(cssFileLiteYoutube).toBeAttached();

  const jsLiteYoutubeScript = page
    .locator("script[defer]")
    .and(
      page.locator(
        `script[src="https://cdnjs.cloudflare.com/ajax/libs/lite-youtube-embed/0.3.2/lite-yt-embed.js"]`
      )
    );

  expect(jsLiteYoutubeScript).toBeAttached();

  // check open graph meta tags
  const metaDescription = page.locator('meta[name="description"]');
  await expect(metaDescription).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog. Vlad Sazonau is a frontend/full-stack enthusiast."
  );

  // open graph meta tags
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute("content", "Videos");

  const ogImageAlt = page.locator('meta[property="og:image:alt"]');
  await expect(ogImageAlt).toHaveAttribute(
    "content",
    "Vlad Sazonau personal website and blog. Videos."
  );

  const OG_IMAGE_VIDEOS_URL = "https://vladsazon.com/assets/og-videos.jpeg";

  const ogImageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");

  expect(ogImageUrl).toBe(OG_IMAGE_VIDEOS_URL);

  // check that open graph image is accessible
  const ogImageResponse = await fetch(ogImageUrl ?? "").catch(console.error);

  expect(ogImageResponse?.ok).toBeTruthy();
  expect(ogImageResponse?.status).toBe(200);

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

  expect(twitterImageUrl).toBe(OG_IMAGE_VIDEOS_URL);

  // check that twitter image is accessible
  const twitterImageResponse = await fetch(twitterImageUrl ?? "").catch(
    console.error
  );

  expect(twitterImageResponse?.ok).toBeTruthy();
  expect(twitterImageResponse?.status).toBe(200);

  // check nav bar
  await checkNavLinks(page);

  // check heading
  await expect(page.getByRole("heading", { name: "Videos" })).toBeVisible();

  const firstVideoInContainer = page.getByTestId("videos-list").first();
  // At least one item in the list is visible.
  await expect(firstVideoInContainer).toBeVisible();

  // check that youtube videos are displayed on page
  const youtubeVideos = page.locator("lite-youtube");

  const videosCount = await youtubeVideos.count();
  expect(videosCount).toBeGreaterThan(0);

  // check footer
  await checkFooterLinks(page);
});

test("check that link to my website is presented in my github profile", async ({
  page,
}) => {
  await page.goto("https://github.com/VladSez");

  await expect(page).toHaveURL(`https://github.com/VladSez`);
  const dubLink = "https://dub.sh/vldzn.me";

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("VladSez (Vlad Sazonau) · GitHub");

  const githubPersonalWebsiteUrlLocator = page.locator(
    "li[data-test-selector='profile-website-url']"
  );
  await expect(githubPersonalWebsiteUrlLocator).toBeVisible();

  const personalWebsiteLink = githubPersonalWebsiteUrlLocator.getByRole(
    "link",
    { name: dubLink }
  );

  await expect(personalWebsiteLink).toBeVisible();
  await expect(personalWebsiteLink).toHaveAttribute("href", dubLink);

  await personalWebsiteLink.click();
  await expect(page).toHaveURL("https://vladsazon.com");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | About me/);
});

test("check that prod domain is accessible", async ({ page }) => {
  await page.goto("https://vladsazon.com");

  await expect(page).toHaveURL(`https://vladsazon.com`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | About me/);
});

test("check that www domain redirects to apex (without www)", async ({
  page,
}) => {
  await page.goto("https://www.vladsazon.com");

  await expect(page).toHaveURL(`https://vladsazon.com`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | About me/);
});

const checkNavLinks = async (page) => {
  const header = page.getByRole("banner");
  await expect(header).toBeVisible();

  const nav = header.getByRole("navigation");
  await expect(nav).toBeVisible();

  const mainLink = nav.getByRole("link", { name: "Main" });
  await expect(mainLink).toBeVisible();
  await expect(mainLink).toHaveAttribute("href", "/index.html");

  const linksLink = nav.getByRole("link", { name: "Links" });
  await expect(linksLink).toBeVisible();
  await expect(linksLink).toHaveAttribute("href", "/links.html");

  const videosLink = nav.getByRole("link", { name: "Videos" });
  await expect(videosLink).toBeVisible();
  await expect(videosLink).toHaveAttribute("href", "/videos.html");
};

const checkFooterLinks = async (page) => {
  const footer = page.getByRole("contentinfo");
  await expect(footer).toBeVisible();

  const linkedInLinkFooter = footer.getByRole("link", { name: "LinkedIn" });
  await expect(linkedInLinkFooter).toBeVisible();
  await expect(linkedInLinkFooter).toHaveAttribute(
    "href",
    "https://dub.sh/vladsazon-linkedin"
  );

  await expect(linkedInLinkFooter).toHaveAttribute("target", "_blank");

  const githubLinkFooter = footer.getByRole("link", { name: "GitHub" });
  await expect(githubLinkFooter).toBeVisible();
  await expect(githubLinkFooter).toHaveAttribute(
    "href",
    "https://git.new/vladsazon-github"
  );
  await expect(githubLinkFooter).toHaveAttribute("target", "_blank");

  const cvLinkFooter = footer.getByRole("link", { name: "CV" });
  await expect(cvLinkFooter).toBeVisible();
  await expect(cvLinkFooter).toHaveAttribute("href", "https://dub.sh/vlad-cv");
  await expect(cvLinkFooter).toHaveAttribute("target", "_blank");

  const websiteSourceLinkFooter = footer.getByRole("link", {
    name: "Website source",
  });
  await expect(websiteSourceLinkFooter).toBeVisible();
  await expect(websiteSourceLinkFooter).toHaveAttribute(
    "href",
    "https://github.com/VladSez/html-cv"
  );
  await expect(websiteSourceLinkFooter).toHaveAttribute("target", "_blank");

  const calComLink = footer.getByRole("link", {
    name: "Schedule a call with me",
  });
  await expect(calComLink).toBeVisible();
  await expect(calComLink).toHaveAttribute(
    "href",
    "https://cal.com/vladsazon/meet"
  );
  await expect(calComLink).toHaveAttribute("target", "_blank");
};

const checkThatAllScriptsAreAttached = async (page) => {
  // css file link is presented on the page
  const mainCssFile = page.locator(
    'link[rel="stylesheet"][href="./index.css"]'
  );
  expect(mainCssFile).toBeAttached();

  // js vercel analytics scropt is presented on the page
  const jsVercelAnalyticsScript = page.locator(
    'script[defer][src="/_vercel/insights/script.js"]'
  );
  expect(jsVercelAnalyticsScript).toBeAttached();

  // js Cloudflare analytics scropt is presented on the page (we use it due to higher limits)
  const jsCloudflareAnalyticsFile = page.locator(
    'script[defer][src="https://static.cloudflareinsights.com/beacon.min.js"]'
  );
  expect(jsCloudflareAnalyticsFile).toBeAttached();
};
