# 🚀 Web Automation Framework (Playwright + TypeScript)

An End-to-End (E2E) and UI test automation project designed with Playwright and TypeScript. This framework follows the Page Object Model (POM) design pattern to ensure maximum stability, maintainability, and execution speed.

## 🛠️ Core Technologies

- **[Playwright](https://playwright.dev):** Microsoft's fast and reliable E2E testing framework.
- **[TypeScript](https://typescriptlang.org):** Static typing for building scalable and robust test code.
- **[POM (Page Object Model)](https://playwright.dev):** Design pattern that separates page UI logic from test assertions.

## 💡 Why TypeScript instead of JavaScript?

We selected **TypeScript** as our primary programming language due to the following architectural advantages:

- **Static Typing:** Prevents common runtime errors (e.g., misspelled variables or incorrect data types) before tests even execute.
- **Advanced Autocomplete (IntelliSense):** Speeds up test writing by auto-suggesting Playwright locators and custom POM methods.
- **Safe Refactoring:** Allows safe renaming of selectors or page methods across the entire codebase without breaking unexpected modules.
- **Inline Documentation:** Hovering over any Playwright method reveals exact parameters and usage examples without leaving the code editor.

## 📋 Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org) (Version 18 or higher recommended).
- [Git](https://git-scm.com).
- A code editor like [Visual Studio Code](https://visualstudio.com).

## 🚀 Getting Started

1. **Clone the repository:**

   ```bash
   cd <DESIRED_PROJECT_FOLDER>
   git clone https://github.com/humono/revel.git
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

| Command                                   | Description                                               |
| :---------------------------------------- | :-------------------------------------------------------- |
| `npx playwright test`                     | Runs all tests in headless mode (no visible browser).     |
| `npx playwright test --headed`            | Runs tests with a visible browser window.                 |
| `npx playwright test <file-name.spec.ts>` | Runs a specific test suite file.                          |
| `npx playwright test --ui`                | Launches Playwright's interactive UI Mode.                |
| `npx playwright show-report`              | Opens the generated HTML test execution report.           |
| `npx playwright test --debug`             | Steps through execution line-by-line using the inspector. |

## 📁 Architecture & Test Distribution

This framework maps directly to the user journeys of the [REVEL](https://driverevel.com) platform.

```text
├── pages/                   # UI Locators and Actions (POM)
│   ├── components/
│   │   ├── Navbar.ts        # Global navigation
│   │   └── Footer.ts        # Lower links, privacy policy, and social media
│   ├── HomePage.ts          # Main Landing
│   ├── CatalogPage.ts       # Vehicle Catalog
│   ├── ProductDetailPage.ts # Car detail page
│   └── CheckoutPage.ts      # Digital checkout funnel
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

## 🧹 Test Data Cleanup Strategy (Critical for Reliable E2E Tests)

In end-to-end automation, test isolation is a critical requirement to avoid flaky results and data pollution across executions.

This framework enforces a “clean state first, clean state after” approach whenever tests modify persistent or semi-persistent data (e.g. leads, forms, backend entities, or UI state tied to server-side data).

### 🎯 Core Principle

Each test must be independent and leave no trace in the system.

### 🔄 When Cleanup is Required

Cleanup is mandatory when tests involve:

- Lead / form submissions (e.g. checkout or contact forms)
- Backend-created entities (users, requests, bookings, etc.)
- Filters or UI states that persist across sessions
- Any API-driven mutation with side effects
- Analytics or tracking-sensitive flows (ROI-critical paths)

### 🧪 Recommended Patterns for Clean Tests

1. Pre-Test Cleanup (Preferred when possible)

```ts
// Ensure the environment starts in a known state:
test.beforeEach(async () => {
  await api.deleteTestLeads(); // example backend cleanup
});
```

2. Post-Test Cleanup (Required for critical flows)

```ts
// Used when data is created during the test:
test.afterEach(async () => {
  await api.deleteCreatedLead(testLeadId);
});
```

3. Scoped Cleanup Inside Page Objects

```ts
// Encapsulate cleanup logic close to the feature:
await checkoutPage.submitLeadForm();
```

> Cleanup responsibility can be handled via API or teardown hook

### 🧠 Best Practice: Prefer API-Level Cleanup

Whenever possible:

- Avoid cleaning through UI (slow & fragile)
- Use API calls or database hooks
- Keep UI only for validation, not teardown

### ⚙️ State Isolation Strategy

To prevent cross-test contamination:

- Never rely on previous test state
- Always reset filters, sessions, or UI state when needed
- Use fresh browser context per test (Playwright default behavior)
- Avoid shared mutable global state in Page Objects

### 🚨 Anti-Patterns to Avoid

```
❌ Leaving created leads without cleanup
❌ Reusing the same user/session data across tests
❌ Relying on execution order
❌ Assuming UI reset = backend reset
❌ Mixing test data across scenarios
```
