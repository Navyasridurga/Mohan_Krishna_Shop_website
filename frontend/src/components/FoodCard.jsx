export default function FoodCard({ item, quantity = 0, onAdd, onRemove }) {
  const unavailable = !item.is_available;

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-transform ${
        unavailable ? 'opacity-60' : 'hover:-translate-y-1'
      }`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-mango-100">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name_en}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">🍽️</div>
        )}
        {unavailable && (
          <span className="absolute right-3 top-3 rounded-full bg-teal-900/90 px-3 py-1 text-xs font-semibold text-cream">
            Sold out
          </span>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-teal-900">
          {item.is_veg ? '🟢 Veg' : '🔴 Non-Veg'}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-teal-900">{item.name_en}</h3>
          <span className="whitespace-nowrap font-display text-lg font-bold text-papaya-600">₹{item.price}</span>
        </div>
        {item.name_te && <p className="text-sm text-teal-800/70">{item.name_te}</p>}
        {item.description && <p className="mt-1 text-sm text-teal-800/80">{item.description}</p>}

        {onAdd && (
          <div className="mt-auto pt-3">
            {quantity > 0 ? (
              <div className="flex items-center justify-between rounded-full bg-teal-900 px-2 py-1">
                <button
                  onClick={onRemove}
                  className="h-8 w-8 rounded-full bg-cream/10 text-cream hover:bg-cream/20"
                  aria-label={`Remove one ${item.name_en}`}
                >
                  -
                </button>
                <span className="font-display font-semibold text-cream">{quantity}</span>
                <button
                  onClick={onAdd}
                  disabled={unavailable}
                  className="h-8 w-8 rounded-full bg-cream/10 text-cream hover:bg-cream/20 disabled:opacity-40"
                  aria-label={`Add one more ${item.name_en}`}
                >
                  +
                </button>
              </div>
            ) : (
              <button onClick={onAdd} disabled={unavailable} className="btn-secondary w-full !py-2 text-sm">
                {unavailable ? 'Unavailable' : 'Add to order'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
