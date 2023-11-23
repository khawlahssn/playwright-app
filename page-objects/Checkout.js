import { expect } from "@playwright/test";

export class Checkout {
  constructor(page) {
    this.page = page;

    this.basketCards = page.locator('[data-qa="basket-card"]');
    this.basketItemPrice = page.locator('[data-qa="basket-item-price"]');
    this.basketItemRemoveButton = page.locator(
      '[data-qa="basket-card-remove-item"]'
    );
    this.continueToCheckoutButton = page.locator(
      '[data-qa="continue-to-checkout"]'
    );
  }

  removeCheapestProduct = async () => {
    // good practice: wait for elements to load
    await this.basketCards.first().waitFor();
    await this.basketItemPrice.first().waitFor();

    const itemsBeforeRemoval = await this.basketCards.count();
    const allPriceTexts = await this.basketItemPrice.allInnerTexts();

    // convert the string of numbers into an integer
    const justNumbers = allPriceTexts.map((element) => {
      const withoutDollarSign = element.replace("$", "");
      return parseInt(withoutDollarSign, 10);
    });

    // fetch the index of the card with the smallest price
    const smallestPrice = Math.min(...justNumbers);
    const smallestPriceIndex = justNumbers.indexOf(smallestPrice);

    // click on the "remove from basket" button
    const specificRemoveButton =
      this.basketItemRemoveButton.nth(smallestPriceIndex);
    await specificRemoveButton.waitFor();
    await specificRemoveButton.click();

    // assertion
    await expect(this.basketCards).toHaveCount(itemsBeforeRemoval - 1);

    // await this.page.pause();
  };

  continueToCheckout = async () => {
    // log in
    await this.continueToCheckoutButton.waitFor();
    await this.continueToCheckoutButton.click();
    await this.page.waitForURL(/\/login/);
  };
}
