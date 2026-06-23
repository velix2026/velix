import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function GET() {
  return runSetup();
}

export async function POST() {
  return runSetup();
}

async function runSetup() {
  try {
    const migration = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
        username VARCHAR(100),
        action VARCHAR(255) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2) DEFAULT 0,
        max_uses INTEGER DEFAULT 0,
        current_uses INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'نصائح',
        tags TEXT[] DEFAULT '{}',
        read_time VARCHAR(50) DEFAULT '5 دقايق',
        is_published BOOLEAN DEFAULT true,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS login_attempts (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
      CREATE INDEX IF NOT EXISTS idx_login_attempts_time ON login_attempts(attempted_at);
      CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
      CREATE INDEX IF NOT EXISTS idx_activity_log_time ON activity_log(created_at);
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
      CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at);
      CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
      -- Loyalty points
      CREATE TABLE IF NOT EXISTS loyalty_points (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(50) UNIQUE NOT NULL,
        points INT DEFAULT 0,
        total_earned INT DEFAULT 0,
        tier VARCHAR(20) DEFAULT 'bronze',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS loyalty_transactions (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(50) NOT NULL,
        points INT NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'spent')),
        reference_type VARCHAR(50),
        reference_id VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS loyalty_redemptions (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50) NOT NULL,
        points_used INT NOT NULL,
        discount_amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_loyalty_phone ON loyalty_points(phone);
      CREATE INDEX IF NOT EXISTS idx_loyalty_tx_phone ON loyalty_transactions(phone);
      CREATE INDEX IF NOT EXISTS idx_loyalty_tx_created ON loyalty_transactions(created_at);
      CREATE INDEX IF NOT EXISTS idx_loyalty_redemptions_order ON loyalty_redemptions(order_id);
      -- Product reviews
      CREATE TABLE IF NOT EXISTS product_reviews (
        id SERIAL PRIMARY KEY,
        product_slug VARCHAR(255) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(50),
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        body TEXT,
        is_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS review_images (
        id SERIAL PRIMARY KEY,
        review_id INTEGER REFERENCES product_reviews(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_slug, is_approved);
      CREATE INDEX IF NOT EXISTS idx_product_reviews_approved ON product_reviews(is_approved);
    `;
    await sql.query(migration);

    const adminPassword = process.env.ADMIN_PASSWORD || 'velix@2026';
    const adminHash = await bcrypt.hash(adminPassword, 10);

    // Orders & order_items tables
    await sql.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(255) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_alt_phone VARCHAR(50),
        customer_address TEXT NOT NULL,
        landmark VARCHAR(255),
        total_amount DECIMAL(10,2) NOT NULL,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Add missing columns if table already exists
    await sql.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_alt_phone VARCHAR(50)`);
    await sql.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS landmark VARCHAR(255)`);

    await sql.query(`
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
      CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY DEFAULT 1,
        total_orders INTEGER DEFAULT 0,
        total_sales DECIMAL(12,2) DEFAULT 0,
        total_customers INTEGER DEFAULT 0,
        total_reviews INTEGER DEFAULT 0,
        average_rating DECIMAL(3,2) DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO analytics (id, total_orders, total_sales, total_customers, total_reviews, average_rating)
      SELECT 1, 0, 0, 0, 0, 0
      WHERE NOT EXISTS (SELECT 1 FROM analytics WHERE id = 1);
    `);

    await sql.query(`
      INSERT INTO admin_users (username, password_hash, display_name, role)
      VALUES ('admin', $1, 'Admin', 'admin')
      ON CONFLICT (username) DO UPDATE SET password_hash = $1
    `, [adminHash]);

    return NextResponse.json({ success: true, message: 'Migration completed' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
