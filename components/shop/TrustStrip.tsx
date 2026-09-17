export function TrustStrip() {
  const items = [
    'FREE DELIVERY OVER ৳1500',
    '100% AUTHENTIC PRODUCTS',
    'CASH ON DELIVERY',
    '7-DAY EASY RETURNS',
    'NATIONWIDE SHIPPING',
    'EXPERT BEAUTY SUPPORT',
  ];
  const line = [...items, ...items];

  return (
    <div className="bg-gray-900 text-white overflow-hidden">
      <div className="container-shop py-3">
        <div className="flex gap-8 animate-[marquee_28s_linear_infinite] whitespace-nowrap">
          {line.map((t, i) => (
            <span key={i} className="text-[11px] tracking-[0.18em] font-medium">
              ★ {t}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}