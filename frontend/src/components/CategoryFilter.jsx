export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Menu categories">
      <button
        role="tab"
        aria-selected={active === 'all'}
        onClick={() => onChange('all')}
        className={`rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors ${
          active === 'all' ? 'bg-teal-900 text-cream' : 'bg-mango-100 text-teal-900 hover:bg-mango-500/40'
        }`}
      >
        All Items
      </button>
      {categories.map((c) => (
        <button
          key={c.slug}
          role="tab"
          aria-selected={active === c.slug}
          onClick={() => onChange(c.slug)}
          className={`rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors ${
            active === c.slug ? 'bg-teal-900 text-cream' : 'bg-mango-100 text-teal-900 hover:bg-mango-500/40'
          }`}
        >
          {c.name_en}
        </button>
      ))}
    </div>
  );
}
