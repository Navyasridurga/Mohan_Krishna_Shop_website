const { db } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/menu/categories - public
const getCategories = asyncHandler(async (req, res) => {
  const categories = db
    .prepare('SELECT * FROM menu_categories ORDER BY sort_order ASC')
    .all();
  res.json({ success: true, data: categories });
});

// GET /api/menu?category=juice&includeDisabled=true - public (includeDisabled is for admin UI)
const getMenuItems = asyncHandler(async (req, res) => {
  const { category, includeDisabled } = req.query;

  let sql = `
    SELECT mi.*, mc.slug AS category_slug, mc.name_en AS category_name_en, mc.name_te AS category_name_te
    FROM menu_items mi
    JOIN menu_categories mc ON mc.id = mi.category_id
  `;
  const clauses = [];
  const params = [];

  if (category) {
    clauses.push('mc.slug = ?');
    params.push(category);
  }
  if (includeDisabled !== 'true') {
    clauses.push('mi.is_available = 1');
  }
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  sql += ' ORDER BY mc.sort_order ASC, mi.sort_order ASC, mi.id ASC';

  const items = db.prepare(sql).all(...params);
  res.json({ success: true, data: items });
});

// GET /api/menu/:id - public
const getMenuItemById = asyncHandler(async (req, res, next) => {
  const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!item) return next(new ApiError(404, 'Menu item not found.'));
  res.json({ success: true, data: item });
});

// POST /api/menu - admin only
const createMenuItem = asyncHandler(async (req, res, next) => {
  const { category_id, name_en, name_te, description, price, image_url, is_veg, sort_order } = req.body;

  const category = db.prepare('SELECT id FROM menu_categories WHERE id = ?').get(category_id);
  if (!category) return next(new ApiError(422, 'Selected category does not exist.'));

  const result = db
    .prepare(
      `INSERT INTO menu_items (category_id, name_en, name_te, description, price, image_url, is_veg, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(category_id, name_en, name_te || null, description || null, price, image_url || null, is_veg ? 1 : 0, sort_order || 0);

  const created = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: created });
});

// PUT /api/menu/:id - admin only (full update: name, price, description, category, image, veg flag)
const updateMenuItem = asyncHandler(async (req, res, next) => {
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!existing) return next(new ApiError(404, 'Menu item not found.'));

  const fields = ['category_id', 'name_en', 'name_te', 'description', 'price', 'image_url', 'is_veg', 'sort_order'];
  const updates = {};
  for (const f of fields) {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  }

  if (Object.keys(updates).length === 0) {
    return next(new ApiError(422, 'No valid fields provided to update.'));
  }

  const setClause = Object.keys(updates).map((k) => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  db.prepare(`UPDATE menu_items SET ${setClause}, updated_at = datetime('now') WHERE id = ?`).run(
    ...values,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

// PATCH /api/menu/:id/availability - admin only (enable/disable toggle)
const setAvailability = asyncHandler(async (req, res, next) => {
  const { is_available } = req.body;
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!existing) return next(new ApiError(404, 'Menu item not found.'));

  db.prepare(`UPDATE menu_items SET is_available = ?, updated_at = datetime('now') WHERE id = ?`).run(
    is_available ? 1 : 0,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  res.json({ success: true, data: updated });
});

// DELETE /api/menu/:id - admin only
const deleteMenuItem = asyncHandler(async (req, res, next) => {
  const existing = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(req.params.id);
  if (!existing) return next(new ApiError(404, 'Menu item not found.'));

  db.prepare('DELETE FROM menu_items WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Menu item deleted.' });
});

module.exports = {
  getCategories,
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  setAvailability,
  deleteMenuItem,
};
