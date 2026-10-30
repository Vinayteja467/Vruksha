/**
 * Lightweight Privacy-First E-Commerce Analytics Engine for VRUKSHA
 * Integrates automatically with Google Analytics (gtag), Meta Pixel, or local event bus.
 */

class AnalyticsService {
  constructor() {
    this.debug = import.meta.env.DEV;
  }

  trackPageView(path, title) {
    if (this.debug) {
      console.log(`📊 [Analytics PageView]: ${path} - ${title || document.title}`);
    }

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title
      });
    }
  }

  trackEvent(eventName, params = {}) {
    if (this.debug) {
      console.log(`📊 [Analytics Event]: ${eventName}`, params);
    }

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  }

  // Common E-Commerce Helper Events
  trackProductView(product) {
    this.trackEvent('view_item', {
      currency: 'INR',
      value: product.price,
      items: [
        {
          item_id: product.id || product.slug,
          item_name: product.name,
          item_category: product.category,
          price: product.price
        }
      ]
    });
  }

  trackAddToCart(product, quantity = 1) {
    this.trackEvent('add_to_cart', {
      currency: 'INR',
      value: product.price * quantity,
      items: [
        {
          item_id: product.id || product.slug,
          item_name: product.name,
          price: product.price,
          quantity
        }
      ]
    });
  }

  trackRemoveFromCart(product) {
    this.trackEvent('remove_from_cart', {
      currency: 'INR',
      value: product.price,
      items: [
        {
          item_id: product.id || product.slug,
          item_name: product.name,
          price: product.price
        }
      ]
    });
  }

  trackBeginCheckout(items, total) {
    this.trackEvent('begin_checkout', {
      currency: 'INR',
      value: total,
      items: items.map(i => ({
        item_id: i.id || i.slug,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity
      }))
    });
  }

  trackPurchase(order) {
    this.trackEvent('purchase', {
      transaction_id: order.orderNumber,
      value: order.total,
      currency: 'INR',
      shipping: order.shippingFee || 0,
      coupon: order.couponApplied || '',
      items: (order.items || []).map(i => ({
        item_id: i.product || i.slug,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity
      }))
    });
  }

  trackSearch(query, resultCount) {
    this.trackEvent('search', {
      search_term: query,
      result_count: resultCount
    });
  }
}

export const analytics = new AnalyticsService();
