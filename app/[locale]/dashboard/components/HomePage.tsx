'use client';
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
// import { Product, Order } from './data/initialData';
import { useLanguage } from '@/context/LanguageContext';


const HomePage = ({ products, orders }) => {
   const { language } = useLanguage(); // ✅ যোগ করুন

  // Calculate statistics based on the passed props
  const totalSales = orders.reduce((acc, order) => 
    order.orderStatus !== 'Cancelled' ? acc + order.total : acc, 0
  );
  
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);
  
  const completedOrders = orders.filter(order => order.orderStatus === 'Delivered').length;
  const totalOrders = orders.length;
  
  // Calculate completion rate
  const completionRate = totalOrders > 0 
    ? Math.round((completedOrders / totalOrders) * 100) 
    : 0;

  const stats = [
    {
      title: language === 'bn' ? 'মোট বিক্রি' : 'Total Revenue',
      value: `৳ ${totalSales.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: language === 'bn' ? 'মোট পণ্য' : 'Total Products',
      value: totalProducts.toString(),
      change: `+${products.filter(p => p.stock > 0).length} in stock`,
      icon: ShoppingBag,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      title: language === 'bn' ? 'মোট স্টক' : 'Inventory Items',
      value: totalStock.toString(),
      change: totalStock > 100 ? 'Healthy' : 'Low stock',
      icon: Package,
      color: 'from-amber-600 to-orange-600'
    },
    {
      title: language === 'bn' ? 'সফল অর্ডার' : 'Completed Orders',
      value: completedOrders.toString(),
      change: `${completionRate}% rate`,
      icon: TrendingUp,
      color: 'from-purple-600 to-pink-600'
    }
  ];

  // Get recent orders (last 5)
  const recentOrders = [...orders].slice(-5).reverse();

  // Weekly sales data (you can customize this based on actual order dates)
  const weeklyData = [35, 45, 30, 80, 60, 95, 70];
  const weekDays = language === 'bn' 
    ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium backdrop-blur-sm border border-white/10 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {language ? 'নেক্সট.জেএস অনুপ্রাণিত ই-কমার্স অ্যাডমিন' : 'Next.js Powered Admin Studio'}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {language ? 'স্বাগতম, অ্যাডমিন প্যানেলে!' : 'Welcome back, Admin!'}
            </h1>
            <p className="mt-2 text-slate-400 text-sm md:text-base max-w-xl">
              {language 
                ? 'আপনার দোকানের সব তথ্য, পণ্য, ক্যাটাগরি, ব্র্যান্ড, সাইজ এবং অর্ডার এখান থেকে এক ক্লিকে ম্যানেজ করুন।' 
                : 'Monitor your store metrics, manage products, configure brands/categories, and control inventory in real-time.'}
            </p>
          </div>
          <div className="flex gap-3 self-start md:self-center">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                {language ? 'মোট অর্ডার' : 'Total Orders'}
              </p>
              <p className="text-2xl font-bold mt-1">{totalOrders}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                {language ? 'সক্রিয় পণ্য' : 'Active Products'}
              </p>
              <p className="text-2xl font-bold mt-1">{products.filter(p => p.stock > 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
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
                {language ? 'বিক্রয়ের অগ্রগতি' : 'Revenue Growth & Activity'}
              </h2>
              <p className="text-xs text-slate-500">
                {language ? 'গত ৭ দিনের হিসেব' : 'Analytics for the last 7 days'}
              </p>
            </div>
            <span className="text-xs bg-slate-100 font-medium px-2.5 py-1 rounded-md text-slate-600 border border-slate-200">
              {language ? 'সাপ্তাহিক রিপোর্ট' : 'Weekly View'}
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
              {weeklyData.map((height, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-1/12">
                  <div 
                    style={{ height: `${height}%` }} 
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:opacity-90 relative cursor-pointer"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow pointer-events-none transition-all duration-200 whitespace-nowrap">
                      ৳{height * 100}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase">
                    {weekDays[i]}
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
              {language ? 'সাম্প্রতিক অর্ডারসমূহ' : 'Recent Orders'}
            </h2>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{order.customerName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {order.id} • {order.items.length} {language ? 'আইটেম' : 'items'}
                    </p>
                    {order.date && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="text-right ml-3">
                    <p className="text-sm font-bold text-slate-800">৳ {order.total.toLocaleString()}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${
                      order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                      order.orderStatus === 'Processing' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                      'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}>
                      {order.orderStatus === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                      {order.orderStatus === 'Processing' && <Clock className="w-3 h-3" />}
                      {order.orderStatus === 'Shipped' && <Package className="w-3 h-3" />}
                      {order.orderStatus === 'Cancelled' && <XCircle className="w-3 h-3" />}
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{language ? 'কোনো অর্ডার নেই' : 'No orders found'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;