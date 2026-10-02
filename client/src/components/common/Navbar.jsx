import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  Package,
  LogOut,
  Building2
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { SearchModal } from './SearchModal';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const { totalItemCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAccountDropdownOpen(false);
    setIsCategoriesDropdownOpen(false);
  }, [location.pathname]);

  const categories = [
    { name: 'All Categories', path: '/shop' },
    { name: 'Fruit Products', path: '/category/fruit-powders' },
    { name: 'Vegetable Products', path: '/category/vegetable-powders' },
    { name: 'Leafy Products', path: '/category/leafy-powders' },
    { name: 'Wellness Products', path: '/category/wellness-powders' },
    { name: 'Popular Combos', path: '/category/popular-combos' }
  ];

  const navLinkClass = ({ isActive }) =>
    `relative text-sm tracking-wide font-medium transition-colors py-1 ${
      isActive
        ? 'text-forest-800 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-forest-600'
        : 'text-stone-700 hover:text-forest-800'
    }`;

  return (
    <>
      <AnnouncementBar />
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-soft py-3 border-b border-cream-200'
            : 'bg-cream-50/95 backdrop-blur-sm py-4 border-b border-cream-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-forest-900 hover:text-forest-700 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="VRUKSHA Farm To Home"
                className="w-10 h-10 rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-forest-950 group-hover:text-forest-800 transition-colors">
                  VRUKSHA
                </span>
                <span className="text-[10px] tracking-widest uppercase font-medium text-forest-600 -mt-1 hidden sm:block">
                  Farm To Home
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/shop" className={navLinkClass}>
                Shop
              </NavLink>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm tracking-wide font-medium text-stone-700 hover:text-forest-800 py-1 transition-colors"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
                </button>

                {isCategoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-56 pt-2 z-50">
                    <div className="bg-white rounded-xl shadow-elevated border border-cream-200 py-2 overflow-hidden">
                      {categories.map((cat) => (
                        <Link
                          key={cat.path}
                          to={cat.path}
                          className="block px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-cream-100 hover:text-forest-900 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/bulk-orders" className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  <span>Bulk Orders</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    B2B
                  </span>
                </span>
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </nav>

            {/* Right Icons: Search, Account, Wishlist, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-stone-700 hover:text-forest-800 hover:bg-cream-200/50 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/account?tab=wishlist"
                className="p-2 text-stone-700 hover:text-forest-800 hover:bg-cream-200/50 rounded-full relative transition-colors hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsAccountDropdownOpen(true)}
                onMouseLeave={() => setIsAccountDropdownOpen(false)}
              >
                <Link
                  to={isAuthenticated ? '/account' : '/login'}
                  className="p-2 text-stone-700 hover:text-forest-800 hover:bg-cream-200/50 rounded-full flex items-center gap-1 transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                  {isAuthenticated && (
                    <span className="text-xs font-semibold text-forest-800 max-w-[80px] truncate hidden md:inline">
                      {user?.name?.split(' ')[0]}
                    </span>
                  )}
                </Link>

                {isAccountDropdownOpen && (
                  <div className="absolute right-0 top-full w-52 pt-2 z-50">
                    <div className="bg-white rounded-xl shadow-elevated border border-cream-200 py-2">
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-2 border-b border-cream-100">
                            <p className="text-xs font-bold text-forest-950">{user?.name}</p>
                            <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                          </div>
                          <Link
                            to="/account"
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-cream-100 hover:text-forest-900"
                          >
                            <User className="w-3.5 h-3.5 text-forest-600" />
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-cream-100 hover:text-forest-900"
                          >
                            <Package className="w-3.5 h-3.5 text-forest-600" />
                            My Orders
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
                              Admin Dashboard
                            </Link>
                          )}
                          <div className="border-t border-cream-100 my-1" />
                          <button
                            type="button"
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 text-left"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-xs font-semibold text-forest-800 hover:bg-cream-100"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/register"
                            className="block px-4 py-2 text-xs font-medium text-stone-600 hover:bg-cream-100"
                          >
                            Create an Account
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button
                type="button"
                onClick={openDrawer}
                className="p-2 sm:px-3 sm:py-2 text-forest-900 bg-forest-100/70 hover:bg-forest-100 rounded-full sm:rounded-xl flex items-center gap-2 transition-all"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-forest-800" />
                  {totalItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-forest-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {totalItemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-forest-900 hidden sm:inline">
                  Cart
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-cream-200 bg-white shadow-xl animate-in slide-in-from-top-4 duration-200">
            <div className="px-4 pt-3 pb-6 space-y-3">
              <NavLink
                to="/"
                className="block px-3 py-2 rounded-lg text-base font-medium text-forest-950 hover:bg-cream-100"
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className="block px-3 py-2 rounded-lg text-base font-medium text-forest-950 hover:bg-cream-100"
              >
                Shop All Products
              </NavLink>

              <div className="pl-3 border-l-2 border-forest-200 space-y-2 py-1 my-1">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-600">Categories</span>
                {categories.slice(1).map((c) => (
                  <Link
                    key={c.path}
                    to={c.path}
                    className="block text-sm text-stone-700 hover:text-forest-800 py-1"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>

              <NavLink
                to="/bulk-orders"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-forest-950 hover:bg-cream-100"
              >
                <span>Bulk Orders</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">B2B</span>
              </NavLink>
              <NavLink
                to="/about"
                className="block px-3 py-2 rounded-lg text-base font-medium text-forest-950 hover:bg-cream-100"
              >
                About Our Journey
              </NavLink>
              <NavLink
                to="/contact"
                className="block px-3 py-2 rounded-lg text-base font-medium text-forest-950 hover:bg-cream-100"
              >
                Contact & Support
              </NavLink>

              <div className="border-t border-cream-200 pt-3 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/account"
                      className="px-3 py-2 text-sm font-semibold text-forest-900 bg-cream-100 rounded-lg flex items-center justify-between"
                    >
                      <span>Signed in as {user?.name}</span>
                      <User className="w-4 h-4 text-forest-700" />
                    </Link>
                    <Link to="/orders" className="px-3 py-1.5 text-sm text-stone-700">
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="px-3 py-1.5 text-sm font-bold text-emerald-800">
                        Admin Dashboard →
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="px-3 py-1.5 text-sm text-rose-700 text-left"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      to="/login"
                      className="py-2.5 text-center text-sm font-semibold text-forest-900 bg-cream-200 rounded-lg"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="py-2.5 text-center text-sm font-semibold text-white bg-forest-800 rounded-lg"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
