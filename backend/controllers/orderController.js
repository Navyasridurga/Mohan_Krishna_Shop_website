const { db } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// POST /api/orders - public (customer places an order from the menu page)
// Body: { customer_name, customer_phone, notes, items: [{ menu_item_id, quantity }] }
const createOrder = asyncHandler(async (req, res, next) => {
  const { customer_name, customer_phone, notes, items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return next(new ApiError(422, 'Order must contain at least one item.'));
  }

  // Snapshot current price/name for each item, and verify each item exists & is available
  const menuStmt = db.prepare('SELECT * FROM menu_items WHERE id = ? AND is_available = 1');
  const resolvedItems = [];
  let total = 0;

  for (const line of items) {
    const menuItem = menuStmt.get(line.menu_item_id);
    if (!menuItem) {
      return next(new ApiError(422, `Item with id ${line.menu_item_id} is not available.`));
    }
    const quantity = Number(line.quantity) || 0;
    if (quantity <= 0) {
      return next(new ApiError(422, `Invalid quantity for item "${menuItem.name_en}".`));
    }
    total += menuItem.price * quantity;
    resolvedItems.push({ menuItem, quantity });
  }

  const insertOrder = db.prepare(
    `INSERT INTO orders (customer_name, customer_phone, notes, total_amount) VALUES (?, ?, ?, ?)`
  );
  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity) VALUES (?, ?, ?, ?, ?)`
  );

  const runTransaction = db.transaction(() => {
    const result = insertOrder.run(customer_name, customer_phone, notes || null, total);
    const orderId = result.lastInsertRowid;
    for (const { menuItem, quantity } of resolvedItems) {
      insertItem.run(orderId, menuItem.id, menuItem.name_en, menuItem.price, quantity);
    }
    return orderId;
  });

  const orderId = runTransaction();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

  res.status(201).json({ success: true, data: { ...order, items: orderItems } });
});

// GET /api/orders - admin only, optional ?status=pending filter
const getOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM orders';
  const params = [];
  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';

  const orders = db.prepare(sql).all(...params);
  const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  const withItems = orders.map((o) => ({ ...o, items: itemsStmt.all(o.id) }));

  res.json({ success: true, data: withItems });
});

// GET /api/orders/:id - admin only
const getOrderById = asyncHandler(async (req, res, next) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return next(new ApiError(404, 'Order not found.'));
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
  res.json({ success: true, data: { ...order, items } });
});

const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

// PATCH /api/orders/:id/status - admin only
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return next(new ApiError(422, `Status must be one of: ${VALID_STATUSES.join(', ')}`));
  }

  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!existing) return next(new ApiError(404, 'Order not found.'));

  db.prepare(`UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(
    status,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus, VALID_STATUSES };
