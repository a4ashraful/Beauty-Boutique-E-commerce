import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-display font-bold text-rose-600">404</h1>
      <p className="mt-4 text-lg text-gray-600">Page not found</p>
      <Link
        href="/"
        className="mt-6 bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700"
      >
        Back to Home
      </Link>
    </div>
  );
}