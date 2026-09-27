export default function MenuItemRow({ item, onEdit, onDelete, onToggleAvailability, busy }) {
  return (
    <tr className="border-b border-teal-900/10 last:border-0">
      <td className="py-3 pr-3">
        <p className="font-display font-semibold text-teal-900">{item.name_en}</p>
        <p className="text-xs text-teal-800/60">{item.category_name_en}</p>
      </td>
      <td className="py-3 pr-3 font-semibold text-teal-900">₹{item.price}</td>
      <td className="py-3 pr-3">
        <button
          onClick={() => onToggleAvailability(item)}
          disabled={busy}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            item.is_available ? 'bg-lime-500/20 text-lime-600' : 'bg-papaya-500/20 text-papaya-600'
          }`}
        >
          {item.is_available ? 'Enabled' : 'Disabled'}
        </button>
      </td>
      <td className="py-3 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={() => onEdit(item)} className="btn-outline !px-3 !py-1 text-xs">
            Edit
          </button>
          <button
            onClick={() => onDelete(item)}
            className="rounded-full border-2 border-papaya-500 px-3 py-1 text-xs font-semibold text-papaya-600 hover:bg-papaya-500 hover:text-white"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
