import QRCode from 'qrcode';

export default async function RestaurantQrImage({ path }: { path: string }) {
  const host = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  const target = new URL(path, host ? `https://${host}` : 'http://localhost:3000');
  const src = await QRCode.toDataURL(target.href, { margin: 4, width: 360 });
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={120} height={120} className="h-auto w-full max-w-[120px]" />;
}
