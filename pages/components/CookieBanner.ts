import { Page } from "@playwright/test";

/**
 * Page Object Model representing the Cookie Consent Banner.
 * Handles the interception and acceptance of privacy regulations dialogues.
 */
export class CookieBanner {
  /**
   * Creates an instance of CookieBanner.
   * @param page - The Playwright Page instance.
   */
  constructor(private page: Page) {}

  /**
   * Attempts to accept all cookies if the banner appears within the designated timeframe.
   * Features a defensive fallback structure to ensure the test continues smoothly
   * if the banner has already been dismissed or is cached.
   */
  async acceptAllCookies(): Promise<void> {
    // Precise ID selector matching the standard Cookiebot dialog structure
    const acceptButton = this.page.locator("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll");

    try {
      await acceptButton.waitFor({ state: "visible", timeout: 10000 });

      await acceptButton.click();
    } catch (error) {
      // Graceful degradation: If the banner is missing (due to session cookies or environmental setups),
      // the catch block prevents a test crash and continues test execution safely.
    }
  }
}
