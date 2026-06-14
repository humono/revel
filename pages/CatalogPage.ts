import { expect, Locator, Page } from "@playwright/test";

export class CatalogPage {
  constructor(private page: Page) {}

  private initialCarTitles: string[] = [];

  //***************************************** Locators *****************************************//

  /**
   * Locator that represents all car card containers inside the catalog grid.
   */
  private get carCards(): Locator {
    return this.page.locator("ul > div");
  }

  /**
   * Locator that retrieves all visible car titles from the catalog grid.
   * Targets only real vehicle cards based on stable CSS module classes.
   */
  private get carTitles(): Locator {
    return this.page.locator('li[class*="CarCard-module"][class*="__card"]').locator("h3");
  }

  /**
   * Returns the list of visible vehicle titles currently displayed in the grid.
   * Ensures the grid is loaded before extracting data.
   *
   * @returns Array of car title strings
   */
  async getVisibleTitles(): Promise<string[]> {
    this.waitForGridToLoad();
    return await this.carTitles.allInnerTexts();
  }

  //***************************************** State Management *****************************************//

  /**
   * Stores current visible car titles for later comparison
   */
  async saveVisibleCarTitles(): Promise<void> {
    this.initialCarTitles = await this.carTitles.allInnerTexts();
  }

  /**
   * Selects a random vehicle from the first 3 visible results in the catalog grid.
   *
   * @returns {Promise<string>} The name of the selected vehicle
   *
   * @throws {Error} If fewer than 3 vehicles are available in the grid
   */
  async selectAnyCar(): Promise<string> {
    await this.waitForGridToLoad();

    const titles = this.carTitles;
    const count = await titles.count();
    if (count < 3) {
      throw new Error("Not enough cars in the grid to select from top 3");
    }

    const index = Math.floor(Math.random() * 3);
    const selectedTitleLocator = titles.nth(index);
    const title = (await selectedTitleLocator.innerText()).trim();
    await selectedTitleLocator.scrollIntoViewIfNeeded();
    await selectedTitleLocator.click({ timeout: 5000 });

    return title;
  }

  //***************************************** Assertions *****************************************//

  /**
   * Ensures that all visible cars match a given brand
   */
  async verifyAllVisibleCarsMatchBrand(expectedBrand: string): Promise<void> {
    const titles = await this.carTitles.allInnerTexts();

    expect(titles.length).toBeGreaterThan(0);

    for (const title of titles) {
      expect(title.toLowerCase()).toContain(expectedBrand.toLowerCase());
    }
  }

  /**
   * Verifies that the current visible car titles differ from the initially saved state.
   * This comparison is order-independent and case-insensitive to ensure stability
   * regardless of UI sorting or rendering changes.
   *
   * @param currentTitles - List of currently visible car titles after applying filters
   */
  async verifyVisibleCarTitlesChanged(currentTitles: string[]): Promise<void> {
    const normalizedCurrent = this.normalizeTitles(currentTitles);
    const normalizedInitial = this.normalizeTitles(this.initialCarTitles);

    expect(normalizedCurrent).not.toEqual(normalizedInitial);
  }

  /**
   * Ensures grid is not empty
   */
  async verifyGridIsNotEmpty(): Promise<void> {
    await expect(this.carCards.first()).toBeVisible();

    const count = await this.getVisibleCarsCount();

    expect(count).toBeGreaterThan(0);
  }

  /**
   * Verifies visible car count equals expected value
   */
  async verifyVisibleCarsCountEquals(expectedCount: number): Promise<void> {
    const currentCount = await this.getVisibleCarsCount();

    expect(currentCount).toBe(expectedCount);
  }

  /**
   * Verifies that the catalog has been restored to its initial state
   * (order-independent comparison)
   */
  async verifyVisibleCarTitlesRestored(): Promise<void> {
    const currentTitles = await this.carTitles.allInnerTexts();

    expect(this.normalizeTitles(currentTitles)).toEqual(this.normalizeTitles(this.initialCarTitles));
  }

  //***************************************** Helpers *****************************************//

  /**
   * Returns number of visible cars in the grid
   */
  async getVisibleCarsCount(): Promise<number> {
    return await this.carCards.count();
  }

  /**
   * Normalizes arrays for order-independent comparison
   */
  private normalizeTitles(titles: string[]): string[] {
    return titles.map((t) => t.trim().toLowerCase()).sort();
  }

  /**
   * Waits until the vehicle catalog grid is populated with at least one visible result.
   * This method uses polling to ensure the grid is fully rendered before any interaction,
   * improving stability in dynamic or asynchronously loaded pages.
   */
  async waitForGridToLoad(): Promise<void> {
    const titles = this.carTitles;

    await expect
      .poll(async () => {
        return await titles.count();
      })
      .toBeGreaterThan(0);
  }
}
