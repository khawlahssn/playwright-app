import { expect } from "@playwright/test";

export class Payment {
  constructor(page) {
    this.page = page;

    // step 1. locate the iframe
    // step 2. locate the selector on the iframe
    this.discountCode = page
      .frameLocator('[data-qa="active-discount-container"]')
      .locator('[data-qa="discount-code"]');
    this.discountCodeInput = page.locator('[data-qa="discount-code-input"]');
    this.submitDiscountButton = page.locator(
      '[data-qa="submit-discount-button"]'
    );
  }

  activateDiscount = async () => {
    await this.discountCode.waitFor();
    const code = await this.discountCode.innerText();

    // option 1:
    await this.discountCodeInput.waitFor();
    await this.discountCodeInput.fill(code);

    // option 2: Keyboard API for laggy inputs
    // await this.discountCodeInput.focus();
    // await this.page.keyboard.type(code, { delay: 1000 });

    await expect(this.discountCodeInput).toHaveValue(code);
    await this.page.pause();
  };
}
