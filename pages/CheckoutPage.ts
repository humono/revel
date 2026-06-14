import { expect, Locator, Page } from "@playwright/test";

/**
 * CheckoutPage Page Object Model
 *
 * This class represents the checkout / lead generation page.
 * It encapsulates all interactions related to the lead form,
 * including data input, consent handling, form submission,
 * and validation of UI errors.
 *
 * Responsibilities:
 * - Fill lead generation form
 * - Handle consent checkbox interaction
 * - Submit form
 * - Validate form errors (e.g., email validation)
 */
export class CheckoutPage {
  constructor(private page: Page) {}

  //***************************************** Action functions *****************************************//

  /**
   * Fills the lead registration form with user data.
   *
   * @param data - Object containing:
   *  - name: user's full name
   *  - email: user's email address
   *  - phone: user's phone number
   */
  async fillLeadForm(data: { name: string; email: string; phone: string }): Promise<void> {
    await this.page.fill('[name="name"]', data.name);
    await this.page.fill('[name="email"]', data.email);
    await this.page.fill('[name="phone number"]', data.phone);
  }

  /**
   * Accepts the data privacy / terms and conditions consent checkbox.
   *
   * This method is safe to run multiple times:
   * - It checks if the element is visible
   * - It checks if it is already selected
   * - It only interacts when necessary
   */
  async acceptDataConsent(): Promise<void> {
    const checkbox = this.page.locator('input[name="terms"]').locator("..").locator("div").first();
    const isVisible = await checkbox.isVisible().catch(() => false);
    if (isVisible) {
      const isChecked = await checkbox.isChecked().catch(() => false);
      if (!isChecked) {
        await checkbox.check();
      }
    }
  }

  /**
   * Submits the lead form.
   * This triggers form validation and/or navigation to the next step.
   */
  async submitLeadForm(): Promise<void> {
    await this.page.click('button[type="submit"]');
  }

  //***************************************** Validation functions *****************************************//

  /**
   * Verifies that the email validation error is displayed
   * and matches the expected message.
   *
   * @param expectedErrorMessage - Expected error text shown in UI
   */
  async verifyEmailErrorDisplayed(expectedErrorMessage: string): Promise<void> {
    await expect(this.emailErrorLabel).toBeVisible();
    await expect(this.emailErrorLabel).toHaveText(expectedErrorMessage);
  }

  //***************************************** Inner functions *****************************************//

  /**
   * Locator for the email validation error message.
   * It is resolved using DOM hierarchy relative to the email input:
   * input[name="email"] → parent → sibling container → paragraph
   */
  private get emailErrorLabel(): Locator {
    return this.page.locator('input[name="email"] >> xpath=.. >> div >> nth=1 >> p');
  }
}
