'use client';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SearchBar({ mobile = false }: { mobile?: boolean }) {
  const [q, setQ] = useState('');
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form
      onSubmit={submit}
      className={
        mobile
          ? 'relative w-full'
          : 'relative hidden md:flex flex-1 max-w-xl'
      }
    >
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        type="search"
        placeholder="Search for skincare, makeup, haircare…"
        className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
      />
      {q && (
        <button
          type="button"
          onClick={() => setQ('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}