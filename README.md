# Coupon Engine — React Native

A production-quality coupon management mobile application built with React Native and Expo, featuring search, filtering, validation, and clipboard support.
The app allows users to browse available coupons, search and filter them, view coupon details, validate coupons against a cart amount, and manage applied coupons during the current session.

---

## Features

- **Coupon List** — Browse all available coupons with real-time search by code or description, and filter by discount type (Percentage, Flat, Free Shipping)
- **Coupon Detail** — View full coupon details including discount type, value, minimum order, expiry, applicable categories, and status
- **Copy Coupon Code** — One-tap clipboard copy with instant visual feedback ("✓ Copied!" for 2 seconds)
- **Coupon Validator** — Enter a coupon code and cart total to validate against a pure business logic engine; displays detailed success/failure results
- **Applied Coupons** — View and manage all coupons applied during the current session with one-tap removal
- **State Handling** — Distinct loading, error (with retry), API-empty, and search-empty states across every screen
- **Mock API** — Simulated REST API with configurable network delay and failure rate, swappable for a real backend without UI changes
- **Reusable Components** — 12+ shared components (CouponCard, SearchBar, FilterChip, StatusBadge, PrimaryButton, etc.) used across all screens
- **Type-Safe Validation Engine** — Framework-agnostic, pure-function validation pipeline with discriminated union results and structured failure codes

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React Native** | Cross-platform mobile UI |
| **Expo SDK 52** | Build tooling, development server, native APIs |
| **TypeScript** | Static typing across the entire codebase |
| **React Navigation** | Native stack navigation with type-safe route params |
| **React Context + useReducer** | Application state management |
| **Expo Clipboard** | Copy coupon codes to device clipboard |

---

## Project Structure

```
CouponEngine/
├── App.tsx                              # Entry point — SafeAreaProvider → NavigationContainer → CouponProvider
├── app.json                             # Expo configuration
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── assets/                              # App icons and splash screen
│
└── src/
    ├── types/                           # TypeScript interfaces and type definitions
    │   ├── coupon.ts                    #   Coupon, AppliedCoupon, ValidationResult, ValidationFailureCode
    │   ├── navigation.ts               #   RootStackParamList (type-safe route params)
    │   └── index.ts                    #   Barrel export
    │
    ├── data/
    │   └── coupons.json                 # Mock coupon dataset (10 coupons: 7 active, 3 expired)
    │
    ├── services/
    │   ├── couponService.ts             # Mock API — fetchCoupons(), fetchCouponByCode()
    │   └── index.ts
    │
    ├── constants/
    │   ├── theme.ts                     # Design tokens — COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, CARD_SHADOW
    │   ├── config.ts                    # App config — API delays, currency symbol, filter options, shipping cost
    │   └── index.ts
    │
    ├── context/
    │   ├── CouponContext.tsx            # Global state — useReducer managing coupons, loading, error, appliedCoupons
    │   └── index.ts
    │
    ├── hooks/
    │   ├── useCoupons.ts               # Type-safe context consumer hook
    │   └── index.ts
    │
    ├── utils/
    │   ├── couponValidator.ts           # Pure validation engine — 6 exported functions, zero React dependencies
    │   ├── formatters.ts                # Display helpers — formatDiscount, formatCurrency, formatDate, etc.
    │   └── index.ts
    │
    ├── navigation/
    │   ├── AppNavigator.tsx             # Native Stack with 4 screens + header navigation
    │   └── index.ts
    │
    ├── screens/
    │   ├── CouponListScreen.tsx         # FlatList + SearchBar + FilterChips + state handling
    │   ├── CouponDetailScreen.tsx       # Full detail view + clipboard + apply button
    │   ├── CouponValidatorScreen.tsx    # Input form → validateCoupon() → result card
    │   ├── AppliedCouponsScreen.tsx     # FlatList of applied coupons + remove
    │   └── index.ts
    │
    ├── components/
    │   ├── common/                      # Shared UI primitives
    │   │   ├── LoadingView.tsx          #   Full-screen ActivityIndicator with message
    │   │   ├── ErrorView.tsx            #   Error message with retry button
    │   │   ├── EmptyState.tsx           #   Empty list placeholder
    │   │   ├── PrimaryButton.tsx        #   CTA button with disabled state + accessibility
    │   │   ├── SearchBar.tsx            #   Controlled text input with clear button
    │   │   ├── FilterChip.tsx           #   Toggleable pill for type filtering
    │   │   ├── StatusBadge.tsx          #   Active/Expired colored badge
    │   │   ├── CouponInfoRow.tsx        #   Label/value pair for detail screens
    │   │   ├── CategoryChip.tsx         #   Read-only category pill
    │   │   ├── ValidationResultCard.tsx #   Success/failure result display
    │   │   └── index.ts
    │   ├── coupon/                      # Domain-specific components
    │   │   ├── CouponCard.tsx           #   List item card (React.memo)
    │   │   ├── AppliedCouponCard.tsx    #   Applied coupon card with remove (React.memo)
    │   │   └── index.ts
    │   └── index.ts
    │
    └── styles/
        ├── globalStyles.ts              # Shared layout styles
        └── index.ts
```

---

## Architecture Decisions

### Services are separated from screens

Screens never import `coupons.json` or construct API calls. They consume data exclusively through Context, which delegates to `couponService.ts`. This separation means:

- Replacing the mock API with `fetch()` calls to a real backend requires changing **one file** (`couponService.ts`) — zero UI changes.
- Loading, error, and success states are exercised identically whether data is mocked or real.

### Validation logic lives in `utils/couponValidator.ts`

The validation engine is a collection of **pure functions** with zero React imports. It can run in Node.js, a test runner, or a backend without modification. Screens never contain if/else logic for expiry checks, minimum order validation, or discount calculation — they call `validateCoupon()` and render the result.

### Context API was chosen over Redux

This application has a **single domain** (coupons) with straightforward state transitions (fetch, apply, remove). Context + `useReducer` handles this cleanly without Redux boilerplate. If the app grew to multiple domains (cart, user, orders), we would introduce either multiple contexts or migrate to a dedicated state library.

### Mock API is swappable

`couponService.ts` wraps `coupons.json` in `Promise` + `setTimeout` to simulate network latency. Every consumer calls `await fetchCoupons()` — the same interface a real HTTP client would expose. The swap path:

```
// Current (mock)
return couponsData as Coupon[];

// Future (real)
const response = await fetch('https://api.example.com/coupons');
return response.json();
```

### Reusable components minimize duplication

12+ shared components (`PrimaryButton`, `SearchBar`, `FilterChip`, `StatusBadge`, `CouponInfoRow`, `EmptyState`, `LoadingView`, `ErrorView`, etc.) are used across all 4 screens. No JSX is duplicated — every card, badge, and info row is a single source of truth.

---

## Coupon Validation Design

The validation engine (`src/utils/couponValidator.ts`) executes a strict pipeline that short-circuits on the first failure:

```
Step 1: Coupon exists?          → NOT_FOUND
    ↓
Step 2: Cart total valid?       → INVALID_CART_TOTAL
    ↓
Step 3: Coupon expired?         → EXPIRED
    ↓
Step 4: Minimum order met?      → MINIMUM_ORDER_NOT_MET
    ↓
Step 5: Calculate discount      → INVALID_DISCOUNT_TYPE
    ↓
Step 6: Calculate final price
    ↓
Step 7: Return success result
```

**Supported discount types:**

| Type | Example | Cart ₹1000 |
|---|---|---|
| Percentage | 20% off | Discount ₹200, Final ₹800 |
| Flat | ₹150 off | Discount ₹150, Final ₹850 |
| Free Shipping | Waive ₹50 | Savings ₹50, Final ₹1000 |

**Key design properties:**

- All functions are **pure** — no side effects, no state, no I/O
- `ValidationResult` is a **discriminated union** — TypeScript enforces exhaustive handling at every call site
- `ValidationFailureCode` uses a const object (not enum) for zero runtime overhead and JSON serializability
- `isCouponExpired()` accepts an optional `referenceDate` parameter for **deterministic unit testing**
- Shipping cost is configurable via `DEFAULT_SHIPPING_COST` constant, not hardcoded
- Flat discounts are **capped at cart total** — final price never goes negative

---

## AI-Assisted Development

### Tools Used

- **GitHub Copilot (Agent Mode)** — Primary development tool. Used for architecture scaffolding, screen implementation, validation engine design, and production-readiness audits.

- **ChatGPT** — Used for reviewing architectural decisions, exploring alternative patterns, and validating edge case handling.

- **Claude**-

Used to review code readability.
Suggested cleaner component structure and naming.

-**Google Gemini**-

Helped generate sample test data.
Suggested UI text and feature ideas.
Assisted with improving code explanations.

### Example Prompts

1. *"Create a scalable folder structure for a React Native Expo Coupon Engine app with TypeScript, React Navigation, Context API, mock API service, and reusable components."*
2. *"Implement the Coupon List Screen consuming mock API through Context. Handle loading, error, empty, and search-empty states distinctly."*
3. *"Build a pure, stateless, framework-agnostic coupon validation engine with discriminated union results and structured failure codes."*
4. *"Perform a production-readiness audit — check for accessibility, dead code, type safety, performance, and consistency."*

### Where AI Helped Most

- **Architecture scaffolding** — Generating the initial folder structure, type definitions, and service layer saved significant boilerplate time.
- **Validation engine design** — AI suggested the discriminated union pattern for `ValidationResult` and the fail-fast pipeline structure.
- **Production polish** — The audit phase caught an orphaned style block, missing accessibility labels, and the wrong `package.json` entry point.

### What Was Manually Corrected

- Navigation param naming (`couponCode` → `couponId`) to match the requirement of passing only IDs through navigation.
- Verified that `applyCoupon` from the Detail screen correctly passes placeholder financial values (since validation hasn't been performed).
- Reviewed all edge cases in the validation engine (negative cart totals, flat discount exceeding cart, boundary conditions on minimum order).

### How Correctness Was Validated

- TypeScript compiler (`tsc`) — zero errors across all 43+ source files after every implementation step.
- Manual testing of all state flows: loading → success, loading → error → retry, empty API, search with no results, search + filter combined.
- Verified clipboard functionality with "Copied!" feedback timing.
- Tested duplicate coupon prevention at both UI level (disabled button) and reducer level (guard clause).

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npx expo`)
- iOS Simulator, Android Emulator, or Expo Go app

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/coupon-engine.git
cd coupon-engine/CouponEngine

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Devices

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Web Browser
npx expo start --web

# Expo Go (scan QR code from terminal)
npx expo start
```

---

## Screenshots

| Coupon List | Coupon Detail | Validator (Success) |
|---|---|---|
| ![Coupon List](screenshots/coupon-list.png) | ![Coupon Detail](screenshots/coupon-detail.png) | ![Validator Success](screenshots/validator-success.png) |

| Validator (Failure) | Applied Coupons |
|---|---|
| ![Validator Failure](screenshots/validator-failure.png) | ![Applied Coupons](screenshots/applied-coupons.png) |

> Add screenshots to a `screenshots/` folder before submission.

---

## Future Improvements

- **Server-side validation** — Mirror the `validateCoupon()` function signature behind a `POST /api/validate` endpoint; the client swaps one function call for one API call
- **AsyncStorage persistence** — Save applied coupons so they survive app restarts
- **Pagination** — `fetchCoupons()` with cursor-based pagination for large datasets
- **Dark mode** — Theme tokens already support it; add a `useColorScheme` toggle
- **Unit tests** — Every validation function is pure and independently testable; add Jest test suites for `couponValidator.ts` and `formatters.ts`
- **Analytics** — Track coupon views, copies, validations, and applications
- **Pull-to-refresh** — Add `onRefresh` to FlatList for manual reload
- **Debounced search** — Throttle search filtering for performance on very large coupon lists
- **Max discount cap** — Support "20% off, up to ₹500 max" style coupons
- **Category validation** — Verify cart items against `applicableCategories`

---

## Assignment Compliance Checklist

### Functional Requirements

- [x] Coupon List Screen with FlatList
- [x] Search by coupon code or description (case-insensitive, real-time)
- [x] Filter by type: Percentage Off, Flat Discount, Free Shipping
- [x] Coupon Card showing code, discount, expiry, and status badge
- [x] Coupon Detail Screen with all fields
- [x] "Copy Code" button with clipboard integration
- [x] Coupon Validator Screen with code + cart total inputs
- [x] Validation checks: exists, expired, minimum order
- [x] Display discount amount and final price on success
- [x] Clear error messages with reason on failure
- [x] Applied Coupons Screen with session-local list
- [x] Remove applied coupon functionality

### State Handling

- [x] Loading state with ActivityIndicator
- [x] Error state with retry button
- [x] Empty state when API returns no coupons
- [x] Empty state when search/filter yields no matches
- [x] Invalid/expired coupon state in validator

### Technical Requirements

- [x] React Native with Expo
- [x] Navigation using React Navigation
- [x] Mock API with simulated network delay
- [x] Clipboard API for copying codes
- [x] Clean folder structure
- [x] Reusable components
- [x] TypeScript throughout

### Exclusions (as required)

- [x] No authentication
- [x] No real payment or checkout
- [x] No admin panel
- [x] No push notifications
- [x] No backend usage tracking

---


