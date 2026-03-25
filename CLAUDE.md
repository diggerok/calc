# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
npx prisma migrate dev   # Run DB migrations
npx prisma generate      # Regenerate Prisma client
```

## Architecture

Next.js 16 App Router calculator application for blind/curtain pricing. Russian-language UI throughout. All paths aliased as `@/*` → `src/*`.

### Core Data Flow

User inputs (width, height, options, quantity) → `calculateRowPrice()` in `src/lib/pricing.ts` → price in USD → converted to RUB via exchange rate → markup/discount applied in `PriceSummary`.

### Two Pricing Modes

- **Matrix** (`pricingMode: "matrix"`): 2D lookup in `widths × heights` arrays from JSON price data. Used by most calculators (BNT, Mini, ZIP, etc.).
- **Custom** (`pricingMode: "custom"`): Calculator-specific functions in `src/lib/custom-pricing.ts`. Used by 9 calculators (DB-Blinds, Venus16/25, GZH, Vertical, Plissé variants, Roman Rails).

Both modes apply option-based surcharges from `src/lib/surcharges.ts` (flat, width-dependent, or height-dependent).

### Adding a New Calculator

1. Create config in `src/lib/calculator-configs/` implementing `CalculatorConfig` from `src/types/calculator.ts`
2. Add price data JSON in `src/lib/price-data/`
3. Register in `src/lib/calculator-configs/index.ts`
4. If custom pricing: add function in `src/lib/custom-pricing.ts` and register in `initCustomPricing()`
5. If surcharges: add function in `src/lib/surcharges.ts`

### Key Files

- `src/components/Calculator.tsx` — main client component managing calc state
- `src/components/CalcRow.tsx` — individual row (width, height, options, quantity)
- `src/lib/pricing.ts` — price lookup and calculation engine
- `src/lib/custom-pricing.ts` — custom pricing functions for non-matrix calculators
- `src/lib/surcharges.ts` — option-based surcharge functions
- `src/lib/dynamic-values.ts` — resolves dynamic option values from price data
- `src/types/calculator.ts` — core TypeScript interfaces (`CalculatorConfig`, `CalcRowData`, `PriceData`)

### Routing

- `/` → redirects to `/calc`
- `/calc` → calculator list (grouped by product type)
- `/calc/[type]` → individual calculator page (type = config id)
- `/history` — saved calculation history
- `/api/calculations` — POST/GET calculations (Prisma + SQLite) 

### Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma 7 with SQLite (libsql), next-auth 5 beta.
