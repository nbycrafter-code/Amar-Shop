"use client";
import { useState } from "react";
import { TopHeader } from "./components/TopHeader";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartDrawer } from "./components/CartDrawer";
import { WishlistModal } from "./components/WishlistModal";
import { CompareModal } from "./components/CompareModal";
import { useApp } from "./context/AppContext";
import { QuickViewModal } from "./components/QuickViewModal";
import AccountSidebar from "./components/AccountSidebar";
import { usePathname } from "next/navigation";
import { AccountBreadcrumb } from "./components/AccountBreadcrumb";
import { ScrollToTop } from "./components/ScrollToTop";
import { PurchaseToast } from "./components/PurchaseToast";

export default function LayoutSet({ children, session, settings, categories }) {
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    wishlist,
    removeFromWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    compareList,
    removeFromCompare,
    isCompareOpen,
    setIsCompareOpen,
    clearAllCompare,
    isQuickViewOpen,
    setIsQuickViewOpen,
    activeProduct,
  } = useApp();

  return (
    <>
      <TopHeader settings={settings} />
      <Header
        session={session}
        settings={settings}
        categories={categories}
        openCart={() => setDrawerOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistClick={() => setIsWishlistOpen(true)}
      />
      <Navbar
        categories={categories}
        openCart={() => setDrawerOpen(true)}
        wishlistCount={wishlist.length}
        onWishlistClick={() => setIsWishlistOpen(true)}
        compareCount={compareList.length}
        onCompareClick={() => setIsCompareOpen(true)}
      />
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main>
        {pathname.split("/").includes("my-account") ? (
          <>
            <AccountBreadcrumb />
            <section className="py-8 md:py-12">
              <div className="container mx-auto w-full px-4">
                <div className="flex flex-col md:flex-row md:gap-8 lg:gap-10">
                  <AccountSidebar user={session?.user} />
                  <main className="min-w-0 flex-1">
                    {children}
                  </main>
                </div>
              </div>
            </section>
          </>
        ) : (
          children
        )}
      </main>

      {isWishlistOpen && (
        <WishlistModal
          wishlist={wishlist}
          onClose={() => setIsWishlistOpen(false)}
          onRemove={removeFromWishlist}
        />
      )}

      {isCompareOpen && (
        <CompareModal
          compareList={compareList}
          onClose={() => setIsCompareOpen(false)}
          onRemove={removeFromCompare}
          clearAll={clearAllCompare}
        />
      )}

      {isQuickViewOpen && (
        <QuickViewModal
          onClose={() => setIsQuickViewOpen(false)}
          activeProduct={activeProduct}
        />
      )}
      <Footer settings={settings} />
      <ScrollToTop />
      <PurchaseToast />
    </>
  );
}
