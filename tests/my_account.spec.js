import { test } from "@playwright/test";
import { MyAccount } from "../page-objects/MyAccount";
import { getLoginToken } from "../api-calls/getLoginToken";
import { adminDetails } from "../data/userDetails";

test.only("My Account using cookie injection and mocking network requests", async ({
  page,
}) => {
  // mocking an API request
  await page.route("**/api/user**", async (route, request) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ message: "PLAYWRIGHT ERROR FROM MOCKING" }),
    });
  });

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
  await myAccount.waitForErrorMessage();
});
