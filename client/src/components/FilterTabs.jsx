import { motion } from 'framer-motion';

/** Category filter tabs with a sliding active pill. `id` must be unique per instance on a page. */
export default function FilterTabs({ id, tabs, value, onChange, counts }) {
  return (
    <div className="tabs" role="tablist" aria-label="Filter">
      {tabs.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={active}
            className={`tabs__btn ${active ? 'is-active' : ''}`}
            onClick={() => onChange(t)}
            data-cursor="hover"
          >
            {active && <motion.span layoutId={`pill-${id}`} className="tabs__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className="tabs__label">
              {t}
              {counts && counts[t] !== undefined && <sup>{counts[t]}</sup>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
