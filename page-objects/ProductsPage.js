import { expect } from "@playwright/test";
import { Navigation } from "./Navigation";

export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.addButtons = page.locator('[data-qa="product-button"]');
    this.sortDropdown = page.locator('[data-qa="sort-dropdown"]');
    this.productTitle = page.locator('[data-qa="product-title"]');
  }

  visit = async () => {
    await this.page.goto("/");
  };

  addProductToBasket = async (index) => {
    const navBar = new Navigation(this.page);

    const specificAddButton = this.addButtons.nth(index);
    await specificAddButton.waitFor();
    await expect(specificAddButton).toHaveText("Add to Basket");
    const basketCountBeforeAdding = await navBar.getBasketCount();

    await specificAddButton.click();
    await expect(specificAddButton).toHaveText("Remove from Basket");
    const basketCountAfterAdding = await navBar.getBasketCount();

    expect(basketCountAfterAdding).toBeGreaterThan(basketCountBeforeAdding);
  };

  sortByCheapest = async () => {
    // wait for elements to be visible
    await this.sortDropdown.waitFor();
    await this.productTitle.first().waitFor();

    // before selecting menu option
    const productTitlesBeforeSorting = await this.productTitle.allInnerTexts();
    await this.sortDropdown.selectOption("price-asc");

    // after selecting menu option
    const productTitlesAfterSorting = await this.productTitle.allInnerTexts();
    expect(productTitlesAfterSorting).not.toEqual(productTitlesBeforeSorting);
  };
}
