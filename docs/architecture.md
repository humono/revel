# 🧱 Architecture Overview – Web Automation Framework

## 📌 High-Level Architecture

```text
┌──────────────────────────────────────────────┐
│                TEST LAYER                    │
│  (Business Scenarios / Assertions)           │
│                                              │
│  - catalog.spec.ts                           │
│  - checkout.spec.ts                          │
│  - configurator.spec.ts                      │
└──────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────┐
│              PAGE OBJECT LAYER               │
│  (UI Actions + Page Behavior)                │
│                                              │
│  - CatalogPage                               │
│  - ProductDetailPage                         │
│  - CheckoutPage                              │
└──────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────┐
│            COMPONENT LAYER                   │
│  (Reusable UI Blocks)                        │
│                                              │
│  - FilterBar                                 │
│  - CookieBanner                              │
│  - Navbar                                    │
└──────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────┐
│           PLAYWRIGHT ENGINE                  │
│  (Locators / Actions / Assertions)           │
└──────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────┐
│           APPLICATION UNDER TEST             │
│          https://driverevel.com              │
└──────────────────────────────────────────────┘
```

## 🎯 Architectural Principles

### 1. Separation of Concerns

```
Tests → WHAT the user does
Pages → HOW it is done
Components → REUSABLE UI logic
```

---

### 2. Data & Control Flow

```
Test
↓
Page Object (Action Layer)
↓
Component (UI abstraction)
↓
Locator Engine (Playwright)
↓
DOM (Application)
```

---

## 🧪 Layer Responsibilities

### 🧪 Test Layer

- Business validation only
- No selectors
- No UI logic
- Fully readable scenarios

### 🧱 Page Object Layer

- Encapsulates page behavior
- Manages navigation flows
- Handles UI interactions

### 🧩 Component Layer

- Shared UI blocks
- Reusable across pages
- Reduces duplication

### ⚙️ Synchronization Strategy

#### ❌ Anti-pattern:

```
waitForTimeout(5000)
```

#### ✅ Recommended:

```
expect.poll()
waitForGridToLoad()
scrollIntoViewIfNeeded()
```

> Never wait for time → always wait for state

### 🔍 Locator Strategy Pyramid

1. getByRole / getByText (preferred)
2. data-\* attributes
3. CSS module patterns
4. class\* partial matching
5. XPath (last resort)

### 🔄 Test Flow Pattern (AAA)

ARRANGE → ACT → ASSERT

```ts
// ARRANGE
Example: await catalogPage.saveVisibleCarTitles();

// ACT
await filterBar.selectFilter("marca", "BMW");

// ASSERT
await catalogPage.verifyVisibleCarTitlesChanged(filtered);
```

### 🚀 Scalability Model

1. Add Feature
2. Create Page Object
3. Add Components
4. Reuse in Tests
5. Avoid duplication in test layer

### 🧠 Design Philosophy

Tests fail because product breaks, not because framework is fragile.

### 📊 Benefits

- High CI stability
- Low flakiness
- Fast execution
- Easy onboarding
- Scalable architecture
- Clean separation of concerns
