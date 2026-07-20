# TED-Ed Lesson Editor Automation Suite

A robust end-to-end behavior-driven development (BDD) and exploratory testing framework built using **Playwright (TypeScript)** and **Cucumber.js** to test the TED-Ed Lesson Editor platform.

## 🚀 Technology Stack
* **Testing Library**: Playwright (v1.45+ / @playwright/test v1.60+)
* **Behavior-Driven Development**: Cucumber.js (v9.0.0)
* **Language**: TypeScript (v5.5.0) / ts-node
* **Reporting**: Multiple Cucumber HTML Reporter & Allure Reports

---

## 📁 Project Structure
```text
C:/New folder (2)
├── src/
│   ├── assertions/         # Custom assertion modules
│   ├── features/           # Cucumber BDD feature specifications (.feature files)
│   ├── hooks/              # Cucumber hooks (Before/After setup and teardown)
│   ├── pages/              # Page Object Model (POM) files (e.g., LoginPage.ts, TedEdLessonPage.ts)
│   ├── step-definitions/   # Cucumber step definitions mapped to feature scenarios
│   ├── support/            # Custom context and browser setup helpers
│   └── utils/              # Configuration and environment managers
├── tests/
│   └── exploratory.spec.ts # Playwright exploratory test suite (covering TC-051 to TC-100)
├── scripts/
│   └── generate-report.js  # Script to compile Cucumber JSON results into HTML reports
├── playwright.config.ts    # Playwright runner configuration
├── cucumber.json           # Cucumber runner configuration profiles
└── tsconfig.json           # TypeScript configuration
```

---

## 🛠️ Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

Install Playwright browser binaries:
```bash
npx playwright install
```

---

## 🏃 Running the Tests

The framework supports running Cucumber features (BDD style) and Playwright Spec files directly on any operating system (Windows, macOS, Linux).

### Run Cucumber BDD Tests
* **Run all features** (excluding skipped scenarios):
  ```bash
  npm test
  ```
* **Run Smoke Tests**:
  ```bash
  npm run test:smoke
  ```
* **Run Regression Tests**:
  ```bash
  npm run test:regression
  ```
* **Run Headed Mode** (Interactive):
  ```bash
  npm run test:headed
  ```
* **Run Specific Feature Tags**:
  To run specific scenarios/features by their tag (e.g., `@letsBegin`, `@thinkMCQ`, `@discussForums`):
  ```bash
  npx cucumber-js --tags "@tagName"
  ```

### Run Playwright Exploratory Spec
To run the automated exploratory tests (covering test cases **TC-051 to TC-100**):
```bash
npx playwright test
```

---

## 📊 Test Reporting

This framework generates clean, interactive HTML test reports using **Multiple Cucumber HTML Reporter**.

* **Generate HTML Report**:
  ```bash
  npm run report
  ```
* **Run Tests and Auto-generate Report**:
  ```bash
  npm run test:report
  ```
The report will be available locally at `reports/html-report/index.html`.

---

## ⚙️ Configuration & Environment

* **Target URL**: The tests default to run against `https://teded-integration.herokuapp.com/`.
* **Environment Variables**: Configure variables by creating a `.env` file in the root directory (automatically ignored by git):
  * `HTTP_AUTH_USERNAME`: HTTP Basic Auth username.
  * `HTTP_AUTH_PASSWORD`: HTTP Basic Auth password.
  * `TED_LOGIN_EMAIL`: Login email for the application.
  * `TED_LOGIN_PASSWORD`: Login password for the application.
* **Headless execution**: Set to `true` by default, but can be overridden using environment variables or scripts.
