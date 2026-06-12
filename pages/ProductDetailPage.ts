import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly plan12MesesBtn: Locator;
  readonly plan36MesesBtn: Locator;
  readonly km15kBtn: Locator;
  readonly km20kBtn: Locator;
  readonly precioMensualText: Locator;
  readonly contratarBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.plan12MesesBtn = page.getByRole('button', { name: 'Renting 12 meses' });
    this.plan36MesesBtn = page.getByRole('button', { name: 'Renting 36 meses' });
    this.km15kBtn = page.getByText('15.000 km/ año');
    this.km20kBtn = page.getByText('20.000 km/ año');
    this.precioMensualText = page.locator('.precio-cuota'); // Cambiar por el selector real
    this.contratarBtn = page.getByRole('button', { name: 'Quiero este coche' });
  }

  async seleccionarPlan(meses: 12 | 36) {
    if (meses === 12) await this.plan12MesesBtn.click();
    else await this.plan36MesesBtn.click();
  }
}