export interface ImgBBResult {
  url: string;
  thumb: string;
  deleteUrl: string;
  width: number;
  height: number;
  size: number;
}

export async function uploadToImgBB(file: File): Promise<ImgBBResult> {
  const key = process.env.IMGBB_API_KEY;
  if (!key) throw new Error('IMGBB_API_KEY missing');

  const fd = new FormData();
  fd.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: 'POST',
    body: fd,
    cache: 'no-store',
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'ImgBB upload failed');

  return {
    url: data.data.display_url || data.data.url,
    thumb: data.data.thumb?.url || data.data.display_url,
    deleteUrl: data.data.delete_url,
    width: data.data.width,
    height: data.data.height,
    size: data.data.size,
  };
}

export async function uploadMany(files: File[]): Promise<ImgBBResult[]> {
  return Promise.all(files.map(uploadToImgBB));
}