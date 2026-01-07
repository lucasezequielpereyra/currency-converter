# Currency Converter

A modern, real-time currency converter application built with React, TypeScript, and TanStack Query.

**Live Demo:** [https://currency-converter-topaz-xi.vercel.app](https://currency-converter-topaz-xi.vercel.app)

## Features

- Real-time currency conversion using VATComply API
- Support for 30+ currencies
- European number formatting (. for thousands, , for decimals)
- Comprehensive error handling (network errors, server errors, unavailable currencies)
- Responsive design with Tailwind CSS
- Virtual scrolling for currency selectors
- Smart caching to minimize API calls

## Getting Started

### Prerequisites

- Node.js 18+
- yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lucasezequielpereyra/currency-converter
cd currency-converter
```

2. Install dependencies:
```bash
yarn install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
yarn dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint
- `yarn test:e2e` - Run E2E tests
- `yarn test:e2e:ui` - Run E2E tests with Playwright UI
- `yarn test:e2e:report` - Show Playwright test report

## Git Workflow & Pre-Push Hook

This project implements a **pre-push hook** that automatically runs E2E tests before allowing a push to the `main` branch.

### How it works:

1. When you attempt to push to `main`:
```bash
git push origin main
```

2. The pre-push hook automatically runs:
```bash
🧪 Running E2E tests before pushing to main...
```

3. **If tests pass:** Push proceeds normally
```bash
✅ E2E tests passed. Proceeding with push.
```

4. **If tests fail:** Push is blocked
```bash
❌ E2E tests failed. Push to main blocked.
Fix the failing tests before pushing to main.
```

### Why a pre-push hook?

We chose to implement the pre-push hook instead of relying solely on CI/CD for the following reason:

- **Vercel Pipeline Conflicts:** Vercel's deployment pipeline automatically triggers on every push to `main`. By validating tests locally before pushing, we prevent failed builds from being deployed and avoid conflicts with Vercel's automatic deployment process.

This approach ensures that only tested, working code reaches the `main` branch and gets deployed to production.

## Project Architecture

```
src/
├── assets/              # Icons and static assets
├── components/
│   └── common/          # Reusable components (CustomSelect, PriceInput, etc.)
├── features/
│   └── currency-converter/
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Custom hooks (useConversion, useCurrencies)
│       ├── services/    # API service layer
│       └── types/       # TypeScript interfaces
├── App.tsx              # Main application component
└── main.tsx             # Application entry point

e2e/                     # E2E tests with Playwright
.husky/                  # Git hooks (pre-push)
```

### Key Architectural Decisions

**1. Feature-based structure:** Code is organized by feature (currency-converter) rather than by type, making it easier to scale and maintain.

**2. Service layer:** API calls are isolated in `services/currencyApi.ts`, separating data fetching from UI logic.

**3. Custom hooks:** Business logic is encapsulated in custom hooks (`useConversion`, `useCurrencies`), keeping components clean and focused on presentation.

**4. TypeScript:** Full type safety across the application to catch errors at compile time.

## Testing Strategy

### Why E2E Tests?

This project uses **End-to-End (E2E) tests** instead of unit or integration tests for the following reasons:

1. **Single-page application:** The entire application is one screen, making E2E testing more practical than fragmenting logic across multiple unit tests.

2. **Real API integration:** E2E tests validate the entire flow from UI interactions to API responses, ensuring the application works as users expect.

3. **Comprehensive coverage:** A single E2E test can validate multiple aspects (UI, API, state management, error handling) simultaneously.

### Test Coverage

The test suite includes 20 E2E tests covering:

- Currency conversions with different pairs (USD→EUR, EUR→USD, GBP→CAD, etc.)
- Amount changes and dynamic title updates
- Error scenarios (network errors, server errors, unavailable currencies)
- Number formatting validation (European format)
- Input validation (zero, negative numbers)
- Exact calculation verification with mocked API

**Current test pass rate:** 100% (20/20 tests passing)

## Technology Stack

### Core Libraries

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite (Rolldown)** - Build tool and dev server
- **TanStack Query** - Data fetching, caching, and state management
- **TanStack Virtual** - Virtual scrolling for currency dropdowns

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework

We chose Tailwind for this project because:
- Fewer files to manage (no separate CSS/SCSS files)
- Perfect for small projects where custom design systems aren't needed
- Faster development with utility classes
- Built-in responsive design

### Testing

- **Playwright** - E2E testing framework

### Development Tools

- **Husky** - Git hooks management (pre-push)
- **ESLint** - Code linting

### Why No Component Libraries?

This project intentionally **does not use any component libraries** (Material-UI, Chakra UI, Ant Design, etc.) for the following reasons:

1. **Small project scope:** The application has only a few components (select, input, button). Creating custom components is faster than learning and configuring a library.

2. **Full control:** Custom components give us complete control over styling, behavior, and bundle size.

3. **No bloat:** Component libraries often include hundreds of components we don't need, increasing bundle size unnecessarily.

4. **Learning experience:** Building components from scratch demonstrates fundamental React skills.

All UI components are **built natively** using React, TypeScript, and Tailwind CSS. The only external dependencies used are the functional libraries mentioned above: TanStack Query for data fetching and caching, and TanStack Virtual for optimized list rendering.

## API

This application uses the [VATComply API](https://www.vatcomply.com/) for currency data:

- **Currencies endpoint:** `GET /currencies` - Returns available currencies with names and symbols
- **Rates endpoint:** `GET /rates?base=USD&symbols=EUR` - Returns exchange rates for specified currencies

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.vatcomply.com
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Author

Lucas Pereyra
