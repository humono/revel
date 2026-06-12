# 🚀 Web Automation Framework (Playwright + TypeScript)

An End-to-End (E2E) and UI test automation project designed with Playwright and TypeScript. This framework follows the Page Object Model (POM) design pattern to ensure maximum stability, maintainability, and execution speed.

## 🛠️ Core Technologies

* **[Playwright](https://playwright.dev):** Microsoft's fast and reliable E2E testing framework.
* **[TypeScript](https://typescriptlang.org):** Static typing for building scalable and robust test code.
* **[POM (Page Object Model)](https://playwright.dev):** Design pattern that separates page UI logic from test assertions.

## 💡 Why TypeScript instead of JavaScript?

We selected **TypeScript** as our primary programming language due to the following architectural advantages:

* **Static Typing:** Prevents common runtime errors (e.g., misspelled variables or incorrect data types) before tests even execute.
* **Advanced Autocomplete (IntelliSense):** Speeds up test writing by auto-suggesting Playwright locators and custom POM methods.
* **Safe Refactoring:** Allows safe renaming of selectors or page methods across the entire codebase without breaking unexpected modules.
* **Inline Documentation:** Hovering over any Playwright method reveals exact parameters and usage examples without leaving the code editor.

## 📋 Prerequisites

Ensure you have the following installed on your system:
* [Node.js](https://nodejs.org) (Version 18 or higher recommended).
* [Git](https://git-scm.com).
* A code editor like [Visual Studio Code](https://visualstudio.com).

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <PROJECT_FOLDER_NAME>
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   This downloads the required binaries (Chromium, Firefox, WebKit).
   ```bash
   npx playwright install
   ```

## ⚙️ Test Execution Commands

Run these commands from the root directory of your project:

| Command | Description |
| :--- | :--- |
| `npx playwright test` | Runs all tests in headless mode (no visible browser). |
| `npx playwright test --headed` | Runs tests with a visible browser window. |
| `npx playwright test <file-name.spec.ts>` | Runs a specific test suite file. |
| `npx playwright test --ui` | Launches Playwright's interactive UI Mode. |
| `npx playwright show-report` | Opens the generated HTML test execution report. |
| `npx playwright test --debug` | Steps through execution line-by-line using the inspector. |

## 📁 Architecture & Test Distribution

This framework maps directly to the user journeys of the [REVEL](https://driverevel.com) platform.

```text
├── pages/                   # UI Locators and Actions (POM)
│   ├── components/
│   │   ├── Navbar.ts        # Global navigation (Cars, Offers, Sustainability)
│   │   └── Footer.ts        # Lower links, privacy policy, and social media
│   ├── HomePage.ts          # Main Landing (Hero banner, Ambassador section, FAQs)
│   ├── CatalogPage.ts       # Vehicle Catalog (Brand filters, price sorting)
│   ├── ProductDetailPage.ts # Configurator (12/36-month subscription plans & mileage)
│   └── CheckoutPage.ts      # Digital checkout funnel (Identity validation, payment)
│
├── tests/                   # Test Specification Files
│   ├── home.spec.ts         # Verifies hero sections, navigation links, and FAQs
│   ├── catalog.spec.ts      # Validates filtering by car brand (Audi, BMW, Cupra, etc.)
│   ├── configurator.spec.ts # Asserts dynamic price recalculation based on mileage/months
│   └── checkout.spec.ts     # E2E test covering the digital car leasing application
│
├── playwright.config.ts     # Global configurations (BaseURL, parallelization, browsers)
├── package.json             # NPM dependencies and scripts
└── tsconfig.json            # TypeScript engine rules
```

## 💻 Code Blueprint Examples

### 1. Page Object Model (`pages/ProductDetailPage.ts`)
```typescript
import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly plan12MonthsBtn: Locator;
  readonly plan36MonthsBtn: Locator;
  readonly km20kBtn: Locator;
  readonly monthlyPriceText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.plan12MonthsBtn = page.getByRole('button', { name: 'Renting 12 meses' });
    this.plan36MonthsBtn = page.getByRole('button', { name: 'Renting 36 meses' });
    this.km20kBtn = page.getByText('20.000 km/ año');
    this.monthlyPriceText = page.locator('.price-display-class'); // Replace with exact selector
  }

  async selectPlan(months: 12 | 36) {
    if (months === 12) await this.plan12MonthsBtn.click();
    else await this.plan36MonthsBtn.click();
  }
}
```

### 2. Functional Test Specs (`tests/configurator.spec.ts`)
```typescript
import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../pages/ProductDetailPage';

test.describe('Car Configurator Funnel', () => {
  test('should update monthly price when 12 months plan and 20k km are selected', async ({ page }) => {
    const pdp = new ProductDetailPage(page);
    
    // Navigate to a specific vehicle page using the config's baseURL
    await page.goto('/renting/peugeot-208'); 

    // Interact with the page elements via POM
    await pdp.selectPlan(12);
    await pdp.km20kBtn.click();

    // Assert the pricing element modifies its state correctly
    await expect(pdp.monthlyPriceText).toContainText('€/mes');
  });
});
```

### 3. Global Properties Wrapper (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://driverevel.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```