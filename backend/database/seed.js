/**
 * One-time seed script.
 * Run with: npm run seed
 * Creates the admin account from .env (ADMIN_USERNAME / ADMIN_PASSWORD),
 * default categories, sample menu items and reviews - only if empty.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db, initSchema } = require('../config/db');

initSchema();

function seedAdmin() {
  const existing = db.prepare('SELECT id FROM admins WHERE username = ?').get(process.env.ADMIN_USERNAME || 'admin');
  if (existing) {
    console.log('Admin already exists, skipping.');
    return;
  }
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(username, hash);
  console.log(`Admin user created: ${username}`);
}

function seedCategories() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM menu_categories').get().c;
  if (count > 0) return;
  const insert = db.prepare(
    'INSERT INTO menu_categories (slug, name_en, name_te, sort_order) VALUES (?, ?, ?, ?)'
  );
  insert.run('juice', 'Fresh Juices', 'జ్యూస్‌లు', 1);
  insert.run('fruit', 'Fresh Fruit', 'పండ్లు', 2);
  insert.run('fried-rice', 'Fried Rice', 'ఫ్రైడ్ రైస్', 3);
  insert.run('fast-food', 'Fast Food', 'ఫాస్ట్ ఫుడ్', 4);
  console.log('Categories seeded.');
}

function seedMenuItems() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM menu_items').get().c;
  if (count > 0) return;
  const catId = (slug) => db.prepare('SELECT id FROM menu_categories WHERE slug = ?').get(slug).id;
  const insert = db.prepare(`
    INSERT INTO menu_items (category_id, name_en, name_te, description, price, image_url, is_available, is_veg, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
  `);

  const juice = catId('juice');
  insert.run(juice, 'Mosambi Juice', 'మోసంబి జ్యూస్', 'Freshly squeezed sweet lime, no added water', 40, '/images/mosambi.jpg', 1, 1);
  insert.run(juice, 'Pomegranate Juice', 'దానిమ్మ జ్యూస్', 'Rich, seedless pomegranate, chilled', 60, '/images/pomegranate.jpg', 1, 2);
  insert.run(juice, 'Watermelon Juice', 'పుచ్చకాయ జ్యూస్', 'Cooling summer favourite', 35, '/images/watermelon.jpg', 1, 3);
  insert.run(juice, 'Mixed Fruit Juice', 'మిక్స్డ్ ఫ్రూట్ జ్యూస్', 'A blend of seasonal fruits', 50, '/images/mixed-fruit.jpg', 1, 4);

  const fruit = catId('fruit');
  insert.run(fruit, 'Sliced Watermelon', 'పుచ్చకాయ ముక్కలు', 'Fresh cut, served chilled', 30, '/images/watermelon-slice.jpg', 1, 1);
  insert.run(fruit, 'Fruit Chaat', 'ఫ్రూట్ చాట్', 'Seasonal fruit mix with chaat masala', 45, '/images/fruit-chaat.jpg', 1, 2);

  const friedRice = catId('fried-rice');
  insert.run(friedRice, 'Veg Fried Rice', 'వెజ్ ఫ్రైడ్ రైస్', 'Wok-tossed rice with fresh vegetables', 90, '/images/veg-fried-rice.jpg', 1, 1);
  insert.run(friedRice, 'Egg Fried Rice', 'ఎగ్ ఫ్రైడ్ రైస్', 'Fried rice with scrambled egg', 110, '/images/egg-fried-rice.jpg', 0, 2);
  insert.run(friedRice, 'Chicken Fried Rice', 'చికెన్ ఫ్రైడ్ రైస్', 'Fried rice with tender chicken pieces', 140, '/images/chicken-fried-rice.jpg', 0, 3);

  const fastFood = catId('fast-food');
  insert.run(fastFood, 'Veg Manchurian', 'వెజ్ మంచూరియన్', 'Crispy vegetable balls in spicy sauce', 90, '/images/manchurian.jpg', 1, 1);
  insert.run(fastFood, 'Veg Noodles', 'వెజ్ నూడుల్స్', 'Stir-fried noodles with vegetables', 80, '/images/noodles.jpg', 1, 2);

  console.log('Menu items seeded.');
}

function seedReviews() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM reviews').get().c;
  if (count > 0) return;
  const insert = db.prepare(
    'INSERT INTO reviews (customer_name, rating, comment, is_published) VALUES (?, ?, ?, 1)'
  );
  insert.run('Ravi Teja', 5, 'Best mosambi juice near Ramachandrapuram, always fresh.');
  insert.run('Lakshmi', 5, 'Fried rice tastes homemade. My kids love it.');
  insert.run('Suresh', 4, 'Good quality fruit, fair prices, quick service.');
  console.log('Reviews seeded.');
}

seedAdmin();
seedCategories();
seedMenuItems();
seedReviews();

console.log('Seeding complete.');
