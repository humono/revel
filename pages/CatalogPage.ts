import { Locator, Page } from "@playwright/test";

/**
 * Page Object Model representing the Vehicle Catalog/Grid Page.
 * Handles element counting, random item selection, and extraction of car data from the grid.
 */
export class CatalogPage {
  /**
   * Creates an instance of CatalogPage.
   * @param page - The Playwright Page instance.
   */
  constructor(private page: Page) {}

  //***************************************** Action functions *****************************************//

  /**
   * Selects a random car from the available grid items, extracts its commercial name,
   * and triggers the navigation click.
   *
   * @returns A promise that resolves to the extracted name of the selected car.
   * @throws {Error} If the grid is empty or no car elements are found.
   */
  async selectAnyCar(): Promise<string> {
    const count = await this.carCards.count();
    if (count === 0) {
      throw new Error("No cars found in grid");
    }

    // Generate a random index based on the available card count
    const index = Math.floor(Math.random() * count);
    const car = this.carCards.nth(index);

    const name = await car.locator("h3").first().innerText();

    await car.click();

    return name;
  }

  //***************************************** Inner functions *****************************************//

  /**
   * Getter that resolves all individual car card containers inside the grid.
   * @private
   */
  private get carCards(): Locator {
    return this.page.locator("ul > div");
  }
}
