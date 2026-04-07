# Auto Invest — DCA Improvement

**Pillar:** Finance Platform
**Platform:** Mobile app (430px)
**Date created:** 2026-04-06
**Status:** Draft

## Description

Auto Invest (DCA) improvement prototype. Covers the landing page with category filtering (Best/ETF/Basket), a setup form with frequency selection and a 1-year projection chart, a confirmation screen, success screen, and a My Plans view.

## Source

Figma: https://www.figma.com/design/LMPC2FjEUaIPHXyDZ6qnRU/T2-DCA-Improvement?node-id=5598-18295

## Screen Flow

```
Landing (Best/ETF/Basket tabs)
  → [tap asset card] → Setup Form (amount + frequency + 1Y projection chart)
                          → [Buat Jadwal] → Confirmation
                                              → [Konfirmasi] → Success
                                                                 → [OK] → My Plans
Landing
  → [Lihat Rencana Saya / View My Plans] → My Plans
                                             → [Buat Rencana DCA] → Landing
```

## Screens

1. **Landing** — Best / ETF / Basket tabs; asset cards with sparkline charts and estimated returns; "Explore More Assets" + "View My Plans" CTAs
2. **Setup Form** — Asset selector, Rp amount input with Indonesian number formatting, frequency pill selector (Per Jam / Harian / Mingguan / Bulanan), 1-year projection chart with capital vs. portfolio value
3. **Confirmation** — Summarises asset, schedule, fee breakdown, total amount payable
4. **Success** — Green check with asset name; "OK" returns to My Plans
5. **My Plans** — Filterable list (All / Single Asset / Multiple Assets) with plan cards showing PnL, stats, and sparkline

## How to Run

```bash
npx serve pillars/finance-platform/prototypes-wip/dca-improvement/
```

Or open `index.html` directly in a browser.

**Language toggle:** Press `Shift+L` to switch between Bahasa Indonesia and English.

## Key Interactions

- Category tabs on landing switch Best/ETF/Basket asset lists
- Tapping any asset card navigates to the Setup screen pre-filled with that asset
- Typing an amount updates the projection chart in real time
- Frequency pills recalculate the 1-year capital and projected return
- Validation: minimum Rp 11.000 enforced before proceeding to Confirmation
- My Plans filter pills hide/show plan cards by type
# design-project
# design-project
# design-project
