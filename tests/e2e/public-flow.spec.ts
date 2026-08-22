import { expect, test } from "@playwright/test";

test("the entry page leads to account creation", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Project Desk" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start a project" })).toHaveAttribute(
    "href",
    "/signup",
  );
  await expect(page.getByText("Private by default")).toBeVisible();
});

test("the login page includes recovery and signup paths", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("link", { name: "Forgot password?" })).toHaveAttribute(
    "href",
    "/forgot-password",
  );
});

test("the public pages do not scroll sideways", async ({ page }) => {
  await page.goto("/");

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
});

test("a signed-out visitor cannot open the dashboard", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
});
