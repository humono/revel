import { expect, test } from "@playwright/test";
import { CatalogPage } from "../pages/CatalogPage";
import { CookieBanner } from "../pages/components/CookieBanner";
import { FilterBar } from "../pages/components/FilterBar";

/**
 * Test Suite: Flujo B - End-to-End Vehicle filter
 * Covers end-to-end multi-page user journeys from the vehicle catalog down to the lead registration conversion stage.
 * Includes both business-happy paths and error-handling scenarios.
 */
test.describe("Flujo B - Regression tests", () => {
  let catalogPage: CatalogPage;
  let filterBar: FilterBar;

  // Setup: Navigate to the catalogue page and clear cookies before each test case
  test.beforeEach(async ({ page }) => {
    catalogPage = new CatalogPage(page);
    filterBar = new FilterBar(page);

    const cookies = new CookieBanner(page);

    await page.goto("https://driverevel.com/coches");
    await cookies.acceptAllCookies();
  });

  /**
   * Regression Test: Filter by Brand
   *
   * This test validates that applying a brand filter correctly updates the vehicle catalog grid.
   *
   * Expected Result:
   * - The grid is refreshed after applying the filter.
   * - All displayed vehicles match the selected brand criteria.
   *
   * This ensures the brand filtering functionality works correctly and remains stable across UI changes.
   */
  test("Filter by Brand should refresh the grid with matching items", async () => {
    const brandToFilter = "BMW";

    await filterBar.selectFilter("marca", brandToFilter);
    await catalogPage.waitForGridToLoad();
    await catalogPage.verifyAllVisibleCarsMatchBrand(brandToFilter);
  });

  /**
   * Regression Test: Filter by Brand and Reset
   *
   * This test validates that applying a brand filter updates the vehicle catalog grid and that the grid can be restored to its initial state.
   *
   * Expected Result:
   * - The grid is refreshed after applying the filter.
   * - All displayed vehicles match the selected brand criteria.
   * - The grid can be restored to its initial state after resetting filters.
   *
   * This ensures the brand filtering and reset functionality works correctly and remains stable across UI changes.
   */
  test("Should change results when filter is applied and restore them after reset", async () => {
    await catalogPage.saveVisibleCarTitles();

    await filterBar.selectFilter("marca", "BMW");
    await catalogPage.waitForGridToLoad();

    const filteredTitles = await catalogPage.getVisibleTitles();
    expect(filteredTitles.length).toBeGreaterThan(0);
    await catalogPage.verifyVisibleCarTitlesChanged(filteredTitles);

    await filterBar.clearAllFilters();
    await catalogPage.waitForGridToLoad();

    await catalogPage.verifyVisibleCarTitlesRestored();
  });
});
