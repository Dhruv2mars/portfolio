"use client";

import type {
  TokenActivityRange,
  TokenActivityViewModel,
} from "@/lib/token-activity";
import { formatTokens } from "@/lib/token-activity";

const RANGES: readonly { id: TokenActivityRange; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "cumulative", label: "Cumulative" },
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type TokenActivityProps = {
  model: TokenActivityViewModel;
  onRangeChange?: (range: TokenActivityRange) => void;
};

export function TokenActivity({ model, onRangeChange }: TokenActivityProps) {
  const weeks = groupCellsByWeek(model.cells);
  const seriesMax = Math.max(1, ...model.series.map((point) => point.value));

  return (
    <section
      className="token-activity"
      aria-label="Token activity"
      aria-labelledby="token-activity-title"
    >
      <header className="token-activity__header">
        <div className="token-activity__intro">
          <h2 id="token-activity-title" className="token-activity__title">
            {model.title}
          </h2>
          <p className="token-activity__description">{model.description}</p>
        </div>

        <div
          className="token-activity__ranges"
          role="tablist"
          aria-label="Activity range"
        >
          {RANGES.map((range) => {
            const selected = model.range === range.id;
            return (
              <button
                key={range.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={
                  selected
                    ? "token-activity__range is-active"
                    : "token-activity__range"
                }
                onClick={() => onRangeChange?.(range.id)}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </header>

      <dl className="token-activity__stats">
        {model.stats.map((stat) => (
          <div key={stat.label} className="token-activity__stat">
            <dt>{stat.label}</dt>
            <dd>
              <span className="token-activity__stat-value">{stat.value}</span>
              {stat.hint ? (
                <span className="token-activity__stat-hint">{stat.hint}</span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>

      <div
        className="token-activity__series"
        role="img"
        aria-label={`Activity series (${model.range})`}
      >
        {model.series.map((point) => {
          const height = Math.max(4, Math.round((point.value / seriesMax) * 100));
          return (
            <div
              key={point.key}
              className="token-activity__bar"
              role="presentation"
              title={`${point.label}: ${formatTokens(point.value)}`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      <div className="token-activity__grid-wrap">
        <div className="token-activity__weekday-labels" aria-hidden="true">
          {WEEKDAY_LABELS.map((label, index) =>
            index % 2 === 1 ? <span key={label}>{label}</span> : <span key={label} />,
          )}
        </div>

        <div
          className="token-activity__grid"
          role="grid"
          aria-label="Contribution grid"
        >
          {weeks.map((week) => (
            <div key={week.key} className="token-activity__week" role="row">
              {week.cells.map((cell, index) =>
                cell ? (
                  <span
                    key={cell.date}
                    role="gridcell"
                    className="token-activity__cell"
                    data-intensity={cell.intensity}
                    title={`${cell.date}: ${formatTokens(cell.tokens)} tokens`}
                    aria-label={`${cell.date}: ${formatTokens(cell.tokens)} tokens`}
                  />
                ) : (
                  <span
                    key={`${week.key}-empty-${index}`}
                    className="token-activity__cell is-empty"
                    role="gridcell"
                    aria-hidden="true"
                  />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="token-activity__legend" aria-hidden="true">
        <span>Less</span>
        {model.legend.map((item) => (
          <span
            key={item.intensity}
            className="token-activity__cell"
            data-intensity={item.intensity}
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}

type WeekColumn = {
  key: string;
  cells: Array<TokenActivityViewModel["cells"][number] | null>;
};

function groupCellsByWeek(
  cells: TokenActivityViewModel["cells"],
): WeekColumn[] {
  if (cells.length === 0) return [];

  const weeks: WeekColumn[] = [];
  let current: WeekColumn | null = null;

  for (const cell of cells) {
    if (!current || cell.weekday === 0) {
      current = {
        key: cell.date,
        cells: Array.from({ length: 7 }, () => null),
      };
      weeks.push(current);
    }
    current.cells[cell.weekday] = cell;
  }

  return weeks;
}
