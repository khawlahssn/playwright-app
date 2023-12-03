import { test } from "@playwright/test";
import { MyAccount } from "../page-objects/MyAccount";
import { getLoginToken } from "../api-calls/getLoginToken";
import { adminDetails } from "../data/userDetails";

test.only("My Account using cookie injection", async ({ page }) => {
  // step 1. make a request to get login token
  const loginToken = await getLoginToken(
    adminDetails.username,
    adminDetails.password
  );
  // step 2. inject the login token into the browser
  const myAccount = new MyAccount(page);
  await myAccount.visit();
  await page.evaluate(
    (loginTokenInsideBrowserCode) => {
      document.cookie = "token=" + loginTokenInsideBrowserCode;
    },
    [loginToken]
  );
  await myAccount.visit();
  await myAccount.waitForPageHeading();
});
