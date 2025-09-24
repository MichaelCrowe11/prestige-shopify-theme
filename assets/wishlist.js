/**
 * Prestige Theme - Wishlist Management
 * Advanced wishlist functionality with local storage and customer account sync
 */

class WishlistManager {
  constructor() {
    this.storageKey = 'prestige_wishlist';
    this.wishlist = this.loadWishlist();
    this.customerId = window.customerId || null;
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateAllButtons();
    this.updateCounter();

    // Sync with customer account if logged in
    if (this.customerId) {
      this.syncWithAccount();
    }
  }

  loadWishlist() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
      this.updateCounter();
      this.dispatchUpdateEvent();
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }

  async syncWithAccount() {
    if (!this.customerId) return;

    try {
      // Fetch customer metafields for wishlist
      const response = await fetch('/apps/wishlist/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: this.customerId,
          wishlist: this.wishlist
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.wishlist) {
          // Merge local and account wishlists
          const merged = [...new Set([...this.wishlist, ...data.wishlist])];
          this.wishlist = merged;
          this.saveWishlist();
        }
      }
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
    }
  }

  attachEventListeners() {
    // Add to wishlist buttons
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-wishlist-add]');
      if (button) {
        e.preventDefault();
        const productData = this.getProductData(button);
        this.toggle(productData);
      }
    });

    // Quick add from wishlist page
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-wishlist-quick-add]');
      if (button) {
        e.preventDefault();
        this.quickAddToCart(button.dataset.variantId);
      }
    });

    // Remove from wishlist page
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-wishlist-remove-item]');
      if (button) {
        e.preventDefault();
        this.remove(button.dataset.productId);
        this.removeFromPage(button.dataset.productId);
      }
    });

    // Share wishlist
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-wishlist-share]');
      if (button) {
        e.preventDefault();
        this.shareWishlist();
      }
    });
  }

  getProductData(button) {
    return {
      id: button.dataset.wishlistAdd || button.dataset.productId,
      title: button.dataset.productTitle,
      handle: button.dataset.productHandle,
      image: button.dataset.productImage,
      price: button.dataset.productPrice,
      vendor: button.dataset.productVendor,
      variant_id: button.dataset.variantId,
      url: button.dataset.productUrl
    };
  }

  toggle(product) {
    const index = this.wishlist.findIndex(item => item.id === product.id);

    if (index > -1) {
      this.remove(product.id);
    } else {
      this.add(product);
    }
  }

  add(product) {
    // Check if already exists
    if (this.wishlist.find(item => item.id === product.id)) {
      this.showNotification('Already in wishlist', 'info');
      return;
    }

    // Add timestamp
    product.added_at = new Date().toISOString();

    this.wishlist.push(product);
    this.saveWishlist();
    this.updateButton(product.id, true);
    this.showNotification('Added to wishlist', 'success');

    // Track analytics event
    this.trackEvent('add_to_wishlist', product);
  }

  remove(productId) {
    const index = this.wishlist.findIndex(item => item.id === productId);

    if (index > -1) {
      const product = this.wishlist[index];
      this.wishlist.splice(index, 1);
      this.saveWishlist();
      this.updateButton(productId, false);
      this.showNotification('Removed from wishlist', 'info');

      // Track analytics event
      this.trackEvent('remove_from_wishlist', product);
    }
  }

  removeFromPage(productId) {
    const element = document.querySelector(`[data-wishlist-item="${productId}"]`);
    if (element) {
      element.style.opacity = '0';
      element.style.transform = 'scale(0.9)';
      setTimeout(() => {
        element.remove();

        // Check if wishlist is now empty
        if (this.wishlist.length === 0) {
          this.displayEmptyMessage();
        }
      }, 300);
    }
  }

  displayEmptyMessage() {
    const container = document.querySelector('[data-wishlist-grid]');
    if (container) {
      container.innerHTML = `
        <div class="wishlist-empty">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M40 70L10 40C2 32 2 18 10 10C18 2 32 2 40 10C48 2 62 2 70 10C78 18 78 32 70 40L40 70Z" stroke="currentColor" stroke-width="2"/>
          </svg>
          <h2>Your wishlist is empty</h2>
          <p>Save your favorite items here to purchase later</p>
          <a href="/collections/all" class="button button--primary">Start Shopping</a>
        </div>
      `;
    }
  }

  contains(productId) {
    return this.wishlist.some(item => item.id === productId);
  }

  updateButton(productId, isAdded) {
    const buttons = document.querySelectorAll(`[data-wishlist-add="${productId}"]`);

    buttons.forEach(button => {
      button.classList.toggle('wishlist-added', isAdded);

      // Update icon
      const icon = button.querySelector('svg');
      if (icon) {
        const path = icon.querySelector('path');
        if (path) {
          if (isAdded) {
            path.setAttribute('fill', 'currentColor');
            path.setAttribute('stroke', 'none');
          } else {
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', 'currentColor');
          }
        }
      }

      // Update text if present
      const text = button.querySelector('.wishlist-button-text');
      if (text) {
        text.textContent = isAdded ? 'In Wishlist' : 'Add to Wishlist';
      }

      // Update aria-label
      button.setAttribute('aria-label', isAdded ? 'Remove from wishlist' : 'Add to wishlist');
    });
  }

  updateAllButtons() {
    this.wishlist.forEach(item => {
      this.updateButton(item.id, true);
    });
  }

  updateCounter() {
    const counters = document.querySelectorAll('[data-wishlist-count]');
    const count = this.wishlist.length;

    counters.forEach(counter => {
      counter.textContent = count;
      counter.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  async quickAddToCart(variantId) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: 1
        })
      });

      if (response.ok) {
        const item = await response.json();
        this.showNotification('Added to cart', 'success');

        // Update cart drawer if present
        if (window.PrestigeTheme) {
          window.PrestigeTheme.updateCart();
        }

        // Track analytics
        this.trackEvent('add_to_cart_from_wishlist', item);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Quick add error:', error);
      this.showNotification('Failed to add to cart', 'error');
    }
  }

  async shareWishlist() {
    const wishlistUrl = `${window.location.origin}/pages/wishlist`;
    const shareData = {
      title: 'My Wishlist',
      text: `Check out my wishlist at ${window.shopName}`,
      url: wishlistUrl
    };

    try {
      if (navigator.share && window.isSecureContext) {
        // Use native share API if available
        await navigator.share(shareData);
        this.showNotification('Wishlist shared!', 'success');
      } else {
        // Fall back to copying link
        await navigator.clipboard.writeText(wishlistUrl);
        this.showNotification('Link copied to clipboard', 'success');
      }
    } catch (error) {
      console.error('Share error:', error);

      // Final fallback: show share modal
      this.showShareModal(wishlistUrl);
    }
  }

  showShareModal(url) {
    const modal = document.createElement('div');
    modal.className = 'wishlist-share-modal';
    modal.innerHTML = `
      <div class="wishlist-share-modal__overlay"></div>
      <div class="wishlist-share-modal__content">
        <h3>Share Wishlist</h3>
        <div class="wishlist-share-modal__options">
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" class="wishlist-share-modal__option">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </a>
          <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Check out my wishlist!')}" target="_blank" class="wishlist-share-modal__option">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </a>
          <a href="https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}" target="_blank" class="wishlist-share-modal__option">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
            </svg>
            Pinterest
          </a>
          <button class="wishlist-share-modal__option" data-copy-link="${url}">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copy Link
          </button>
        </div>
        <button class="wishlist-share-modal__close" aria-label="Close">×</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.wishlist-share-modal__close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.wishlist-share-modal__overlay').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('[data-copy-link]').addEventListener('click', async (e) => {
      const url = e.currentTarget.dataset.copyLink;
      await navigator.clipboard.writeText(url);
      this.showNotification('Link copied!', 'success');
      document.body.removeChild(modal);
    });
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `wishlist-notification wishlist-notification--${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      ${type === 'success' ? '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 10.78l-2.39-2.39L2.2 9.8 6 13.6 13.8 5.8l-1.41-1.41z" fill="currentColor"/></svg>' : ''}
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add('wishlist-notification--visible');
    }, 10);

    // Auto remove
    setTimeout(() => {
      notification.classList.remove('wishlist-notification--visible');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  trackEvent(eventName, data) {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, {
        currency: window.shopCurrency,
        value: data.price ? parseFloat(data.price) / 100 : 0,
        items: [{
          item_id: data.id,
          item_name: data.title,
          item_brand: data.vendor,
          price: data.price ? parseFloat(data.price) / 100 : 0,
          quantity: 1
        }]
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', eventName === 'add_to_wishlist' ? 'AddToWishlist' : 'RemoveFromWishlist', {
        content_ids: [data.id],
        content_name: data.title,
        content_type: 'product',
        value: data.price ? parseFloat(data.price) / 100 : 0,
        currency: window.shopCurrency
      });
    }

    // Shopify Analytics
    if (window.ShopifyAnalytics) {
      window.ShopifyAnalytics.lib.track(eventName, data);
    }
  }

  dispatchUpdateEvent() {
    window.dispatchEvent(new CustomEvent('wishlist:updated', {
      detail: {
        wishlist: this.wishlist,
        count: this.wishlist.length
      }
    }));
  }

  // Public API
  getWishlist() {
    return [...this.wishlist];
  }

  getCount() {
    return this.wishlist.length;
  }

  clear() {
    this.wishlist = [];
    this.saveWishlist();
    this.updateAllButtons();
    this.displayEmptyMessage();
    this.showNotification('Wishlist cleared', 'info');
  }
}

// Initialize wishlist manager when DOM is ready
if (document.readyState !== 'loading') {
  window.wishlistManager = new WishlistManager();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    window.wishlistManager = new WishlistManager();
  });
}