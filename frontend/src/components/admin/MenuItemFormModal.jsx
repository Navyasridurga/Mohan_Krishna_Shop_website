import { useState } from 'react';

const emptyForm = {
  category_id: '',
  name_en: '',
  name_te: '',
  description: '',
  price: '',
  image_url: '',
  is_veg: true,
};

export default function MenuItemFormModal({ categories, initialItem, onClose, onSave, saving, error }) {
  const [form, setForm] = useState(
    initialItem
      ? {
          category_id: initialItem.category_id,
          name_en: initialItem.name_en,
          name_te: initialItem.name_te || '',
          description: initialItem.description || '',
          price: initialItem.price,
          image_url: initialItem.image_url || '',
          is_veg: !!initialItem.is_veg,
        }
      : emptyForm
  );

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ ...form, category_id: Number(form.category_id), price: Number(form.price) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-900/60 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-teal-900">
            {initialItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button onClick={onClose} className="text-2xl text-teal-800/60 hover:text-teal-900" aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-sm font-semibold text-teal-900">Category</label>
            <select
              required
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-teal-900">Name (English)</label>
              <input
                required
                value={form.name_en}
                onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-teal-900">Name (Telugu)</label>
              <input
                value={form.name_te}
                onChange={(e) => setForm((f) => ({ ...f, name_te: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-teal-900">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-teal-900">Price (₹)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
              />
            </div>
            <div className="flex items-end gap-2 pb-2">
              <input
                id="is_veg"
                type="checkbox"
                checked={form.is_veg}
                onChange={(e) => setForm((f) => ({ ...f, is_veg: e.target.checked }))}
                className="h-4 w-4"
              />
              <label htmlFor="is_veg" className="text-sm font-semibold text-teal-900">
                Vegetarian
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-teal-900">Image URL</label>
            <input
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="/images/example.jpg"
              className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
            />
          </div>

          {error && <p className="text-sm font-medium text-papaya-600">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-outline !py-2 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary !py-2 text-sm">
              {saving ? 'Saving...' : 'Save Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
