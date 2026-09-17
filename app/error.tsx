'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-2 text-gray-600">Please try again.</p>
      <button
        onClick={reset}
        className="mt-6 bg-rose-600 text-white px-6 py-3 rounded-lg font-medium"
      >
        Try again
      </button>
    </div>
  );
}