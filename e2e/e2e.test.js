// @ts-check
import { test, expect } from "@playwright/test";

test("main page", async ({ page }) => {
  await page.goto("https://vldszn-cv.vercel.app");

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
  await page.goto("https://vldszn-cv.vercel.app/links.html");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vlad Sazonau | Links/);

  // check nav bar
  await expect(page.getByRole("link", { name: "Main" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Links" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Links" })).toBeVisible();
});
