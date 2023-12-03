export class MyAccount {
  constructor(page) {
    this.page = page;
    this.pageHeading = page.getByRole("heading", { name: "My Account" });
    this.errorMsg = page.locator('[data-qa="error-message"]');
  }

  visit = async () => {
    await this.page.goto("/my-account");
  };

  waitForPageHeading = async () => {
    await this.pageHeading.waitFor();
  };

  waitForErrorMessage = async () => {
    await this.errorMsg.waitFor();
  };
}
