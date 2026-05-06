-- Diecast Muscat — Schema Migration 003: Row Level Security
-- All tables get RLS enabled. Policies follow least-privilege.

-- Helper: is current auth user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: get customer id for current auth user
CREATE OR REPLACE FUNCTION current_customer_id()
RETURNS UUID AS $$
  SELECT id FROM customers WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ===== CATEGORIES =====
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_select_all ON categories FOR SELECT USING (true);
CREATE POLICY categories_admin_write ON categories FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ===== PRODUCTS =====
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY products_select_all ON products FOR SELECT USING (true);
CREATE POLICY products_admin_insert ON products FOR INSERT TO authenticated WITH CHECK (is_admin());
CREATE POLICY products_admin_update ON products FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY products_admin_delete ON products FOR DELETE TO authenticated USING (is_admin());

-- ===== CUSTOMERS =====
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY customers_select_self ON customers FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_admin());
CREATE POLICY customers_insert_self ON customers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY customers_update_self ON customers FOR UPDATE TO authenticated USING (user_id = auth.uid() OR is_admin()) WITH CHECK (user_id = auth.uid() OR is_admin());

-- ===== ORDERS =====
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY orders_select_own ON orders FOR SELECT TO authenticated USING (customer_id = current_customer_id() OR is_admin());
CREATE POLICY orders_insert_own ON orders FOR INSERT TO authenticated WITH CHECK (customer_id = current_customer_id());
CREATE POLICY orders_admin_update ON orders FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ===== ORDER ITEMS =====
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY order_items_select_own ON order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.customer_id = current_customer_id() OR is_admin()))
);
CREATE POLICY order_items_insert_own ON order_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = current_customer_id())
);

-- ===== REVIEWS =====
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY reviews_select_all ON reviews FOR SELECT USING (true);
CREATE POLICY reviews_insert_own ON reviews FOR INSERT TO authenticated WITH CHECK (customer_id = current_customer_id());
CREATE POLICY reviews_update_own ON reviews FOR UPDATE TO authenticated USING (customer_id = current_customer_id()) WITH CHECK (customer_id = current_customer_id());
CREATE POLICY reviews_delete_own ON reviews FOR DELETE TO authenticated USING (customer_id = current_customer_id() OR is_admin());

-- ===== CART ITEMS =====
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY cart_items_select_own ON cart_items FOR SELECT TO authenticated USING (customer_id = current_customer_id());
CREATE POLICY cart_items_insert_own ON cart_items FOR INSERT TO authenticated WITH CHECK (customer_id = current_customer_id());
CREATE POLICY cart_items_update_own ON cart_items FOR UPDATE TO authenticated USING (customer_id = current_customer_id()) WITH CHECK (customer_id = current_customer_id());
CREATE POLICY cart_items_delete_own ON cart_items FOR DELETE TO authenticated USING (customer_id = current_customer_id());

-- ===== WISHLISTS =====
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY wishlists_select_own ON wishlists FOR SELECT TO authenticated USING (customer_id = current_customer_id());
CREATE POLICY wishlists_insert_own ON wishlists FOR INSERT TO authenticated WITH CHECK (customer_id = current_customer_id());
CREATE POLICY wishlists_delete_own ON wishlists FOR DELETE TO authenticated USING (customer_id = current_customer_id());

-- ===== ADMIN USERS =====
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY admin_users_select_self ON admin_users FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_admin());
-- Inserts/updates/deletes only via service role (no policy needed; absence blocks anon/authenticated)
