import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { totalItems, setIsDrawerOpen } = useCart();
  const { wishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Hide on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-200/90 shadow-lg px-2 py-1.5 transition-all">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
              isActive ? 'text-forest-800' : 'text-stone-500 hover:text-forest-700'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
              isActive ? 'text-forest-800' : 'text-stone-500 hover:text-forest-700'
            }`
          }
        >
          <ShoppingBag className="w-5 h-5 mb-0.5" />
          <span>Shop</span>
        </NavLink>

        {/* Cart Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold text-stone-500 hover:text-forest-700 transition"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 mb-0.5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-forest-800 text-amber-300 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {totalItems}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        <NavLink
          to="/account?tab=wishlist"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
              isActive && location.search.includes('wishlist') ? 'text-forest-800' : 'text-stone-500 hover:text-forest-700'
            }`
          }
        >
          <div className="relative">
            <Heart className="w-5 h-5 mb-0.5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {wishlist.length}
              </span>
            )}
          </div>
          <span>Wishlist</span>
        </NavLink>

        <NavLink
          to={isAuthenticated ? '/account' : '/login'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-bold transition ${
              isActive ? 'text-forest-800' : 'text-stone-500 hover:text-forest-700'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>{isAuthenticated ? 'Account' : 'Sign In'}</span>
        </NavLink>
      </div>
    </div>
  );
};
