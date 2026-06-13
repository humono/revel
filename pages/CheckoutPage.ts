import { expect, Locator, Page } from "@playwright/test";

/**
 * Page Object Model representing the Checkout and Lead Generation page.
 * Handles form interaction, data consent acceptance, and error validation.
 */
export class CheckoutPage {
  /**
   * Creates an instance of CheckoutPage.
   * @param page - The Playwright Page instance.
   */
  constructor(private page: Page) {}

  //***************************************** Action functions *****************************************//

  /**
   * Fills out the lead registration form with user details.
   * @param data - Object containing the user's name, email, and phone number.
   */
  async fillLeadForm(data: { name: string; email: string; phone: string }): Promise<void> {
    await this.page.fill('[name="name"]', data.name);
    await this.page.fill('[name="email"]', data.email);
    await this.page.fill('[name="phone number"]', data.phone);
  }

  /**
   * Safely checks the data privacy and terms consent checkbox if it is visible and not already checked.
   */
  async acceptDataConsent(): Promise<void> {
    const checkbox = this.page.locator('input[name="terms"]').locator("..").locator("div").first();

    if (await checkbox.isVisible().catch(() => false)) {
      const isChecked = await checkbox.isChecked().catch(() => false);

      if (!isChecked) {
        await checkbox.check();
      }
    }
  }

  /**
   * Submits the lead form by clicking the submit button.
   */
  async submitLeadForm(): Promise<void> {
    await this.page.click('button[type="submit"]');
  }

  //***************************************** Validation functions *****************************************//

  /**
   * Validates that the email validation error message appears and contains the expected text.
   * @param expectedErrorMessage - The precise text string expected in the error paragraph.
   */
  async verifyEmailErrorDisplayed(expectedErrorMessage: string): Promise<void> {
    await expect(this.emailErrorLabel).toBeVisible();

    await expect(this.emailErrorLabel).toHaveText(expectedErrorMessage);
  }

  //***************************************** Inner functions *****************************************//

  /**
   * Getter that resolves the specific error paragraph element for the email input.
   * Uses a strict DOM hierarchy path (Grandparent context -> Second child div -> Paragraph).
   * @private
   */
  private get emailErrorLabel(): Locator {
    return this.page.locator('input[name="email"] >> xpath=.. >> div >> nth=1 >> p');
  }
}
