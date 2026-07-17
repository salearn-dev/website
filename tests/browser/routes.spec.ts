import { expect, test } from "@playwright/test";

const routes = [
  ["/", "SA Learn"],
  ["/courses", "Courses"],
  ["/careers/software-developer", "Software Developer"],
  ["/institutions/cput", "Cape Peninsula University of Technology"],
  ["/guides/aps-explained", "APS Explained"],
] as const;

for (const [path, heading] of routes) {
  test(`${path} renders its own page`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading, exact: false }).first()).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
  });
}
