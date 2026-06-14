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
 * Test Suite: Flujo A - End-to-End Vehicle Lead Registration
 * Covers end-to-end multi-page user journeys from the vehicle catalog down to the lead registration conversion stage.
 * Includes both business-happy paths and error-handling scenarios.
 */
test.describe("Flujo A", () => {
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
    const catalogPage = new CatalogPage(page);
    const productDetail = new ProductDetailPage(page);
    const checkoutPage = new CheckoutPage(page);
    const hiringPage = new HiringPage(page);

    const selectedCarName = await catalogPage.selectAnyCar();

    await productDetail.verifyCarIsLoaded(selectedCarName);

    await productDetail.clickSiguiente();

    await checkoutPage.fillLeadForm({
      name: NameGenerator.generate(),
      email: EmailGenerator.generate(),
      phone: PhoneGenerator.generate("ES"),
    });

    await checkoutPage.acceptDataConsent();
    await checkoutPage.submitLeadForm();

    await hiringPage.verifyPageLoaded();
  });

  /**
   * Test Case: Negative Scenario
   * Validates form error handling and inline schema restrictions.
   * Verifies that submitting an improperly formatted email triggers the correct localized error feedback.
   */
  test("Should show error message when email format is invalid", async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const productDetail = new ProductDetailPage(page);
    const checkoutPage = new CheckoutPage(page);

    const selectedCarName = await catalogPage.selectAnyCar();
    await productDetail.verifyCarIsLoaded(selectedCarName);
    await productDetail.clickSiguiente();

    await checkoutPage.fillLeadForm({
      name: NameGenerator.generate(),
      email: "notvalid@no-domain", // Standard structural format error string
      phone: PhoneGenerator.generate("ES"),
    });

    await checkoutPage.verifyEmailErrorDisplayed("El correo no tiene el formato correcto");
  });
});
