'use client';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

export function SalesChart({
  data,
}: {
  data: { date: string; sales: number; orders: number }[];
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">Sales Overview</h3>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                fontSize: 12,
              }}
              formatter={(v: any) => [`৳${v}`, 'Sales']}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#e11d48"
              strokeWidth={2}
              fill="url(#salesGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}