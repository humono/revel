import { expect } from "@playwright/test";

import { TextUtiltiies } from "../utils/TextUtilities";

/**
 * Page Object Model representing the Vehicle Product Detail Page (PDP).
 * Handles detail validation, URL state synchronization, and CTA interactions.
 */
export class ProductDetailPage {
  /**
   * Creates an instance of ProductDetailPage.
   * @param page - The Playwright Page instance.
   */
  constructor(private page: any) {}

  /**
   * Getter that resolves the primary heading element of the page.
   * Target selection relies on the unique existence of a single H1 tag in the DOM.
   * @private
   */
  private get title() {
    return this.page.locator("h1"); // ONLY h1 on the page (most stable approach)
  }

  /**
   * Waits for the browser URL to match the expected vehicle route pattern.
   * Extracts the primary brand/name token from the vehicle string to construct the dynamic route match.
   *
   * @param expectedName - The full raw name of the expected car.
   */
  async verifyCarIsLoaded(expectedName: string) {
    const formattedUrlName = expectedName.split(" ");
    const configBaseUrl = this.page.context()._options?.baseURL;

    await this.page.waitForURL(new RegExp(`${configBaseUrl}/es/es/coches/${formattedUrlName[0].toLowerCase()}.*`));
  }

  /**
   * Asserts the presence and textual content of the vehicle's primary title element.
   * Uses utility normalization rules to wipe white spaces and formatting mismatches.
   *
   * @param expectedName - The text substring expected within the product title heading.
   */
  async verifyTitle(expectedName: string): Promise<void> {
    const actual = await this.title.innerText();
    await expect(this.title).toBeVisible();

    expect(TextUtiltiies.normalize(actual)).toContain(TextUtiltiies.normalize(expectedName));
  }

  /**
   * Waits for the primary navigation CTA button ("Siguiente") to become interactive and triggers a click event.
   */
  async clickSiguiente(): Promise<void> {
    const btnSiguiente = this.page.getByRole("button", { name: /Siguiente/i });

    // Explicit wait guard prevents race conditions against asynchronous hydration delays
    await btnSiguiente.waitFor({ state: "visible" });
    await btnSiguiente.click();
  }
}
