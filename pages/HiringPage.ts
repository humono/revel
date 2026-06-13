import { Page } from "@playwright/test";

/**
 * Page Object Model representing the Confirmation/Hiring Page.
 * Handles final state validation once the lead submission process is complete.
 */
export class HiringPage {
  /**
   * Creates an instance of HiringPage.
   * @param page - The Playwright Page instance.
   */
  constructor(private page: Page) {}

  //***************************************** Action functions *****************************************//

  /**
   * Asserts and waits until the browser successfully navigates to the hiring confirmation URL.
   * Uses a Regular Expression pattern match to handle lifecycle navigation states smoothly.
   *
   * @returns A promise that resolves when the expected URL is reached.
   */
  async verifyPageLoaded(): Promise<void> {
    await this.page.waitForURL(new RegExp(`https://driverevel.com/es/es/contratacion`));
  }
}
