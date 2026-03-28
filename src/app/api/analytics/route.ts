// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const result = await sql`
      SELECT 
        total_orders,
        total_sales,
        total_customers
      FROM analytics WHERE id = 1
    `;
    
    if (result.rows.length === 0) {
      return NextResponse.json({
        totalOrders: 0,
        totalSales: 0,
        totalCustomers: 0,
      });
    }
    
    return NextResponse.json({
      totalOrders: result.rows[0].total_orders,
      totalSales: parseFloat(result.rows[0].total_sales),
      totalCustomers: result.rows[0].total_customers,
    });
    
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'فشل جلب الإحصائيات' }, { status: 500 });
  }
}