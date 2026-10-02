import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../api/client';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 49;

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ph_cart');
      return saved ? JSON.parse(saved) : [
        {
          product: 'prod-001',
          name: 'Pure Beetroot Powder',
          slug: 'beetroot-powder',
          image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',
          size: '250g',
          price: 499,
          originalPrice: 649,
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('ph_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('ph_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('ph_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('ph_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedCoupon]);

  const addToCart = (product, selectedSize = '100g', quantity = 1) => {
    const baseSize = product.sizes?.[0]?.size || '100g';
    const foundSize = product.sizes?.find((s) => s.size === selectedSize);
    const sizePrice = (selectedSize === baseSize && product.price)
      ? product.price
      : (foundSize?.price || product.price);
    const sizeOrigPrice = (selectedSize === baseSize && product.originalPrice)
      ? product.originalPrice
      : (foundSize?.originalPrice || product.originalPrice || sizePrice);

    const sizeObj = {
      size: selectedSize,
      price: sizePrice,
      originalPrice: sizeOrigPrice,
    };

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.product === product.id || item.slug === product.slug) && item.size === selectedSize
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }

      return [
        ...prev,
        {
          product: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=800&q=80',
          size: selectedSize,
          price: sizeObj.price,
          originalPrice: sizeObj.originalPrice,
          quantity,
        },
      ];
    });

    addToast(`Added ${product.name} (${selectedSize}) to cart`, 'success');
  };

  const addBundleToCart = (bundleProducts, customBoxName = 'Custom VRUKSHA Box', totalBundlePrice = 0) => {
    // Add each selected product as part of a curated bundle
    bundleProducts.forEach((item) => {
      addToCart(item.product, item.size || '100g', item.quantity || 1);
    });
    addToast(`Added "${customBoxName}" (${bundleProducts.length} items) to your cart!`, 'success');
    setIsDrawerOpen(true);
  };

  const removeFromCart = (productId, size) => {
    const itemToRemove = cartItems.find(
      (item) => (item.product === productId || item.slug === productId) && item.size === size
    );
    setCartItems((prev) =>
      prev.filter((item) => !((item.product === productId || item.slug === productId) && item.size === size))
    );
    if (itemToRemove) {
      addToast(`Removed ${itemToRemove.name} from cart`, 'info');
    }
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if ((item.product === productId || item.slug === productId) && item.size === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent) {
      return Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    }
    return appliedCoupon.discountAmount || 0;
  }, [appliedCoupon, subtotal]);

  const freeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.freeShipping;
  const shippingFee = cartItems.length === 0 ? 0 : freeShippingUnlocked ? 0 : STANDARD_SHIPPING_FEE;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = async (code) => {
    if (!code || code.trim() === '') {
      addToast('Please enter a coupon code', 'error');
      return { success: false };
    }

    try {
      const data = await api.post('/coupons/apply', { code: code.trim(), subtotal });
      if (data.success) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountPercent: data.coupon.discountPercent,
          discountAmount: data.discountAmount,
          freeShipping: data.freeShipping,
          description: data.coupon.description,
        });
        addToast(data.message || `Coupon ${code} applied!`, 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Invalid coupon';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        subtotal,
        discountAmount,
        shippingFee,
        total,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountToFreeShipping,
        freeShippingUnlocked,
        appliedCoupon,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        addBundleToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
