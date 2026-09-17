import Link from 'next/link';
import { PackageX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-shop py-20 text-center">
      <PackageX size={48} className="mx-auto text-rose-300" />
      <h1 className="mt-4 font-display text-2xl font-bold">Product not found</h1>
      <p className="mt-2 text-gray-500 text-sm">
        This product may have been removed or is no longer available.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex rounded-full bg-rose-600 px-6 py-3 text-white text-sm font-medium hover:bg-rose-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}