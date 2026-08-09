import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Optional: wire this up as a Supabase Database Webhook (posts table, INSERT/UPDATE/DELETE)
// so the public site revalidates instantly instead of waiting for the 60s ISR window.
// Webhook URL: https://your-domain.vercel.app/api/revalidate?secret=YOUR_REVALIDATE_SECRET
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const slug = body?.record?.slug;

  revalidatePath('/');
  if (slug) revalidatePath(`/post/${slug}`);
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
