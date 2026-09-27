// BrothersFilters, Linear-style multi-segment filter pills (type · operator ·
// values · remove). Adapted from the shadcn pattern shared by the user to
// vanilla React so we don't pull in Radix/cmdk. Each pill has its own popover
// for picking values; pills compose to filter the roster.
import { useEffect, useRef, useState } from 'react';
import { Check, Plus, X, ChevronDown } from 'lucide-react';
import type { Brother } from './BrothersExplorer';

export type BrotherFilterType = 'tier' | 'major' | 'year' | 'memberClass';
export type FilterOperator = 'is' | 'is not' | 'is any of';

export interface BrotherFilter {
  id: string;
  type: BrotherFilterType;
  operator: FilterOperator;
  values: string[];
}

const FILTER_LABELS: Record<BrotherFilterType, string> = {
  tier: 'Tier',
  major: 'Major',
  year: 'Year',
  memberClass: 'Class',
};

const TIER_OPTIONS: Array<{ value: Brother['tier']; label: string }> = [
  { value: 'exec', label: 'Executive Board' },
  { value: 'officer', label: 'Cabinet' },
  { value: 'active', label: 'Active member' },
  { value: 'alumni', label: 'Alumni' },
];

/** Returns the operators allowed for a given filter + selection size. */
function operatorsFor(values: string[]): FilterOperator[] {
  if (values.length > 1) return ['is any of', 'is not'];
  return ['is', 'is not'];
}

/** Apply the current filter set to a brother list. Each filter narrows. */
export function applyBrotherFilters(brothers: Brother[], filters: BrotherFilter[]): Brother[] {
  return brothers.filter((b) =>
    filters.every((f) => {
      if (f.values.length === 0) return true;
      const brotherValue =
        f.type === 'tier'
          ? b.tier
          : f.type === 'major'
            ? b.major
            : f.type === 'year'
              ? (b.year ?? '')
              : (b.memberClass ?? '');
      const match = f.values.includes(brotherValue);
      if (f.operator === 'is not') return !match;
      return match; // is / is any of
    }),
  );
}

/* -------------------------------------------------------------------------- */
/*                          Generic click-outside hook                         */
/* -------------------------------------------------------------------------- */
function useClickOutside<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // Defer attaching the document click listener by one frame so the click
    // event that just OPENED this popover (which is still bubbling up the
    // DOM toward document) doesn't immediately trigger close. Without this
    // guard, auto-opened value menus (after "Add filter → Major") closed
    // instantly because the original click reached document AFTER our
    // listener attached, clearly outside the just-mounted popover ref.
    let attached = false;
    const id = requestAnimationFrame(() => {
      document.addEventListener('click', onClick);
      document.addEventListener('keydown', onKey);
      attached = true;
    });
    return () => {
      cancelAnimationFrame(id);
      if (attached) {
        document.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKey);
      }
    };
  }, [open, onClose]);
  return ref;
}

/* -------------------------------------------------------------------------- */
/*                               Operator menu                                 */
/* -------------------------------------------------------------------------- */
function OperatorMenu({
  value,
  options,
  onChange,
}: {
  value: FilterOperator;
  options: FilterOperator[];
  onChange: (v: FilterOperator) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));
  return (
    <div ref={ref} className="brothers-filter-pill__segment brothers-filter-pill__segment--menu">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="brothers-filter-pill__seg-btn"
      >
        {value}
      </button>
      {open && (
        // A plain list of buttons, announced as a disclosure. It was marked
        // role="listbox" without role="option" children, arrow-key handling
        // or aria-activedescendant, which only lied to assistive tech.
        <ul className="brothers-filter-menu brothers-filter-menu--narrow">
          {options.map((op) => (
            <li key={op}>
              <button
                type="button"
                onClick={() => {
                  onChange(op);
                  setOpen(false);
                }}
                aria-pressed={op === value}
                className={`brothers-filter-menu__option ${op === value ? 'is-selected' : ''}`}
              >
                <span>{op}</span>
                {op === value && <Check className="size-3.5" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Value picker menu                              */
/* -------------------------------------------------------------------------- */
function ValueMenu({
  selected,
  options,
  onChange,
  triggerLabel,
  initialOpen = false,
}: {
  selected: string[];
  options: Array<{ value: string; label: string }>;
  onChange: (next: string[]) => void;
  triggerLabel: string;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));

  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };

  return (
    <div ref={ref} className="brothers-filter-pill__segment brothers-filter-pill__segment--values">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="brothers-filter-pill__seg-btn brothers-filter-pill__seg-btn--values"
      >
        {triggerLabel}
      </button>
      {open && (
        <div className="brothers-filter-menu brothers-filter-menu--wide">
          {/* Toggle buttons in a plain list, see the note in OperatorMenu. */}
          <ul className="brothers-filter-menu__list">
            {options.length === 0 && (
              <li className="brothers-filter-menu__empty">No options yet.</li>
            )}
            {options.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => toggle(opt.value)}
                    aria-pressed={isSelected}
                    className={`brothers-filter-menu__option ${isSelected ? 'is-selected' : ''}`}
                  >
                    <span className="brothers-filter-menu__check" aria-hidden="true">
                      {isSelected && <Check className="size-3.5" />}
                    </span>
                    <span>{opt.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Pill                                      */
/* -------------------------------------------------------------------------- */
function FilterPill({
  filter,
  options,
  onChange,
  onRemove,
  autoOpenValues = false,
}: {
  filter: BrotherFilter;
  options: Array<{ value: string; label: string }>;
  onChange: (next: BrotherFilter) => void;
  onRemove: () => void;
  autoOpenValues?: boolean;
}) {
  const operatorOptions = operatorsFor(filter.values);

  const labelFor = (val: string) => options.find((o) => o.value === val)?.label ?? val;
  const triggerLabel =
    filter.values.length === 0
      ? 'Select…'
      : filter.values.length === 1
        ? labelFor(filter.values[0] ?? '')
        : `${filter.values.length} selected`;

  return (
    <div
      className="brothers-filter-pill"
      role="group"
      aria-label={`${FILTER_LABELS[filter.type]} filter`}
    >
      <span className="brothers-filter-pill__segment brothers-filter-pill__segment--type">
        {FILTER_LABELS[filter.type]}
      </span>
      <OperatorMenu
        value={filter.operator}
        options={operatorOptions}
        onChange={(operator) => onChange({ ...filter, operator })}
      />
      <ValueMenu
        selected={filter.values}
        options={options}
        onChange={(values) => {
          const nextOperator: FilterOperator =
            values.length > 1 && filter.operator === 'is'
              ? 'is any of'
              : values.length <= 1 && filter.operator === 'is any of'
                ? 'is'
                : filter.operator;
          onChange({ ...filter, values, operator: nextOperator });
        }}
        triggerLabel={triggerLabel}
        initialOpen={autoOpenValues}
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${FILTER_LABELS[filter.type]} filter`}
        className="brothers-filter-pill__segment brothers-filter-pill__remove"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Add-filter dropdown                              */
/* -------------------------------------------------------------------------- */
function AddFilterMenu({
  available,
  onAdd,
}: {
  available: BrotherFilterType[];
  onAdd: (type: BrotherFilterType) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(open, () => setOpen(false));
  if (available.length === 0) return null;
  return (
    <div ref={ref} className="brothers-filter-add">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="brothers-filter-add__btn"
      >
        <Plus className="size-3.5" aria-hidden="true" />
        Add filter
        <ChevronDown className={`size-3.5 ${open ? 'is-open' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        // Plain list of buttons, see the note in OperatorMenu.
        <ul className="brothers-filter-menu brothers-filter-menu--narrow">
          {available.map((type) => (
            <li key={type}>
              <button
                type="button"
                onClick={() => {
                  onAdd(type);
                  setOpen(false);
                }}
                className="brothers-filter-menu__option"
              >
                {FILTER_LABELS[type]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main filter bar                                */
/* -------------------------------------------------------------------------- */
export interface BrotherFilterOptions {
  majors: string[];
  years: string[];
  memberClasses: string[];
}

export function BrothersFilterBar({
  filters,
  setFilters,
  options,
  hideAddFilter = false,
}: {
  filters: BrotherFilter[];
  setFilters: (next: BrotherFilter[]) => void;
  options: BrotherFilterOptions;
  /** Hide the "Add filter" dropdown, used when filtering is driven entirely
   *  by the visual filter drawer above the roster. The pills and Clear all
   *  button still render so users can see / remove active filters. */
  hideAddFilter?: boolean;
}) {
  // Track the most recently added filter id so the corresponding FilterPill's
  // value dropdown opens automatically, the user was getting confused that
  // adding a filter type didn't seem to "do anything" until they realized
  // they had to click the "Select…" segment.
  const [pendingPillId, setPendingPillId] = useState<string | null>(null);

  const allTypes: BrotherFilterType[] = ['tier', 'major', 'year', 'memberClass'];
  const used = new Set(filters.map((f) => f.type));
  const available = allTypes.filter((t) => !used.has(t));

  const optionsFor = (type: BrotherFilterType): Array<{ value: string; label: string }> => {
    if (type === 'tier') return TIER_OPTIONS;
    if (type === 'major') return options.majors.map((m) => ({ value: m, label: m }));
    if (type === 'year') return options.years.map((y) => ({ value: y, label: y }));
    return options.memberClasses.map((c) => ({ value: c, label: c }));
  };

  return (
    <div className="brothers-filter-bar">
      {filters.map((f) => (
        <FilterPill
          key={f.id}
          filter={f}
          options={optionsFor(f.type)}
          onChange={(next) => setFilters(filters.map((x) => (x.id === f.id ? next : x)))}
          onRemove={() => setFilters(filters.filter((x) => x.id !== f.id))}
          autoOpenValues={f.id === pendingPillId}
        />
      ))}
      {!hideAddFilter && (
        <AddFilterMenu
          available={available}
          onAdd={(type) => {
            const newId = `${type}-${Date.now()}`;
            setFilters([
              ...filters,
              {
                id: newId,
                type,
                operator: 'is',
                values: [],
              },
            ]);
            setPendingPillId(newId);
          }}
        />
      )}
      {filters.length > 0 && (
        <button type="button" onClick={() => setFilters([])} className="brothers-filter-clear">
          Clear all
        </button>
      )}
    </div>
  );
}
