'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, GripVertical, Trash2, Star } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { ProductImage } from '@/types';

export function ImageUploader({
  images,
  onChange,
}: {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragIdx = useRef<number | null>(null);

  const upload = async (files: FileList) => {
    setUploading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('images', f));

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const newImages: ProductImage[] = data.images.map((img: any, i: number) => ({
        url: img.url,
        thumbUrl: img.thumb,
        isMain: images.length === 0 && i === 0,
        order: images.length + i,
      }));

      onChange([...images, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const remove = (i: number) => {
    const next = images.filter((_, idx) => idx !== i);
    // if main was removed, promote first
    if (!next.some((n) => n.isMain) && next[0]) next[0].isMain = true;
    onChange(next.map((img, idx) => ({ ...img, order: idx })));
  };

  const setMain = (i: number) => {
    onChange(images.map((img, idx) => ({ ...img, isMain: idx === i })));
  };

  const handleDragStart = (i: number) => { dragIdx.current = i; };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (i: number) => {
    if (dragIdx.current === null || dragIdx.current === i) return;
    const next = [...images];
    const [moved] = next.splice(dragIdx.current, 1);
    next.splice(i, 0, moved);
    onChange(next.map((img, idx) => ({ ...img, order: idx })));
    dragIdx.current = null;
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => fileRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer transition',
          uploading ? 'border-rose-300 bg-rose-50' : 'border-gray-300 hover:border-rose-400 hover:bg-rose-50/40'
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin text-rose-600" size={22} />
            <p className="text-sm text-rose-700 mt-2 font-medium">Uploading…</p>
          </>
        ) : (
          <>
            <Upload className="text-gray-400" size={22} />
            <p className="text-sm text-gray-700 mt-2 font-medium">Click to upload images</p>
            <p className="text-xs text-gray-400 mt-0.5">
              JPG, PNG or WEBP · Max 5MB each
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(i)}
              className={cn(
                'group relative aspect-square rounded-lg overflow-hidden border-2 cursor-move',
                img.isMain ? 'border-rose-600' : 'border-gray-200'
              )}
            >
              <Image src={img.url} alt={`Upload ${i + 1}`} fill sizes="160px" className="object-cover" />

              {/* Drag handle */}
              <span className="absolute top-1 left-1 h-6 w-6 rounded bg-black/60 text-white flex items-center justify-center">
                <GripVertical size={12} />
              </span>

              {/* Main badge */}
              {img.isMain && (
                <span className="absolute top-1 right-1 h-6 px-2 rounded bg-rose-600 text-white text-[10px] font-bold flex items-center">
                  MAIN
                </span>
              )}

              {/* Hover actions */}
              <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5">
                {!img.isMain && (
                  <button
                    type="button"
                    onClick={() => setMain(i)}
                    className="h-7 w-7 rounded bg-white/90 text-gray-700 flex items-center justify-center hover:bg-white"
                    title="Set as main"
                  >
                    <Star size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="h-7 w-7 rounded bg-white/90 text-rose-600 flex items-center justify-center hover:bg-white ml-auto"
                  title="Remove"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}