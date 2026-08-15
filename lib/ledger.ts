/**
 * LEDGER measurement constants — the single source of truth.
 *
 * Everything on the site derives from one heatmap cell. The footer spec line
 * and the layout both read these, so the claim the footer makes is literally
 * true by construction (DESIGN.md §8 §FIX-10).
 */
export const LEDGER = {
  /** one day */
  cell: 16,
  /** between days */
  gap: 4,
  /** cell pitch — the only spacing atom */
  unit: 20,
  /** weeks across a year grid */
  weeks: 53,
  /** days down */
  days: 7,
  /** 53*16 + 52*4 — the year, and the page width */
  field: 1056,
  /** 32 units — Post body measure */
  prose: 640,
} as const;

/** Sanity: the field really is one year wide. */
export function fieldWidth(): number {
  return LEDGER.weeks * LEDGER.cell + (LEDGER.weeks - 1) * LEDGER.gap;
}

/**
 * The footer spec line. Prints only breakpoint-invariant facts — the field
 * width is deliberately absent because it goes fluid below 1056px.
 */
export function ledgerSpec(): string {
  return `${LEDGER.weeks}w × ${LEDGER.days}d · unit ${LEDGER.unit}px`;
}
