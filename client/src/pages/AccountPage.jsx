import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  MailCheck,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, formatDate } from '../utils/formatters';
import { api } from '../api/client';
import { EmptyState } from '../components/common/EmptyState';

export const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { user, logout, updateProfile, isAdmin } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Edit Profile Form
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // New Address State
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    house: '',
    street: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
    isDefault: false
  });

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Delete Account State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const { addToast } = useToast();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('Please enter your current password', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      if (res.success) {
        addToast('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to update password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput.trim() !== 'DELETE') {
      addToast('Please type "DELETE" to confirm account deletion', 'error');
      return;
    }

    setIsDeletingAccount(true);
    try {
      const res = await api.delete('/auth/delete-account');
      if (res.success) {
        addToast('Your account has been deleted.', 'info');
        logout();
        navigate('/');
      }
    } catch (err) {
      addToast(err.data?.message || err.message || 'Failed to delete account', 'error');
      setIsDeletingAccount(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab'));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      setProfileName('');
      setProfilePhone('');
      setAddresses([]);
      setOrders([]);
      navigate('/login', { replace: true });
    } else {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setAddresses(user.addresses || []);
    }
  }, [user, navigate]);

  const handleSignOut = () => {
    logout();
    setOrders([]);
    setWishlistProducts([]);
    setProfileName('');
    setProfilePhone('');
    setAddresses([]);
    navigate('/login', { replace: true });
  };

  // Load User Orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await api.get('/orders/myorders');
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  // Load Wishlist Products
  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (wishlist.length === 0) {
        setWishlistProducts([]);
        return;
      }
      try {
        const data = await api.get('/products');
        if (data.success) {
          const items = (data.products || []).filter((p) => wishlist.includes(p.slug));
          setWishlistProducts(items);
        }
      } catch (err) {
        console.error('Failed to load wishlist products', err);
      }
    };
    fetchWishlistItems();
  }, [wishlist]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfile({ name: profileName, phone: profilePhone });
    setIsUpdating(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const updated = [...addresses, { ...newAddr, id: `addr-${Date.now()}` }];
    setAddresses(updated);
    await updateProfile({ addresses: updated });
    setShowAddAddress(false);
    setNewAddr({ fullName: '', phone: '', house: '', street: '', city: '', state: 'Karnataka', pincode: '', isDefault: false });
  };

  return (
    <div className="bg-cream-50/50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-3xl border border-cream-200 p-4 sm:p-8 shadow-soft mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-forest-800 text-cream-50 font-serif font-bold text-2xl flex items-center justify-center shadow-md">
              {user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2) || 'PH'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-forest-950">
                  {user?.name || 'Valued Customer'}
                </h1>
                {isAdmin && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-xs text-stone-500">{user?.email}</p>
                {user?.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Account</span>
                  </span>
                ) : (
                  <Link
                    to="/verify-email"
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition"
                  >
                    <MailCheck className="w-3 h-3" />
                    <span>Unverified — Verify Email</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2.5 rounded-xl bg-forest-900 text-cream-50 text-xs font-bold uppercase tracking-wider hover:bg-forest-800 transition-colors"
            >
              Open Admin Portal →
            </Link>
          )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-cream-200 p-2 sm:p-4 shadow-soft flex overflow-x-auto lg:flex-col gap-1.5 lg:space-y-1 no-scrollbar">
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
              { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
              { id: 'wishlist', label: `My Wishlist (${wishlist.length})`, icon: Heart },
              { id: 'settings', label: 'Security & Password', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`flex-shrink-0 lg:w-full flex items-center justify-between p-2.5 sm:p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-left whitespace-nowrap min-h-[44px] ${
                    activeTab === item.id
                      ? 'bg-forest-900 text-cream-50 shadow-sm'
                      : 'text-stone-700 hover:bg-cream-100'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 hidden lg:inline" />
                </button>
              );
            })}

            <div className="lg:pt-2 lg:border-t border-cream-100 flex-shrink-0">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-50 transition-colors text-left whitespace-nowrap min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Tab Content Panels (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-cream-200 p-4 sm:p-8 lg:p-10 shadow-soft">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest-950">Personal Details</h3>
                  <p className="text-xs text-stone-500 mt-1">Manage your name, phone number, and preferences</p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Email Address (Read Only)
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full text-xs p-3 rounded-xl border border-cream-200 bg-cream-50 text-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="Enter your 10-digit mobile number"
                      className="w-full text-xs p-3 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-600 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-3 bg-forest-900 hover:bg-forest-800 text-cream-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-cream-100">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-950">Order History</h3>
                    <p className="text-xs text-stone-500 mt-1">Track current shipments and view previous purchases</p>
                  </div>
                  <Link
                    to="/orders"
                    className="text-xs font-bold uppercase tracking-wider text-forest-800 hover:underline"
                  >
                    View All Orders →
                  </Link>
                </div>

                {loadingOrders ? (
                  <p className="text-xs text-stone-500 py-6">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <EmptyState
                    icon={Package}
                    title="No orders placed yet"
                    description="When you place an order, it will appear here with real-time shipment updates."
                    actionText="Start Shopping"
                    actionLink="/shop"
                  />
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id || ord.orderNumber}
                        className="p-5 rounded-2xl border border-cream-200 bg-cream-50/60 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-200 pb-3">
                          <div>
                            <span className="font-serif font-bold text-sm text-forest-950">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[11px] text-stone-500 ml-3">
                              Placed on {formatDate(ord.createdAt)}
                            </span>
                          </div>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider self-start sm:self-auto ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.orderStatus}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {ord.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-stone-700 font-medium">
                                {item.name} ({item.size}) x {item.quantity}
                              </span>
                              <span className="font-bold text-forest-950">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-cream-200 flex items-center justify-between text-xs">
                          <span className="text-stone-500">Total: <strong className="text-forest-950">{formatPrice(ord.total)}</strong></span>
                          <Link
                            to="/orders"
                            className="font-bold text-forest-800 hover:text-forest-600 underline"
                          >
                            Track Timeline →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-cream-100">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-950">Saved Delivery Addresses</h3>
                    <p className="text-xs text-stone-500 mt-1">Keep your delivery details updated for faster checkout</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-forest-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="p-5 rounded-2xl bg-cream-50 border border-cream-200 space-y-3 mb-6">
                    <h4 className="font-serif font-bold text-sm text-forest-950">New Shipping Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <input
                        type="text"
                        placeholder="Enter full name *"
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        required
                        className="p-2.5 rounded-lg border border-cream-300 bg-white"
                      />
                      <input
                        type="tel"
                        placeholder="Enter 10-digit mobile number *"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        required
                        className="p-2.5 rounded-lg border border-cream-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Enter house / flat no., building *"
                        value={newAddr.house}
                        onChange={(e) => setNewAddr({ ...newAddr, house: e.target.value })}
                        required
                        className="p-2.5 rounded-lg border border-cream-300 bg-white sm:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Enter street address & landmark *"
                        value={newAddr.street}
                        onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                        required
                        className="p-2.5 rounded-lg border border-cream-300 bg-white sm:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Enter city *"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        required
                        className="p-2.5 rounded-lg border border-cream-300 bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Enter 6-digit PIN code *"
                        maxLength={6}
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        required
                        className="p-2.5 rounded-lg border border-cream-300 bg-white"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="px-4 py-2 bg-forest-800 text-white rounded-lg text-xs font-bold">
                        Save Address
                      </button>
                      <button type="button" onClick={() => setShowAddAddress(false)} className="px-4 py-2 border border-cream-300 text-stone-600 rounded-lg text-xs">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.length === 0 ? (
                    <p className="text-xs text-stone-500 py-6 italic sm:col-span-2">No saved addresses found. Add one above.</p>
                  ) : (
                    addresses.map((addr, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-cream-200 bg-cream-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-forest-950">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-forest-100 text-forest-800 px-2 py-0.5 rounded font-bold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {addr.house}, {addr.street}<br />
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[11px] text-stone-500">Phone: {addr.phone}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest-950">My Wishlist</h3>
                  <p className="text-xs text-stone-500 mt-1">Saved natural products for your future orders</p>
                </div>

                {wishlistProducts.length === 0 ? (
                  <EmptyState
                    icon={Heart}
                    title="Your wishlist is empty"
                    description="Tap the heart icon on any fresh farm product to save it here for later."
                    actionText="Browse Products"
                    actionLink="/shop"
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((p) => (
                      <div key={p.id || p.slug} className="flex items-center justify-between p-3.5 rounded-2xl border border-cream-200 bg-cream-50/50">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0]} alt={p.name} className="w-14 h-14 rounded-xl object-cover" />
                          <div>
                            <Link to={`/product/${p.slug}`} className="font-bold text-xs text-forest-950 hover:underline">
                              {p.name}
                            </Link>
                            <p className="text-xs font-bold text-forest-700">{formatPrice(p.price)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(p)}
                          className="text-xs text-rose-600 hover:underline font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECURITY / SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest-950">Security & Privacy</h3>
                  <p className="text-xs text-stone-500 mt-1">Manage password, session security, and account deletion</p>
                </div>

                <div className="p-5 rounded-2xl bg-forest-50 border border-forest-100 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-forest-700 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-forest-950">Account Security Status: High</p>
                    <p className="text-[11px] text-forest-700">Authenticated via secure JWT encryption with rate-limited protection.</p>
                  </div>
                </div>

                {/* Real Password Change Form */}
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800">Change Password</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                      className="input text-xs p-3 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      required
                      className="input text-xs p-3 w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      className="input text-xs p-3 w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="btn-primary py-3 px-6 text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                  >
                    {updatingPassword ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Danger Zone: Delete Account */}
                <div className="pt-6 border-t border-cream-200">
                  <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3 max-w-xl">
                    <div className="flex items-center gap-2.5 text-rose-800">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Danger Zone — Delete Account</h4>
                    </div>
                    <p className="text-xs text-rose-700/90 leading-relaxed">
                      Permanently delete your VRUKSHA account, order history, and saved delivery addresses. This action cannot be undone.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmationInput('');
                        setShowDeleteModal(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete My Account</span>
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border border-rose-200">
                      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                        <Trash2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-stone-900 text-center">
                        Are you absolutely sure?
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed text-center">
                        This action will immediately erase your profile, saved addresses, and account credentials.
                        To confirm, please type <strong className="font-mono text-rose-600">DELETE</strong> below:
                      </p>
                      <input
                        type="text"
                        value={deleteConfirmationInput}
                        onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="input text-center font-mono uppercase tracking-widest text-xs p-3 w-full"
                      />
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowDeleteModal(false)}
                          className="btn-secondary flex-1 py-3 text-xs uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={deleteConfirmationInput.trim() !== 'DELETE' || isDeletingAccount}
                          onClick={handleDeleteAccount}
                          className="px-4 py-3 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 disabled:opacity-40 flex-1 flex items-center justify-center gap-2 transition"
                        >
                          {isDeletingAccount ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <span>Confirm Delete</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
