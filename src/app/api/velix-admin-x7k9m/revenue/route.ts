import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { checkAdminAuth } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!await checkAdminAuth(request)) return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  try {
    const daily = await sql`
      SELECT DATE(created_at) as date, COUNT(*) as orders_count, COALESCE(SUM(total_amount::float), 0) as revenue
      FROM orders WHERE status = 'delivered'
      GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30
    `;

    const summary = await sql`
      SELECT
        COUNT(*)::int as total_orders,
        COALESCE(SUM(CASE WHEN status = 'delivered' THEN total_amount::float END), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN status = 'delivered' THEN total_amount::float END), 0) as avg_order_value,
        COUNT(*) FILTER (WHERE status = 'delivered')::int as delivered_count,
        COUNT(*) FILTER (WHERE status = 'cancelled')::int as cancelled_count,
        COUNT(*) FILTER (WHERE status = 'pending')::int as pending_count
      FROM orders
    `;

    const categoryRevenue = await sql`
      SELECT oi.product_name, SUM(oi.price * oi.quantity) as total, COUNT(*) as sold
      FROM order_items oi JOIN orders o ON oi.order_id = o.order_id
      WHERE o.status = 'delivered'
      GROUP BY oi.product_name ORDER BY total DESC LIMIT 10
    `;

    return NextResponse.json({
      daily: daily.rows.map(r => ({ date: r.date, orders: parseInt(r.orders_count) || 0, revenue: parseFloat(r.revenue) || 0 })),
      summary: {
        totalOrders: parseInt(summary.rows[0].total_orders) || 0,
        totalRevenue: parseFloat(summary.rows[0].total_revenue) || 0,
        avgOrderValue: parseFloat(summary.rows[0].avg_order_value) || 0,
        deliveredCount: parseInt(summary.rows[0].delivered_count) || 0,
        cancelledCount: parseInt(summary.rows[0].cancelled_count) || 0,
        pendingCount: parseInt(summary.rows[0].pending_count) || 0,
      },
      topProducts: categoryRevenue.rows.map(r => ({ name: r.product_name, total: parseFloat(r.total) || 0, sold: parseInt(r.sold) || 0 })),
    });
  } catch (error) {
    console.error('Revenue API error:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
