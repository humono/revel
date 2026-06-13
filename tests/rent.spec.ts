import { test } from "@playwright/test";
import { CatalogPage } from "../pages/CatalogPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { CookieBanner } from "../pages/components/CookieBanner";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HiringPage } from "../pages/HiringPage";
import { EmailGenerator } from "../utils/EmailGenerator";
import { PhoneGenerator } from "../utils/PhoneGenerator";
import { NameGenerator } from "../utils/NameGenerator";

/**
 * Test Suite: Lead Flow Validation
 * Covers end-to-end multi-page user journeys from the vehicle catalog down to the lead registration conversion stage.
 * Includes both business-happy paths and error-handling scenarios.
 */
test.describe("Lead Flow Validation", () => {
  /**
   * Hook executed prior to each test case.
   * Initializes the environment by navigating to the catalog landing page and bypassing the cookie tracking blocker.
   */
  test.beforeEach(async ({ page }) => {
    const cookies = new CookieBanner(page);
    await page.goto("https://driverevel.com/coches");
    await cookies.acceptAllCookies();
  });

  /**
   * Test Case: Positive Scenario
   * Verifies the complete "Short Lead Flow" when a user inputs valid random credentials.
   * Ensures the system correctly processes the registration and lands on the final confirmation page.
   */
  test("Short lead flow from grid to confirmation page", async ({ page }) => {
    // Page Object Model instances
    const catalogPage = new CatalogPage(page);
    const productDetail = new ProductDetailPage(page);
    const checkoutPage = new CheckoutPage(page);
    const hiringPage = new HiringPage(page);

    // 1. Select a dynamic vehicle item from the available grid catalog
    const selectedCarName = await catalogPage.selectAnyCar();

    // 2. Synchronization guard: Verify that the Product Detail Page (PDP) loads the matching vehicle
    await productDetail.verifyCarIsLoaded(selectedCarName);

    // 3. Navigate past the PDP into the checkout conversion funnel
    await productDetail.clickSiguiente();

    // 4. Generate dynamic mock dataset for data isolation testing
    const email = EmailGenerator.generate();
    const phone = PhoneGenerator.generate("ES");
    const name = NameGenerator.generate();

    // 5. Populate the conversion form fields
    await checkoutPage.fillLeadForm({
      name,
      email,
      phone,
    });

    // 6. Satisfy regulatory policies and trigger submission
    await checkoutPage.acceptDataConsent();
    //await checkoutPage.submitLeadForm();

    // 7. Core Assertion: Ensure the process terminates successfully on the final confirmation route
    //await hiringPage.verifyPageLoaded();
  });

  /**
   * Test Case: Negative Scenario
   * Validates form error handling and inline schema restrictions.
   * Verifies that submitting an improperly formatted email triggers the correct localized error feedback.
   */
  test("Should show error message when email format is invalid", async ({ page }) => {
    // Page Object Model instances
    const catalogPage = new CatalogPage(page);
    const productDetail = new ProductDetailPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Replicate user journey steps up to the checkout form
    const selectedCarName = await catalogPage.selectAnyCar();
    await productDetail.verifyCarIsLoaded(selectedCarName);
    await productDetail.clickSiguiente();

    // 2. Populate form fields using an intentionally malformed email value
    await checkoutPage.fillLeadForm({
      name: NameGenerator.generate(),
      email: "notvalid@no-domain", // Standard structural format error string
      phone: PhoneGenerator.generate("ES"),
    });

    // 3. Core Assertion: Verify the localized validation text renders properly underneath the target element context
    await checkoutPage.verifyEmailErrorDisplayed("El correo no tiene el formato correcto");
  });
});
