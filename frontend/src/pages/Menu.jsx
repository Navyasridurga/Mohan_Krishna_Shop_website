import { useEffect, useMemo, useState } from 'react';
import FoodCard from '../components/FoodCard';
import CategoryFilter from '../components/CategoryFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import WhatsAppButton from '../components/WhatsAppButton';
import { menuApi } from '../api/menuApi';
import { orderApi } from '../api/orderApi';

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [cart, setCart] = useState({}); // { [itemId]: quantity }
  const [customer, setCustomer] = useState({ name: '', phone: '', notes: '' });
  const [orderState, setOrderState] = useState({ submitting: false, error: null, success: null });

  function loadData() {
    setStatus('loading');
    Promise.all([menuApi.getCategories(), menuApi.getItems()])
      .then(([cats, menuItems]) => {
        setCategories(cats);
        setItems(menuItems);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter((i) => i.category_slug === activeCategory);
  }, [items, activeCategory]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const item = items.find((i) => String(i.id) === id);
          return item ? { ...item, quantity: qty } : null;
        })
        .filter(Boolean),
    [cart, items]
  );

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function addToCart(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function removeFromCart(id) {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) - 1) };
      return next;
    });
  }

  function whatsappOrderText() {
    const lines = cartItems.map((i) => `${i.quantity} x ${i.name_en} - ₹${i.price * i.quantity}`);
    return `Hi! I'd like to order:\n${lines.join('\n')}\nTotal: ₹${cartTotal}`;
  }

  async function submitOrder(e) {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setOrderState({ submitting: true, error: null, success: null });
    try {
      const payload = {
        customer_name: customer.name,
        customer_phone: customer.phone,
        notes: customer.notes,
        items: cartItems.map((i) => ({ menu_item_id: i.id, quantity: i.quantity })),
      };
      const order = await orderApi.placeOrder(payload);
      setOrderState({ submitting: false, error: null, success: order });
      setCart({});
    } catch (err) {
      setOrderState({ submitting: false, error: err.message || 'Could not place order.', success: null });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-teal-900 md:text-4xl">Our Menu</h1>
        <p className="mt-2 text-teal-800/80">Fresh juices, fruit, fried rice and fast food - pick what you like.</p>
      </div>

      {status === 'loading' && <LoadingSpinner label="Loading menu..." />}
      {status === 'error' && <ErrorMessage message="Could not load the menu right now." onRetry={loadData} />}

      {status === 'success' && (
        <>
          <div className="mt-8 flex justify-center">
            <CategoryFilter categories={categories} active={activeCategory} onChange={setActiveCategory} />
          </div>

          {filteredItems.length === 0 ? (
            <EmptyState title="No items in this category yet" subtitle="Please check back soon or try another category." />
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  quantity={cart[item.id] || 0}
                  onAdd={() => addToCart(item.id)}
                  onRemove={() => removeFromCart(item.id)}
                />
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-teal-900/10 bg-white/95 backdrop-blur">
              <div className="mx-auto max-w-6xl px-4 py-4">
                {orderState.success ? (
                  <div className="rounded-2xl bg-lime-500/20 p-4 text-center">
                    <p className="font-display font-semibold text-teal-900">
                      Order #{orderState.success.id} placed! We'll confirm shortly on the phone number you gave.
                    </p>
                    <button
                      className="btn-outline mt-3 !py-2 text-sm"
                      onClick={() => setOrderState({ submitting: false, error: null, success: null })}
                    >
                      Place another order
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitOrder} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                    <div>
                      <label className="text-xs font-semibold text-teal-900">Your name</label>
                      <input
                        required
                        value={customer.name}
                        onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
                        placeholder="e.g. Ravi"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-teal-900">Phone number</label>
                      <input
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
                        placeholder="10-digit number"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-teal-900">Notes (optional)</label>
                      <input
                        value={customer.notes}
                        onChange={(e) => setCustomer((c) => ({ ...c, notes: e.target.value }))}
                        className="mt-1 w-full rounded-xl border border-teal-900/20 px-3 py-2"
                        placeholder="Less sugar, extra spicy..."
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-display font-bold text-teal-900">
                        Total: ₹{cartTotal} <span className="text-xs font-normal text-teal-800/60">({cartItems.length} items)</span>
                      </p>
                      <div className="flex gap-2">
                        <button type="submit" disabled={orderState.submitting} className="btn-primary !py-2 text-sm">
                          {orderState.submitting ? 'Placing...' : 'Place Order'}
                        </button>
                        <WhatsAppButton message={whatsappOrderText()} className="btn-secondary !py-2 text-sm" />
                      </div>
                    </div>
                    {orderState.error && (
                      <p className="md:col-span-4 text-sm font-medium text-papaya-600">{orderState.error}</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
