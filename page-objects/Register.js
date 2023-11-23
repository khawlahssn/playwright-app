export class Register {
  constructor(page) {
    this.page = page;

    this.emailInput = page.getByPlaceholder("E-Mail");
    this.passwordInput = page.getByPlaceholder("Password");
    this.registerButton = page.getByRole("button", { name: "Register" });
  }

  signupAsNewUser = async (email, password) => {
    // 1. email input
    await this.emailInput.waitFor();
    await this.emailInput.fill(email);

    // 2. password input
    await this.passwordInput.waitFor();
    await this.passwordInput.fill(password);

    // 3. register input
    await this.registerButton.waitFor();
    await this.registerButton.click();
  };
}
