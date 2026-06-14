import { Page } from "@playwright/test";

/**
 * FilterBar Page Object Model
 *
 * Encapsulates all interactions with the vehicle filter bar.
 * Responsible only for UI interactions (NO synchronization / NO assertions).
 */
type FilterType = "promociones" | "entregaRapida" | "permanencia" | "combustible" | "cambio" | "tipoDeCoche" | "marca" | "color";

export class FilterBar {
  constructor(private page: Page) {}

  /**
   * Locator for all filter buttons in the filter bar.
   */
  private get filters() {
    return this.page.locator('[class*="filter__button"][class*="row"]');
  }

  /**
   * Selects a filter and applies a value.
   *
   * Special case:
   * - "marca" requires expanding an additional UI layer before selection.
   *
   * NOTE:
   * This method does NOT wait for grid updates.
   * Synchronization must be handled in CatalogPage or the test.
   */
  async selectFilter(type: FilterType, value: string): Promise<void> {
    // Open filter by visible label
    await this.filters
      .filter({ hasText: this.getFilterLabel(type) })
      .first()
      .click();

    // Special handling for brand filter
    if (type === "marca") {
      const brandExpander = this.page.locator("div.pointer > p");
      await brandExpander.click({ timeout: 1000 }).catch(() => {});
      const brandContainer = this.page.locator('div[class*="FilterShortcutButton-module"]');
      await brandContainer.getByText(value, { exact: true }).click();
      return;
    }

    // Generic filter selection
    await this.page.getByText(value, { exact: true }).click();
  }

  /**
   * Clears all active filters.
   */
  async clearAllFilters(): Promise<void> {
    const resetButton = this.page.locator('div[class*="filter__button__reset"]');
    await resetButton.first().click();
  }

  /**
   * Maps internal filter keys to UI labels.
   */
  private getFilterLabel(type: FilterType): string {
    const labels: Record<FilterType, string> = {
      promociones: "Promociones",
      entregaRapida: "Entrega rápida",
      permanencia: "Permanencia",
      combustible: "Combustible",
      cambio: "Cambio",
      tipoDeCoche: "Tipo de coche",
      marca: "Marca",
      color: "Color",
    };

    return labels[type];
  }
}
