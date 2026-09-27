const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

const STATUS_COLORS = {
  pending: 'bg-mango-500/20 text-mango-600',
  confirmed: 'bg-lime-500/20 text-lime-600',
  preparing: 'bg-mango-500/20 text-mango-600',
  ready: 'bg-lime-500/20 text-lime-600',
  completed: 'bg-teal-900/10 text-teal-900',
  cancelled: 'bg-papaya-500/20 text-papaya-600',
};

export default function OrderCard({ order, onStatusChange, busy }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-teal-900">Order #{order.id}</p>
          <p className="text-sm text-teal-800/70">
            {order.customer_name} - {order.customer_phone}
          </p>
          <p className="text-xs text-teal-800/50">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
          {order.status}
        </span>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-teal-800/90">
        {order.items.map((it) => (
          <li key={it.id} className="flex justify-between">
            <span>
              {it.quantity} x {it.item_name}
            </span>
            <span>₹{it.unit_price * it.quantity}</span>
          </li>
        ))}
      </ul>

      {order.notes && <p className="mt-2 text-sm italic text-teal-800/60">Note: {order.notes}</p>}

      <div className="mt-3 flex items-center justify-between border-t border-teal-900/10 pt-3">
        <p className="font-display font-bold text-teal-900">Total: ₹{order.total_amount}</p>
        <select
          value={order.status}
          disabled={busy}
          onChange={(e) => onStatusChange(order, e.target.value)}
          className="rounded-xl border border-teal-900/20 px-2 py-1 text-sm capitalize"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
