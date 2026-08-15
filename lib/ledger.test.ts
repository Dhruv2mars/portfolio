import { expect, test } from "bun:test";
import { LEDGER, fieldWidth, ledgerSpec } from "@/lib/ledger";

test("the field is exactly one year wide", () => {
  expect(fieldWidth()).toBe(LEDGER.field);
});

test("the unit is one cell pitch", () => {
  expect(LEDGER.cell + LEDGER.gap).toBe(LEDGER.unit);
});

test("the prose measure is a whole number of units", () => {
  expect(LEDGER.prose % LEDGER.unit).toBe(0);
});

test("the footer spec line is literally true", () => {
  expect(ledgerSpec()).toBe(
    `${LEDGER.weeks}w × ${LEDGER.days}d · unit ${LEDGER.unit}px`,
  );
  // it must not claim a width, because the field goes fluid below 1056px
  expect(ledgerSpec()).not.toContain("1056");
});
