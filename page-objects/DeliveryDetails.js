import { expect } from "@playwright/test";

export class DeliveryDetails {
  constructor(page) {
    this.page = page;

    // input fields
    this.firstNameInput = page.locator('[data-qa="delivery-first-name"]');
    this.lastNameInput = page.locator('[data-qa="delivery-last-name"]');
    this.streetInput = page.locator('[data-qa="delivery-address-street"]');
    this.postCodeInput = page.locator('[data-qa="delivery-postcode"]');
    this.cityInput = page.locator('[data-qa="delivery-city"]');
    this.countryDropdown = page.locator('[data-qa="country-dropdown"]');

    // buttons
    this.saveAddressButton = page.getByRole("button", {
      name: "Save address for next time",
    });
    this.continueToPaymentButton = page.getByRole("button", {
      name: "Continue to payment",
    });

    // container
    this.addressContainer = page.locator('[data-qa="saved-address-container"]');

    // address fields
    this.savedAddressFirstName = page.locator(
      '[data-qa="saved-address-firstName"]'
    );
    this.savedAddressLastName = page.locator(
      '[data-qa="saved-address-lastName"]'
    );
    this.savedAddressStreet = page.locator('[data-qa="saved-address-street"]');
    this.savedAddressPostcode = page.locator(
      '[data-qa="saved-address-postcode"]'
    );
    this.savedAddressCity = page.locator('[data-qa="saved-address-city"]');
    this.savedAddressCountry = page.locator(
      '[data-qa="saved-address-country"]'
    );
  }

  fillDetails = async (userAddress) => {
    // 1. first name
    await this.firstNameInput.waitFor();
    await this.firstNameInput.fill(userAddress.firstName);

    // 2. last name
    await this.lastNameInput.waitFor();
    await this.lastNameInput.fill(userAddress.lastName);

    // 3. street
    await this.streetInput.waitFor();
    await this.streetInput.fill(userAddress.street);

    // 4. post code
    await this.postCodeInput.waitFor();
    await this.postCodeInput.fill(userAddress.postcode);

    // 5. city
    await this.cityInput.waitFor();
    await this.cityInput.fill(userAddress.city);

    // 6. country (dropdown menu)
    await this.countryDropdown.waitFor();
    await this.countryDropdown.selectOption(userAddress.country);
  };

  saveDetails = async () => {
    const addressCountBeforeSaving = await this.addressContainer.count();
    // save address
    await this.saveAddressButton.waitFor();
    await this.saveAddressButton.click();
    await this.addressContainer.waitFor();

    // assert that data is saved
    await expect(this.addressContainer).toHaveCount(
      addressCountBeforeSaving + 1
    );

    // assert that first name matches that input value
    await this.savedAddressFirstName.first().waitFor();
    expect(await this.savedAddressFirstName.first().innerText()).toBe(
      await this.firstNameInput.inputValue()
    );

    // assert that last name matches the input value
    await this.savedAddressLastName.first().waitFor();
    expect(await this.savedAddressLastName.first().innerText()).toBe(
      await this.lastNameInput.inputValue()
    );

    // assert that street matches the input value
    await this.savedAddressStreet.first().waitFor();
    expect(await this.savedAddressStreet.first().innerText()).toBe(
      await this.streetInput.inputValue()
    );

    // assert that post code matches the input value
    await this.savedAddressPostcode.first().waitFor();
    expect(await this.savedAddressPostcode.first().innerText()).toBe(
      await this.postCodeInput.inputValue()
    );

    // assert that city matches the input value
    await this.savedAddressCity.first().waitFor();
    expect(await this.savedAddressCity.first().innerText()).toBe(
      await this.cityInput.inputValue()
    );

    // assert that country matches the selected value
    await this.savedAddressCountry.first().waitFor();
    expect(await this.savedAddressCountry.first().innerText()).toBe(
      await this.countryDropdown.inputValue()
    );
  };

  continueToPayment = async () => {
    await this.continueToPaymentButton.waitFor();
    await this.continueToPaymentButton.click();
    await this.page.waitForURL(/\/payment/, { timeout: 3000 }); // 3k millisec
  };
}
