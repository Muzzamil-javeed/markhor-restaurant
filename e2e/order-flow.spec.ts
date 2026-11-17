import { expect, test, type Page } from "@playwright/test";

const CUSTOMER = {
  name: "E2E Guest",
  phone: "03331234567",
  address: "Shop near Nishat, DHA Phase 6",
  area: "DHA Phase 6",
};

async function addCustomisedWings(page: Page) {
  await page.goto("/menu");
  await expect(
    page.getByRole("heading", { name: /Full board|Menu/i }).first(),
  ).toBeVisible();

  const customise = page.getByRole("button", {
    name: "Customise Wings on fire",
  });
  await customise.first().scrollIntoViewIfNeeded();
  await customise.first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByText("Nashville", { exact: true }).click();
  await dialog.getByRole("button", { name: /Add to cart/i }).click();
  await expect(dialog).toBeHidden();
}

async function applyVoucherAndCheckout(page: Page) {
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: /your cart/i })).toBeVisible();

  await page.getByRole("radio", { name: "Delivery" }).click();
  await page.locator("#cart-voucher").fill("deliver20");
  await page.getByRole("button", { name: "Apply" }).click();
  await expect(page.getByText("deliver20", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout/);
}

async function completeCheckoutDelivery(page: Page) {
  await page.getByRole("radio", { name: "Delivery" }).click();
  const asap = page.getByRole("radio", { name: "ASAP" });
  if (await asap.isEnabled()) {
    await asap.click();
  } else {
    await page.getByRole("radio", { name: /Schedule for later/i }).click();
    const select = page.locator("#scheduledFor");
    await expect(select).toBeVisible();
    const values = await select.locator("option").evaluateAll((opts) =>
      opts.map((o) => (o as HTMLOptionElement).value).filter(Boolean),
    );
    expect(values.length).toBeGreaterThan(0);
    await select.selectOption(values[0]!);
  }
  await page.getByRole("button", { name: "Continue" }).click();

  await page.locator("#customerName").fill(CUSTOMER.name);
  await page.locator("#customerPhone").fill(CUSTOMER.phone);
  await page.locator("#address").fill(CUSTOMER.address);
  await page.locator("#areaLandmark").fill(CUSTOMER.area);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel(/I agree to the/i).check();
  await page.getByRole("button", { name: /Place order/i }).click();

  await expect(page).toHaveURL(/\/order\//, { timeout: 30_000 });
  const url = page.url();
  const codeMatch = url.match(/\/order\/([^?]+)/);
  const tokenMatch = url.match(/[?&]token=([^&]+)/);
  expect(codeMatch?.[1]).toBeTruthy();
  expect(tokenMatch?.[1]).toBeTruthy();
  return {
    code: decodeURIComponent(codeMatch![1]!),
    token: decodeURIComponent(tokenMatch![1]!),
  };
}

test("browse → customise → cart → voucher → checkout → admin → track", async ({
  page,
}) => {
  await addCustomisedWings(page);
  await applyVoucherAndCheckout(page);
  const { code } = await completeCheckoutDelivery(page);

  await expect(page.getByText(code.toUpperCase())).toBeVisible();
  await expect(page.getByText(/Received|Preparing/i).first()).toBeVisible();

  await page.goto("/admin/login");
  await page
    .locator("#admin-password")
    .fill(process.env.ADMIN_PASSWORD ?? "123456");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/admin\/orders/);

  const orderCard = page
    .locator("article")
    .filter({ hasText: code.toUpperCase() });
  await expect(orderCard).toBeVisible({ timeout: 20_000 });
  await orderCard.getByRole("button", { name: "Preparing" }).click();
  await expect(
    page
      .getByRole("region", { name: "Preparing" })
      .locator("article")
      .filter({ hasText: code.toUpperCase() }),
  ).toBeVisible({ timeout: 15_000 });

  await page.goto("/track");
  await page.locator("#track-code").fill(code);
  await page.locator("#track-phone").fill(CUSTOMER.phone);
  await page.getByRole("button", { name: /Track order/i }).click();
  await expect(page.getByText(/Preparing/i).first()).toBeVisible({
    timeout: 20_000,
  });
});
