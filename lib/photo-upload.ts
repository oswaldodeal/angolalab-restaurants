import 'server-only';

export async function photoUpload(form: FormData): Promise<string> {
  const file = form.get('photoFile');
  if (typeof file !== 'object' || !file || !file.size) return '';
  if (file.size > 250 * 1024) throw new Error('INVALID_PHOTO_UPLOAD');
  const bytes = Buffer.from(await file.arrayBuffer());
  const jpeg = file.type === 'image/jpeg' && bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]));
  const png = file.type === 'image/png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const webp = file.type === 'image/webp' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  if (!jpeg && !png && !webp) throw new Error('INVALID_PHOTO_UPLOAD');
  return `data:${file.type};base64,${bytes.toString('base64')}`;
}
