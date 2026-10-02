import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('ph_wishlist');
      return saved ? JSON.parse(saved) : ['beetroot-powder', 'moringa-leaf-powder'];
    } catch {
      return [];
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('ph_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const slug = typeof product === 'string' ? product : product.slug;
    const name = typeof product === 'string' ? 'Product' : product.name;

    if (wishlist.includes(slug)) {
      setWishlist((prev) => prev.filter((s) => s !== slug));
      addToast(`Removed ${name} from your wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, slug]);
      addToast(`Added ${name} to your wishlist`, 'success');
    }
  };

  const isInWishlist = (slug) => {
    return wishlist.includes(slug);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
