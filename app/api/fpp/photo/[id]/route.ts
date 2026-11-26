import { accountsConfigured } from '@/lib/account-auth';
import { getPublishedFppPhoto } from '@/lib/fpp-community';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  if (!accountsConfigured() || !/^[a-f0-9-]{36}$/.test(id)) return new Response(null, { status: 404, headers });

  const photo = await getPublishedFppPhoto(id).catch(() => null);
  const value = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(photo ?? '');
  if (!value) return new Response(null, { status: 404, headers });
  return new Response(Uint8Array.from(Buffer.from(value[2], 'base64')), {
    headers: { ...headers, 'Content-Type': value[1] },
  });
}
