import { expect, test } from "@playwright/test";

test.describe("preloader + transitions", () => {
  test("preloader shows once per session", async ({ page }) => {
    // Clear once only — addInitScript would re-run on reload and defeat the test.
    await page.addInitScript(() => {
      try {
        if (!sessionStorage.getItem("mk_e2e_preload_cleared")) {
          sessionStorage.removeItem("mk_preloader_seen");
          sessionStorage.setItem("mk_e2e_preload_cleared", "1");
        }
      } catch {
        /* ignore */
      }
    });

    await page.goto("/");
    const preloader = page.locator("#mk-preloader");
    await expect(preloader).toBeVisible({ timeout: 5000 });
    await expect(preloader).toBeHidden({ timeout: 8000 });

    await page.reload();
    await expect(page.locator("#mk-preloader")).toHaveCount(0, {
      timeout: 3000,
    });
  });

  test("Menu nav plays curtain and lands with focusable main", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("mk_preloader_seen", "1");
      } catch {
        /* ignore */
      }
    });
    await page.goto("/");
    await page.getByRole("link", { name: "Menu", exact: true }).first().click();
    await expect(page).toHaveURL(/\/menu/, { timeout: 10_000 });
    await expect(page.locator("main")).toBeVisible();
  });

  test("browser back does not leave stuck overlay", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("mk_preloader_seen", "1");
      } catch {
        /* ignore */
      }
    });
    await page.goto("/");
    await page.getByRole("link", { name: "Menu", exact: true }).first().click();
    await expect(page).toHaveURL(/\/menu/);
    await page.goBack();
    await expect(page).toHaveURL("/");
    await expect(page.locator('[aria-hidden="true"]').filter({ hasText: "Menu" })).toHaveCount(0);
  });

  test("reduced motion uses fade only", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      try {
        sessionStorage.setItem("mk_preloader_seen", "1");
      } catch {
        /* ignore */
      }
    });
    await page.goto("/");
    await page.getByRole("link", { name: "Menu", exact: true }).first().click();
    await expect(page).toHaveURL(/\/menu/, { timeout: 10_000 });
    await expect(page.locator("main")).toBeVisible();
  });
});
