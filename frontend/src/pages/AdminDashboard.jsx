import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { menuApi } from '../api/menuApi';
import { orderApi } from '../api/orderApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import MenuItemFormModal from '../components/admin/MenuItemFormModal';
import MenuItemRow from '../components/admin/MenuItemRow';
import OrderCard from '../components/admin/OrderCard';

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState('menu'); // 'menu' | 'orders'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-teal-900">Admin Dashboard</h1>
          <p className="text-sm text-teal-800/70">Signed in as {admin?.username}</p>
        </div>
        <button onClick={logout} className="btn-outline !py-2 text-sm">
          Log Out
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setTab('menu')}
          className={`rounded-full px-4 py-2 font-display text-sm font-semibold ${
            tab === 'menu' ? 'bg-teal-900 text-cream' : 'bg-mango-100 text-teal-900'
          }`}
        >
          Menu Items
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`rounded-full px-4 py-2 font-display text-sm font-semibold ${
            tab === 'orders' ? 'bg-teal-900 text-cream' : 'bg-mango-100 text-teal-900'
          }`}
        >
          Orders
        </button>
      </div>

      <div className="mt-6">{tab === 'menu' ? <MenuManager /> : <OrdersManager />}</div>
    </div>
  );
}

function MenuManager() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [modal, setModal] = useState(null); // null | 'add' | item object
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  function load() {
    setStatus('loading');
    Promise.all([menuApi.getCategories(), menuApi.getItems({ includeDisabled: true })])
      .then(([cats, menuItems]) => {
        setCategories(cats);
        setItems(menuItems);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(payload) {
    setSaving(true);
    setFormError(null);
    try {
      if (modal && modal !== 'add') {
        await menuApi.updateItem(modal.id, payload);
      } else {
        await menuApi.createItem(payload);
      }
      setModal(null);
      load();
    } catch (err) {
      setFormError(err.message || 'Could not save item.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(item) {
    setBusyId(item.id);
    try {
      await menuApi.setAvailability(item.id, item.is_available ? 0 : 1);
      load();
    } catch (err) {
      alert(err.message || 'Could not update availability.');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.name_en}"? This cannot be undone.`)) return;
    setBusyId(item.id);
    try {
      await menuApi.deleteItem(item.id);
      load();
    } catch (err) {
      alert(err.message || 'Could not delete item.');
    } finally {
      setBusyId(null);
    }
  }

  if (status === 'loading') return <LoadingSpinner label="Loading menu items..." />;
  if (status === 'error') return <ErrorMessage message="Could not load menu items." onRetry={load} />;

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={() => setModal('add')} className="btn-primary !py-2 text-sm">
          + Add Menu Item
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-3xl bg-white p-4 shadow-card">
        {items.length === 0 ? (
          <EmptyState title="No menu items yet" subtitle="Add your first item to get started." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-teal-900/10 text-xs uppercase tracking-wide text-teal-800/50">
                <th className="pb-2">Item</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  busy={busyId === item.id}
                  onEdit={setModal}
                  onDelete={handleDelete}
                  onToggleAvailability={handleToggle}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <MenuItemFormModal
          categories={categories}
          initialItem={modal === 'add' ? null : modal}
          onClose={() => {
            setModal(null);
            setFormError(null);
          }}
          onSave={handleSave}
          saving={saving}
          error={formError}
        />
      )}
    </div>
  );
}

function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading');
  const [filter, setFilter] = useState('');
  const [busyId, setBusyId] = useState(null);

  function load() {
    setStatus('loading');
    orderApi
      .getOrders(filter || undefined)
      .then((data) => {
        setOrders(data);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleStatusChange(order, status) {
    setBusyId(order.id);
    try {
      await orderApi.updateStatus(order.id, status);
      load();
    } catch (err) {
      alert(err.message || 'Could not update order status.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {['', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              filter === s ? 'bg-teal-900 text-cream' : 'bg-mango-100 text-teal-900'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {status === 'loading' && <LoadingSpinner label="Loading orders..." />}
        {status === 'error' && <ErrorMessage message="Could not load orders." onRetry={load} />}
        {status === 'success' && orders.length === 0 && (
          <EmptyState icon="🧾" title="No orders yet" subtitle="New orders from the menu page will show up here." />
        )}
        {status === 'success' && orders.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} onStatusChange={handleStatusChange} busy={busyId === o.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
