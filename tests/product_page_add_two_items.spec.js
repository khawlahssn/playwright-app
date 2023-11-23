import { test, expect } from "@playwright/test";

test("Product Page: Add to Basket", async ({ page }) => {
  await page.goto("/");

  //   const addToBasketButton = page
  //     .locator("div")
  //     .filter({ hasText: /^499\$Add to Basket$/ })
  //     .getByRole("button");
  //   await addToBasketButton.click();

  const addToBasketButton = page.locator('[data-qa="product-button"]').first();
  const basketCounter = page.locator('[data-qa="header-basket-count"]');

  // assert state before click
  await addToBasketButton.waitFor();
  await expect(addToBasketButton).toHaveText("Add to Basket");
  await expect(basketCounter).toHaveText("0");

  // assert state after click
  await addToBasketButton.click();
  await expect(addToBasketButton).toHaveText("Remove from Basket");
  await expect(basketCounter).toHaveText("1");

  const checkoutLink = page.getByRole("link", { name: "Checkout" });
  await checkoutLink.waitFor();
  await checkoutLink.click();
  await page.waitForURL("/basket");
});
