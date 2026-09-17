'use client';
import { useEffect, useState } from 'react';
import {
  ShoppingCart, Package, Users, TrendingUp, Clock, CheckCircle2, XCircle,
  AlertTriangle, PackageX, DollarSign, Calendar, Star, Eye,
} from 'lucide-react';
import { collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { StatCard } from '@/components/admin/StatCard';
import { SalesChart } from '@/components/admin/SalesChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { formatBDT } from '@/lib/utils';
import type { Order, Product } from '@/types';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0, todayOrders: 0, pending: 0, completed: 0, cancelled: 0,
    totalSales: 0, todaySales: 0,
    totalProducts: 0, lowStock: 0, outOfStock: 0,
    totalCustomers: 0,
    totalViews: 0,
  });
  const [recent, setRecent] = useState<Order[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'users')),
        ]);

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        let totalSales = 0, todaySales = 0, todayOrders = 0;
        let pending = 0, completed = 0, cancelled = 0;

        const orders: Order[] = ordersSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

        orders.forEach((o) => {
          const created = o.createdAt?.seconds
            ? o.createdAt.seconds * 1000
            : o.createdAt?.toMillis?.() || 0;
          totalSales += o.total || 0;
          if (created >= todayStart) {
            todaySales += o.total || 0;
            todayOrders += 1;
          }
          if (o.status === 'pending') pending++;
          if (o.status === 'delivered') completed++;
          if (o.status === 'cancelled') cancelled++;
        });

        let lowStock = 0, outOfStock = 0, totalViews = 0;
        const products: Product[] = productsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        products.forEach((p) => {
          if ((p.stock ?? 0) === 0) outOfStock++;
          else if ((p.stock ?? 0) <= 5) lowStock++;
          totalViews += p.viewCount || 0;
        });

        // best sellers
        const top = [...products]
          .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
          .slice(0, 5);

        // recent orders
        const sortedOrders = [...orders]
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
          .slice(0, 8);

        // 7-day sales chart
        const days: any[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          d.setHours(0, 0, 0, 0);
          const end = d.getTime() + 24 * 60 * 60 * 1000;
          const start = d.getTime();
          const dayOrders = orders.filter((o) => {
            const t = o.createdAt?.seconds ? o.createdAt.seconds * 1000 : 0;
            return t >= start && t < end;
          });
          const sales = dayOrders.reduce((s, o) => s + (o.total || 0), 0);
          days.push({
            date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            sales,
            orders: dayOrders.length,
          });
        }

        setStats({
          totalOrders: orders.length,
          todayOrders,
          pending,
          completed,
          cancelled,
          totalSales,
          todaySales,
          totalProducts: products.length,
          lowStock,
          outOfStock,
          totalCustomers: usersSnap.size,
          totalViews,
        });

        setRecent(sortedOrders);
        setBestSellers(top);
        setChartData(days);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your store</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard label="Total Orders"     value={stats.totalOrders}     icon={ShoppingCart}  color="blue" />
        <StatCard label="Today's Orders"   value={stats.todayOrders}     icon={Calendar}      color="indigo" />
        <StatCard label="Pending"          value={stats.pending}         icon={Clock}         color="yellow" />
        <StatCard label="Completed"        value={stats.completed}       icon={CheckCircle2}  color="green" />
        <StatCard label="Cancelled"        value={stats.cancelled}       icon={XCircle}       color="gray" />
        <StatCard label="Total Sales"      value={formatBDT(stats.totalSales)} icon={DollarSign} color="rose" />
        <StatCard label="Today's Sales"    value={formatBDT(stats.todaySales)} icon={TrendingUp} color="teal" />
        <StatCard label="Total Products"   value={stats.totalProducts}   icon={Package}       color="purple" />
        <StatCard label="Low Stock"        value={stats.lowStock}        icon={AlertTriangle} color="orange" hint="≤ 5 units" />
        <StatCard label="Out of Stock"     value={stats.outOfStock}      icon={PackageX}      color="gray" />
        <StatCard label="Total Customers"  value={stats.totalCustomers}  icon={Users}         color="pink" />
        <StatCard label="Product Views"    value={stats.totalViews}      icon={Eye}           color="indigo" />
      </div>

      {/* Charts + Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SalesChart data={chartData} />
        </div>

        <div className="rounded-xl border bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star size={16} className="text-yellow-500" />
            <h3 className="font-semibold">Best Sellers</h3>
          </div>
          {bestSellers.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No data yet.</p>
          ) : (
            <ul className="space-y-3">
              {bestSellers.map((p, idx) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="h-6 w-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.soldCount || 0} sold</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recent} />
    </div>
  );
}
