import { NextRequest, NextResponse } from 'next/server';

const API_KEY = '070020312f7041e397753e58f2ea9dc6';
const HOST = 'velix-eg.store';
const INDEXNOW_URL = 'https://api.indexnow.org/indexnow';

async function submitUrls(urls: string[]) {
  try {
    const res = await fetch(INDEXNOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host: HOST, key: API_KEY, urlList: urls }),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

export async function POST(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_PASSWORD || 'velix@2026'}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { urls } = await request.json();
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: 'urls array required' }, { status: 400 });
  }

  const result = await submitUrls(urls.slice(0, 10000));
  return NextResponse.json(result);
}

export async function GET() {
  const urls = [
    `https://${HOST}/`,
    `https://${HOST}/products`,
    `https://${HOST}/blog`,
    `https://${HOST}/sitemap.xml`,
  ];
  const result = await submitUrls(urls);
  return NextResponse.json(result);
}
