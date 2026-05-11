'use clent'
import React from 'react';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles
} from 'lucide-react';
import { Product, initialProducts, initialOrders, Order } from './data/initialData';

interface DashboardHomeProps {
  products: Product[];
  orders: Order[];
  language: 'en' | 'bn';
}

const HomePage: React.FC<DashboardHomeProps> = ({ language }) => {
  const products = initialProducts;
  const orders = initialOrders;
  const isBn = language === 'bn';

  const totalSales = orders.reduce((acc, order) => order.status !== 'Cancelled' ? acc + order.total : acc, 0);
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  const stats = [
    {
      title: isBn ? 'মোট বিক্রি' : 'Total Revenue',
      value: `৳ ${totalSales.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: isBn ? 'মোট পণ্য' : 'Total Products',
      value: totalProducts.toString(),
      change: '+4 new',
      icon: ShoppingBag,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      title: isBn ? 'মোট স্টক' : 'Inventory Items',
      value: totalStock.toString(),
      change: 'Healthy',
      icon: Package,
      color: 'from-amber-600 to-orange-600'
    },
    {
      title: isBn ? 'সফল অর্ডার' : 'Completed Orders',
      value: orders.filter(o => o.status === 'Delivered').length.toString(),
      change: '94% rate',
      icon: TrendingUp,
      color: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm border border-white/10 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isBn ? 'নেক্সট.জেএস অনুপ্রাণিত ই-কমার্স অ্যাডমিন' : 'Next.js Powered Admin Studio'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {isBn ? 'স্বাগতম, অ্যাডমিন প্যানেলে!' : 'Welcome back, Admin!'}
            </h1>
            <p className="mt-2 text-slate-400 text-sm md:text-base max-w-xl">
              {isBn ? 'আপনার দোকানের সব তথ্য, পণ্য, ক্যাটাগরি, ব্র্যান্ড, সাইজ এবং অর্ডার এখান থেকে এক ক্লিকে ম্যানেজ করুন।' : 'Monitor your store metrics, manage products, configure brands/categories, and control inventory in real-time.'}
            </p>
          </div>
          <div className="flex gap-3 self-start md:self-center">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider">{isBn ? 'মোট অর্ডার' : 'Total Orders'}</p>
              <p className="text-2xl font-bold mt-1">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
            <div className="space-y-3 z-10">
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-slate-200 z-10`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-slate-50 rounded-full opacity-50 z-0"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simple Analytics Chart Visual */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isBn ? 'বিক্রয়ের অগ্রগতি' : 'Revenue Growth & Activity'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn ? 'গত ৭ দিনের হিসেব' : 'Analytics for the last 7 days'}
              </p>
            </div>
            <span className="text-xs bg-slate-100 font-medium px-2.5 py-1 rounded-md text-slate-600 border border-slate-200">
              {isBn ? 'সাপ্তাহিক রিপোর্ট' : 'Weekly View'}
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-end min-h-[220px] relative">
            <div className="absolute inset-0 flex flex-col justify-between py-2">
              {[100, 75, 50, 25, 0].map((v) => (
                <div key={v} className="border-b border-dashed border-slate-100 w-full h-0 flex items-center">
                  <span className="text-[10px] text-slate-400 absolute -left-0 -mt-2 bg-white pr-2">{v}k</span>
                </div>
              ))}
            </div>
            {/* Bars */}
            <div className="flex items-end justify-between gap-2 h-[180px] px-8 z-10">
              {[35, 45, 30, 80, 60, 95, 70].map((height, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-1/12">
                  <div 
                    style={{ height: `${height}%` }} 
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:opacity-90 relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow pointer-events-none transition-all duration-200">
                      ৳{height * 100}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">
              {isBn ? 'সাম্প্রতিক অর্ডারসমূহ' : 'Recent Orders'}
            </h2>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/80">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{order.customer}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{order.id} • {order.items} items</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">৳ {order.total}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${
                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    order.status === 'Processing' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                    {order.status === 'Processing' && <Clock className="w-3 h-3" />}
                    {order.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;