"use client";

import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderTree, 
  Award, 
  Ruler, 
  Globe, 
  X,
  Store,
  LogOut,
  ListOrdered,
  Sliders,
  PanelTopDashed,
} from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from '../context/AppContext';
import { signOut } from 'next-auth/react';
import { useSettings } from '../context/SettingsContext';

export const Sidebar = ({ user, mobileMenuOpen, setMobileMenuOpen }) => {
    const { settings, loading } = useSettings();
    const pathname = usePathname();

    const { language, setLanguage, isBn } = useApp();

    const menuItems = [
      { url: 'dashboard', name: isBn ? 'ড্যাশবোর্ড' : 'Dashboard', icon: LayoutDashboard },
      { url: 'products', name: isBn ? 'পণ্য (Products)' : 'Products', icon: ShoppingBag },
      { url: 'categories', name: isBn ? 'ক্যাটাগরি' : 'Categories', icon: FolderTree },
      { url: 'brands', name: isBn ? 'ব্র্যান্ড' : 'Brands', icon: Award },
      { url: 'sizes-colors', name: isBn ? 'সাইজ ও রঙ' : 'Sizes & Colors', icon: Ruler },
      { url: 'orders', name: isBn ? 'অর্ডার' : 'Orders', icon: ListOrdered },
      { url: 'banners', name: isBn ? 'ব্যানার' : 'Banner', icon: Sliders },
      { url: 'pages', name: isBn ? 'পৃষ্ঠাগুলি' : 'Pages', icon: PanelTopDashed },
      { url: 'settings', name: isBn ? 'সেটিংস' : 'Settings', icon: Ruler },
    ];

    const handleLogout = () => {
      signOut({ callbackUrl: '/admin/login' });
    }
    

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-lg text-white">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">BD Store Admin</h2>
            <span className="text-[10px] text-slate-400">Next.js Inspired</span>
          </div>
        </div>

        <button
          className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Badge / Context */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold truncate">
              {user.name || "Store Administrator"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === `/${item.url === 'dashboard' ? item.url : `dashboard/${item.url}`}`;
          
          return (
            <Link
              href={`/${item.url === 'dashboard' ? item.url : `dashboard/${item.url}`}`}
              key={item.url}
              onClick={() => {
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
              />
              {item.name}
            </Link>
          );
        })}
        <Link
              href="#"
              onClick={() => {
                handleLogout();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-slate-400 hover:bg-white/5 hover:text-slate-200`}
            >
              <LogOut
                className={`w-4 h-4 text-slate-400`}
              />
              Logout
            </Link>
      </nav>

      {/* Sidebar Footer / Language Selector */}
      <div className="p-4 border-t border-white/10 bg-slate-950/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Globe className="w-3.5 h-3.5" />
            <span>Language / ভাষা</span>
          </div>
          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
            {language.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
          <button
            onClick={() => setLanguage("en")}
            className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
              language === "en"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-400"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("bn")}
            className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
              language === "bn"
                ? "bg-white text-slate-900 shadow"
                : "text-slate-400"
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>
    </aside>
  );
};
