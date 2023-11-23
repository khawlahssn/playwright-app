import { test } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";
import { ProductsPage } from "../page-objects/ProductsPage";
import { Navigation } from "../page-objects/Navigation";
import { Checkout } from "../page-objects/Checkout";
import { LoginPage } from "../page-objects/LoginPage";
import { Register } from "../page-objects/Register";
import { DeliveryDetails } from "../page-objects/DeliveryDetails";
import { deliveryDetails as userAddress } from "../data/deliveryDetails";
import { Payment } from "../page-objects/Payment";
import { paymentDetails } from "../data/paymentDetails";

test.only("", async ({ page }) => {
  // ProductsPage.js
  const productsPage = new ProductsPage(page);
  await productsPage.visit();
  await productsPage.addProductToBasket(0);
  await productsPage.addProductToBasket(1);
  await productsPage.addProductToBasket(2);
  await productsPage.sortByCheapest();

  // Navigation.js
  const navBar = new Navigation(page);
  await navBar.goToCheckout();
  // await page.pause();

  // Checkout.js
  const checkout = new Checkout(page);
  await checkout.removeCheapestProduct();
  await checkout.continueToCheckout();

  // LoginPage.js
  const login = new LoginPage(page);
  await login.moveToRegister();

  // RegisterPage.js
  const emailId = uuidv4();
  const email = emailId + "@gmail.com";
  const password = uuidv4();

  const register = new Register(page);
  await register.signupAsNewUser(email, password);

  // DeliveryDetails.js
  const deliveryDetails = new DeliveryDetails(page);
  await deliveryDetails.fillDetails(userAddress);
  await deliveryDetails.saveDetails();
  await deliveryDetails.continueToPayment();

  // PaymentPage.js
  const payment = new Payment(page);
  await payment.activateDiscount();
  await payment.fillPaymentDetails(paymentDetails);
  await payment.completePayment();

  await page.pause();
});
