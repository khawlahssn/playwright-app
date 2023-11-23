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
    this.discountActivatedMsg = page.locator(
      '[data-qa="discount-active-message"]'
    );
    this.totalValue = page.locator('[data-qa="total-value"]');
    this.totalValueAfterDiscount = page.locator(
      '[data-qa="total-with-discount-value"]'
    );

    this.creditCardOwnerInput = page.getByPlaceholder("Credit card owner");
    this.creditCardNumberInput = page.getByPlaceholder("Credit card number");
    this.creditCardValidUntilInput = page.getByPlaceholder("Valid until");
    this.creditCardCVCInput = page.getByPlaceholder("Credit card CVC");

    this.payButton = page.locator('[data-qa="pay-button"]');
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

    await this.submitDiscountButton.waitFor();
    await this.submitDiscountButton.click();

    expect(await this.discountActivatedMsg.isVisible()).toBe(false);
    expect(await this.totalValueAfterDiscount.isVisible()).toBe(false);

    await this.discountActivatedMsg.waitFor();
    await this.totalValueAfterDiscount.waitFor();

    await this.totalValueAfterDiscount.waitFor();
    const totalValueAfterDiscountText =
      await this.totalValueAfterDiscount.innerText();
    const totalValueAfterDiscountOnlyString =
      totalValueAfterDiscountText.replace("$", "");
    const totalValueAfterDiscountNumber = parseInt(
      totalValueAfterDiscountOnlyString,
      10
    );

    await this.totalValue.waitFor();
    const totalValueText = await this.totalValue.innerText();
    const totalValueOnlyString = totalValueText.replace("$", "");
    const totalValueNumber = parseInt(totalValueOnlyString, 10);

    expect(totalValueAfterDiscountNumber).toBeLessThan(totalValueNumber);

    // await this.page.pause();
  };

  fillPaymentDetails = async (paymentDetails) => {
    await this.creditCardOwnerInput.waitFor();
    await this.creditCardOwnerInput.fill(paymentDetails.owner);

    await this.creditCardNumberInput.waitFor();
    await this.creditCardNumberInput.fill(paymentDetails.number);

    await this.creditCardValidUntilInput.waitFor();
    await this.creditCardValidUntilInput.fill(paymentDetails.validUntil);

    await this.creditCardCVCInput.waitFor();
    await this.creditCardCVCInput.fill(paymentDetails.cvc);
  };

  completePayment = async () => {
    await this.payButton.waitFor();
    await this.payButton.click();
    await this.page.waitForURL(/\/thank-you/, { timeout: 3000 });
  };
}
