-- lib/setup.sql
-- جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول تفاصيل الطلبات
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) REFERENCES orders(order_id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  selected_size VARCHAR(50),
  selected_color VARCHAR(100)
);

-- جدول التقييمات
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الإحصائيات
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_orders INTEGER DEFAULT 0,
  total_sales DECIMAL(12,2) DEFAULT 0,
  total_customers INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إدراج بيانات افتراضية لو الجدول فاضي
INSERT INTO analytics (id, total_orders, total_sales, total_customers, total_reviews, average_rating)
SELECT 1, 0, 0, 0, 0, 0
WHERE NOT EXISTS (SELECT 1 FROM analytics WHERE id = 1);

-- دالة لتحديث الإحصائيات تلقائياً
CREATE OR REPLACE FUNCTION update_analytics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE analytics SET
    total_orders = (SELECT COUNT(*) FROM orders),
    total_sales = (SELECT COALESCE(SUM(total_amount), 0) FROM orders),
    total_customers = (SELECT COUNT(DISTINCT customer_phone) FROM orders),
    total_reviews = (SELECT COUNT(*) FROM reviews),
    average_rating = (SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0) FROM reviews),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = 1;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers لتحديث الإحصائيات تلقائياً
DROP TRIGGER IF EXISTS update_analytics_on_order ON orders;
CREATE TRIGGER update_analytics_on_order
AFTER INSERT ON orders
FOR EACH STATEMENT
EXECUTE FUNCTION update_analytics();

DROP TRIGGER IF EXISTS update_analytics_on_review ON reviews;
CREATE TRIGGER update_analytics_on_review
AFTER INSERT ON reviews
FOR EACH STATEMENT
EXECUTE FUNCTION update_analytics();