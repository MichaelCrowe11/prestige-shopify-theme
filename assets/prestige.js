/**
 * Prestige Theme - Premium Shopify Theme for Luxury Brands
 * Author: Michael Benjamin Crowe
 * Version: 1.0.0
 */

(function() {
  'use strict';

  // Simple i18n helpers
  const STR = (window.theme && window.theme.strings) || {};
  const s = (key, fallback = '') => (typeof STR[key] === 'string' && STR[key]) || fallback || key;
  const interpolate = (str, ...vals) => typeof str === 'string' ? str.replace(/%s/g, () => vals.shift() ?? '') : undefined;
  const replacePlaceholders = (str, map) => {
    if (typeof str !== 'string') return undefined;
    return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, key) => (key in map ? map[key] : m));
  };
  const escapeHtml = (unsafe) => String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const Prestige = {
    settings: {
      animationDuration: 400,
      debounceDelay: 300,
      cartType: window.theme?.cartType || 'drawer'
    },

    init() {
      this.initHeader();
      this.initCart();
      this.initProductForms();
      this.initProductMedia();
      this.initModals();
      this.initSearch();
      this.initNewsletter();
      this.initWishlist();
      this.initQuickShop();
      this.initCollectionFilters();
      this.initAnimations();
      this.initAccessibility();
    },

    initHeader() {
      const header = document.querySelector('.header');
      if (!header) return;

      const stickyHeader = header.classList.contains('header--sticky');
      const transparentHeader = header.classList.contains('header--transparent');

      if (stickyHeader) {
        let lastScroll = 0;
        window.addEventListener('scroll', this.debounce(() => {
          const currentScroll = window.pageYOffset;

          if (currentScroll > 100) {
            header.classList.add('is-scrolled');

            if (currentScroll > lastScroll && currentScroll > 300) {
              header.classList.add('is-hidden');
            } else {
              header.classList.remove('is-hidden');
            }
          } else {
            header.classList.remove('is-scrolled');
            header.classList.remove('is-hidden');
          }

          lastScroll = currentScroll;
        }, 10));
      }

      if (transparentHeader) {
        window.addEventListener('scroll', () => {
          if (window.pageYOffset > 50) {
            header.classList.add('is-filled');
          } else {
            header.classList.remove('is-filled');
          }
        });
      }

      const mobileMenuToggle = document.querySelector('[data-mobile-menu-toggle]');
      const mobileMenu = document.querySelector('[data-mobile-menu]');

      if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
          const isOpen = mobileMenu.classList.contains('is-open');
          mobileMenu.classList.toggle('is-open');
          document.body.classList.toggle('menu-open');
          mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
        });
      }
    },

    initCart() {
      this.cartDrawer = document.querySelector('.cart-drawer');
      this.cartCount = document.querySelectorAll('[data-cart-count]');

      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-cart-toggle]')) {
          e.preventDefault();
          this.toggleCart();
        }

        if (e.target.matches('[data-cart-close]')) {
          e.preventDefault();
          this.closeCart();
        }
      });

      document.addEventListener('cart:updated', () => {
        this.updateCart();
      });
    },

    toggleCart() {
      if (this.cartDrawer) {
        const isOpen = this.cartDrawer.classList.contains('is-open');
        if (isOpen) {
          this.closeCart();
        } else {
          this.openCart();
        }
      }
    },

    openCart() {
      if (this.cartDrawer) {
        // Store the currently focused element for restoration
        this.lastFocusedElement = document.activeElement;

        this.cartDrawer.classList.add('is-open');
        document.body.classList.add('cart-open');

        const focusableElements = this.cartDrawer.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length) {
          focusableElements[0].focus();
        }

        // Add focus trapping
        this.setupFocusTrap(this.cartDrawer);
      }
    },

    closeCart() {
      if (this.cartDrawer) {
        this.cartDrawer.classList.remove('is-open');
        document.body.classList.remove('cart-open');

        // Remove focus trap
        this.removeFocusTrap(this.cartDrawer);

        // Restore focus to the last focused element
        if (this.lastFocusedElement) {
          this.lastFocusedElement.focus();
        }
      }
    },

    async updateCart() {
      try {
        const response = await fetch('/cart.js');
        const cart = await response.json();

        this.updateCartCount(cart.item_count);
        this.updateCartDrawer(cart);

        if (cart.item_count === 0) {
          this.showEmptyCart();
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    },

    updateCartCount(count) {
      this.cartCount.forEach(element => {
        element.textContent = count;
        element.style.display = count > 0 ? 'flex' : 'none';
      });
    },

    updateCartDrawer(cart) {
      if (!this.cartDrawer) return;

      const itemsContainer = this.cartDrawer.querySelector('[data-cart-items]');
      const subtotalElement = this.cartDrawer.querySelector('[data-cart-subtotal]');

      if (itemsContainer) {
        itemsContainer.innerHTML = cart.items.map(item => this.cartItemTemplate(item)).join('');
      }

      if (subtotalElement) {
        subtotalElement.textContent = this.formatMoney(cart.total_price);
      }

      this.updateFreeShippingBar(cart.total_price);
    },

    cartItemTemplate(item) {
      return `
        <div class="cart-drawer__item" data-cart-item="${item.key}">
          <div class="cart-drawer__item-image">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </div>
          <div class="cart-drawer__item-details">
            <h4 class="cart-drawer__item-title">${item.product_title}</h4>
            ${item.variant_title ? `<p class="cart-drawer__item-variant">${item.variant_title}</p>` : ''}
            <p class="cart-drawer__item-price">${this.formatMoney(item.price)}</p>
            <div class="cart-drawer__item-quantity">
              <button data-quantity-decrease data-item-key="${item.key}" aria-label="${s('decreaseQuantity', 'Decrease quantity')}">-</button>
              <input type="number" value="${item.quantity}" min="1" data-quantity-input data-item-key="${item.key}">
              <button data-quantity-increase data-item-key="${item.key}" aria-label="${s('increaseQuantity', 'Increase quantity')}">+</button>
            </div>
            <a href="#" class="cart-drawer__item-remove" data-cart-remove="${item.key}">${s('cartRemove', 'Remove')}</a>
          </div>
        </div>
      `;
    },

    showEmptyCart() {
      if (!this.cartDrawer) return;

      const itemsContainer = this.cartDrawer.querySelector('[data-cart-items]');
      if (itemsContainer) {
        itemsContainer.innerHTML = `<p class="cart-drawer__empty">${s('cartEmpty', 'Your cart is empty')}</p>`;
      }
    },

    updateFreeShippingBar(totalPrice) {
      const freeShippingBar = document.querySelector('[data-free-shipping-bar]');
      if (!freeShippingBar) return;

      const threshold = parseInt(freeShippingBar.dataset.threshold) * 100;
      const remaining = threshold - totalPrice;

      if (remaining > 0) {
        const percentage = (totalPrice / threshold) * 100;
        freeShippingBar.querySelector('[data-progress]').style.width = `${percentage}%`;
        const msg = replacePlaceholders(STR.freeShippingProgress, { amount: this.formatMoney(remaining) })
          || interpolate(STR.freeShippingProgress, this.formatMoney(remaining))
          || `You're ${this.formatMoney(remaining)} away from free shipping!`;
        freeShippingBar.querySelector('[data-message]').textContent = msg;
      } else {
        freeShippingBar.querySelector('[data-progress]').style.width = '100%';
        freeShippingBar.querySelector('[data-message]').textContent =
          s('freeShippingAchieved', "You've qualified for free shipping!");
      }
    },

    initProductForms() {
      document.addEventListener('submit', async (e) => {
        if (e.target.matches('[data-product-form]')) {
          e.preventDefault();
          await this.handleAddToCart(e.target);
        }
      });

      document.addEventListener('change', (e) => {
        if (e.target.matches('[data-variant-select]')) {
          this.handleVariantChange(e.target);
        }
      });

      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-option-value]')) {
          e.preventDefault();
          this.handleOptionClick(e.target);
        }

        if (e.target.matches('[data-quantity-decrease]')) {
          this.decreaseQuantity(e.target);
        }

        if (e.target.matches('[data-quantity-increase]')) {
          this.increaseQuantity(e.target);
        }
      });
    },

    async handleAddToCart(form) {
      const submitButton = form.querySelector('[type="submit"]');
      const originalText = submitButton.textContent;

      submitButton.textContent = s('adding', 'Adding...');
      submitButton.disabled = true;

      try {
        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const item = await response.json();

          submitButton.textContent = s('added', 'Added!');

          await this.updateCart();

          if (this.settings.cartType === 'drawer') {
            this.toggleCart();
          }

          setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          }, 2000);

          document.dispatchEvent(new CustomEvent('cart:added', { detail: item }));
        } else {
          throw new Error('Failed to add to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        submitButton.textContent = s('error', 'Error');

        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }, 2000);
      }
    },

    handleVariantChange(select) {
      const form = select.closest('form');
      const selectedOption = select.options[select.selectedIndex];

      const price = selectedOption.dataset.price;
      const comparePrice = selectedOption.dataset.comparePrice;
      const available = selectedOption.dataset.available === 'true';
      const image = selectedOption.dataset.image;

      this.updateProductPrice(form, price, comparePrice);
      this.updateProductAvailability(form, available);

      if (image) {
        this.updateProductImage(image);
      }
    },

    handleOptionClick(option) {
      const group = option.closest('[data-option-group]');

      group.querySelectorAll('[data-option-value]').forEach(opt => {
        opt.classList.remove('is-active');
      });

      option.classList.add('is-active');

      const form = option.closest('form');
      const optionInputs = form.querySelectorAll('[data-option-input]');
      const optionName = option.dataset.optionName;
      const optionValue = option.dataset.optionValue;

      optionInputs.forEach(input => {
        if (input.name === optionName) {
          input.value = optionValue;
        }
      });

      this.updateSelectedVariant(form);
    },

    updateSelectedVariant(form) {
      const options = [];
      form.querySelectorAll('[data-option-input]').forEach(input => {
        options.push(input.value);
      });

      const variantTitle = options.join(' / ');
      const variantSelect = form.querySelector('[data-variant-select]');

      if (variantSelect) {
        const matchingOption = Array.from(variantSelect.options).find(option =>
          option.text === variantTitle
        );

        if (matchingOption) {
          variantSelect.value = matchingOption.value;
          this.handleVariantChange(variantSelect);
        }
      }
    },

    updateProductPrice(form, price, comparePrice) {
      const priceElement = form.closest('.product').querySelector('[data-product-price]');

      if (priceElement) {
        let priceHTML = this.formatMoney(price);

        if (comparePrice && comparePrice > price) {
          priceHTML = `
            <span class="product__price--sale">${this.formatMoney(price)}</span>
            <span class="product__price--compare">${this.formatMoney(comparePrice)}</span>
          `;
        }

        priceElement.innerHTML = priceHTML;
      }
    },

    updateProductAvailability(form, available) {
      const submitButton = form.querySelector('[type="submit"]');

      if (submitButton) {
        submitButton.disabled = !available;
        submitButton.textContent = available ? s('addToCart', 'Add to cart') : s('soldOut', 'Sold out');
      }
    },

    updateProductImage(imageSrc) {
      const mainImage = document.querySelector('[data-product-main-image]');

      if (mainImage) {
        mainImage.src = imageSrc;
      }
    },

    decreaseQuantity(button) {
      const input = button.parentElement.querySelector('input[type="number"]');
      const currentValue = parseInt(input.value);

      if (currentValue > 1) {
        input.value = currentValue - 1;
        input.dispatchEvent(new Event('change'));
      }
    },

    increaseQuantity(button) {
      const input = button.parentElement.querySelector('input[type="number"]');
      const currentValue = parseInt(input.value);

      input.value = currentValue + 1;
      input.dispatchEvent(new Event('change'));
    },

    initProductMedia() {
      const productImages = document.querySelectorAll('[data-product-image]');
      const thumbnails = document.querySelectorAll('[data-product-thumbnail]');

      thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', (e) => {
          e.preventDefault();

          const imageSrc = thumbnail.dataset.imageSrc;
          const mainImage = document.querySelector('[data-product-main-image]');

          if (mainImage) {
            mainImage.src = imageSrc;
          }

          thumbnails.forEach(thumb => thumb.classList.remove('is-active'));
          thumbnail.classList.add('is-active');
        });
      });

      productImages.forEach(image => {
        image.addEventListener('click', () => {
          this.openImageZoom(image.src);
        });

        image.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openImageZoom(image.src);
          }
        });
      });
    },

    openImageZoom(imageSrc) {
      const modal = document.createElement('div');
      modal.className = 'modal image-zoom-modal is-open';
      modal.innerHTML = `
        <div class="modal__inner">
          <button class="modal__close" data-modal-close>&times;</button>
          <img src="${imageSrc}" alt="${s('zoomedImageAlt', 'Zoomed product image')}">
        </div>
      `;

      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.matches('[data-modal-close]')) {
          modal.remove();
        }
      });
    },

    initModals() {
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-modal-open]')) {
          e.preventDefault();
          const modalId = e.target.dataset.modalOpen;
          this.openModal(modalId);
        }

        if (e.target.matches('[data-modal-close]')) {
          e.preventDefault();
          this.closeModal(e.target.closest('.modal'));
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openModals = document.querySelectorAll('.modal.is-open');
          openModals.forEach(modal => this.closeModal(modal));
        }
      });
    },

    openModal(modalId) {
      const modal = document.querySelector(`[data-modal="${modalId}"]`);

      if (modal) {
        // Store the currently focused element for restoration
        this.lastFocusedElement = document.activeElement;

        modal.classList.add('is-open');
        document.body.classList.add('modal-open');

        const focusableElements = modal.querySelectorAll(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length) {
          focusableElements[0].focus();
        }

        // Add focus trapping
        this.setupFocusTrap(modal);
      }
    },

    closeModal(modal) {
      if (modal) {
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');

        // Remove focus trap
        this.removeFocusTrap(modal);

        // Restore focus to the last focused element
        if (this.lastFocusedElement) {
          this.lastFocusedElement.focus();
        }
      }
    },

    setupFocusTrap(modal) {
      const focusableElements = modal.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      modal.addEventListener('keydown', handleTabKey);
      modal._focusTrapHandler = handleTabKey;
    },

    removeFocusTrap(modal) {
      if (modal._focusTrapHandler) {
        modal.removeEventListener('keydown', modal._focusTrapHandler);
        delete modal._focusTrapHandler;
      }
    },

    initSearch() {
      const searchToggle = document.querySelector('[data-search-toggle]');
      const searchModal = document.querySelector('[data-search-modal]');
      const searchForm = document.querySelector('[data-search-form]');
      const searchInput = document.querySelector('[data-search-input]');
      const searchResults = document.querySelector('[data-search-results]');

      if (searchToggle && searchModal) {
        searchToggle.addEventListener('click', () => {
          this.openModal('search');
        });
      }

      if (searchInput && searchResults) {
        searchInput.addEventListener('input', this.debounce(async (e) => {
          const query = e.target.value.trim();

          if (query.length >= 3) {
            await this.performSearch(query, searchResults);
          } else {
            searchResults.innerHTML = '';
          }
        }, this.settings.debounceDelay));
      }

      if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const query = searchInput.value.trim();

          if (query) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
          }
        });
      }
    },

    async performSearch(query, resultsContainer) {
      resultsContainer.innerHTML = '<div class="loading-spinner"></div>';

      try {
        const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`);
        const data = await response.json();

        if (data.resources.results.products.length > 0) {
          resultsContainer.innerHTML = data.resources.results.products.map(product => `
            <a href="${product.url}" class="search-result">
              <img src="${product.featured_image}" alt="${product.title}" loading="lazy">
              <div class="search-result__details">
                <h4>${product.title}</h4>
                <p>${this.formatMoney(product.price)}</p>
              </div>
            </a>
          `).join('');
        } else {
          const q = escapeHtml(query);
          const base = s('searchNoResults', 'No results found');
          resultsContainer.innerHTML = `<p class="no-results">${base} ${q ? `for &quot;${q}&quot;` : ''}</p>`;
        }
      } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = `<p class="error">${s('genericError', 'An error occurred. Please try again.')}</p>`;
      }
    },

    initNewsletter() {
      const newsletterForms = document.querySelectorAll('[data-newsletter-form]');

      newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const email = form.querySelector('[type="email"]').value;
          const button = form.querySelector('[type="submit"]');
          const originalText = button.textContent;

          button.textContent = s('newsletterSubscribing', 'Subscribing...');
          button.disabled = true;

          try {
            const response = await fetch('/contact', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: `form_type=customer&utf8=✓&contact[email]=${encodeURIComponent(email)}&contact[tags]=newsletter`
            });

            if (response.ok) {
              form.innerHTML = `<p class="success">${s('newsletterSuccess', 'Thank you for subscribing!')}</p>`;
            } else {
              throw new Error('Subscription failed');
            }
          } catch (error) {
            console.error('Newsletter error:', error);
            button.textContent = s('tryAgainError', 'Error - Please try again');

            setTimeout(() => {
              button.textContent = originalText;
              button.disabled = false;
            }, 3000);
          }
        });
      });
    },

    initWishlist() {
      const WISHLIST_KEY = 'prestige_wishlist';

      this.wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');

      this.updateWishlistButtons();
      this.updateWishlistCount();

      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-wishlist-toggle]')) {
          e.preventDefault();

          const productId = e.target.dataset.productId;
          const productTitle = e.target.dataset.productTitle;
          const productImage = e.target.dataset.productImage;
          const productPrice = e.target.dataset.productPrice;
          const productUrl = e.target.dataset.productUrl;

          this.toggleWishlistItem({
            id: productId,
            title: productTitle,
            image: productImage,
            price: productPrice,
            url: productUrl
          });
        }
      });
    },

    toggleWishlistItem(product) {
      const index = this.wishlist.findIndex(item => item.id === product.id);

      if (index > -1) {
        this.wishlist.splice(index, 1);
        this.showNotification(`${product.title} removed from wishlist`);
      } else {
        this.wishlist.push(product);
        this.showNotification(`${product.title} added to wishlist`);
      }

      localStorage.setItem('prestige_wishlist', JSON.stringify(this.wishlist));

      this.updateWishlistButtons();
      this.updateWishlistCount();
      this.updateWishlistPage();
    },

    updateWishlistButtons() {
      document.querySelectorAll('[data-wishlist-toggle]').forEach(button => {
        const productId = button.dataset.productId;
        const isInWishlist = this.wishlist.some(item => item.id === productId);

        button.classList.toggle('is-active', isInWishlist);
        button.setAttribute('aria-pressed', isInWishlist);
      });
    },

    updateWishlistCount() {
      document.querySelectorAll('[data-wishlist-count]').forEach(element => {
        element.textContent = this.wishlist.length;
        element.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
      });
    },

    updateWishlistPage() {
      const wishlistContainer = document.querySelector('[data-wishlist-items]');

      if (wishlistContainer) {
        if (this.wishlist.length > 0) {
          wishlistContainer.innerHTML = this.wishlist.map(product => `
            <div class="wishlist-item">
              <a href="${product.url}" class="wishlist-item__image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
              </a>
              <div class="wishlist-item__details">
                <h3><a href="${product.url}">${product.title}</a></h3>
                <p class="wishlist-item__price">${product.price}</p>
                <button data-wishlist-toggle data-product-id="${product.id}">
                  ${s('wishlistRemove', 'Remove from wishlist')}
                </button>
              </div>
            </div>
          `).join('');
        } else {
          wishlistContainer.innerHTML = `<p>${s('wishlistEmpty', 'Your wishlist is empty')}</p>`;
        }
      }
    },

    initQuickShop() {
      document.addEventListener('click', async (e) => {
        if (e.target.matches('[data-quick-shop]')) {
          e.preventDefault();

          const productHandle = e.target.dataset.productHandle;
          await this.openQuickShop(productHandle);
        }
      });
    },

    async openQuickShop(handle) {
      const modal = document.querySelector('[data-quick-shop-modal]');

      if (!modal) return;

      const content = modal.querySelector('[data-quick-shop-content]');
      content.innerHTML = '<div class="loading-spinner"></div>';

      this.openModal('quick-shop');

      try {
        const response = await fetch(`/products/${handle}?view=quick-shop`);
        const html = await response.text();

        content.innerHTML = html;

        this.initProductForms();
        this.initProductMedia();
      } catch (error) {
        console.error('Quick shop error:', error);
        content.innerHTML = `<p class="error">${s('productLoadError', 'Failed to load product. Please try again.')}</p>`;
      }
    },

    initCollectionFilters() {
      const filterForm = document.querySelector('[data-filter-form]');
      const sortSelect = document.querySelector('[data-sort-select]');

      if (filterForm) {
        filterForm.addEventListener('change', this.debounce(() => {
          this.applyFilters(filterForm);
        }, this.settings.debounceDelay));

        filterForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.applyFilters(filterForm);
        });
      }

      if (sortSelect) {
        sortSelect.addEventListener('change', () => {
          const url = new URL(window.location);
          url.searchParams.set('sort_by', sortSelect.value);
          window.location = url.toString();
        });
      }

      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-filter-clear]')) {
          e.preventDefault();
          this.clearFilters();
        }

        if (e.target.matches('[data-filter-remove]')) {
          e.preventDefault();
          const filterId = e.target.dataset.filterId;
          this.removeFilter(filterId);
        }
      });
    },

    applyFilters(form) {
      const formData = new FormData(form);
      const params = new URLSearchParams(formData);

      const url = new URL(window.location);
      url.search = params.toString();

      this.loadFilteredProducts(url.toString());
    },

    clearFilters() {
      const url = new URL(window.location);
      url.search = '';

      this.loadFilteredProducts(url.toString());
    },

    removeFilter(filterId) {
      const url = new URL(window.location);
      url.searchParams.delete(filterId);

      this.loadFilteredProducts(url.toString());
    },

    async loadFilteredProducts(url) {
      const productsContainer = document.querySelector('[data-products-grid]');
      const loadingOverlay = document.querySelector('.loading-overlay');

      if (!productsContainer) return;

      loadingOverlay?.classList.add('is-loading');

      try {
        const response = await fetch(url);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const newProducts = doc.querySelector('[data-products-grid]').innerHTML;
        const newFilters = doc.querySelector('[data-active-filters]')?.innerHTML;

        productsContainer.innerHTML = newProducts;

        const activeFilters = document.querySelector('[data-active-filters]');
        if (activeFilters && newFilters) {
          activeFilters.innerHTML = newFilters;
        }

        window.history.pushState({}, '', url);

        this.initAnimations();
      } catch (error) {
        console.error('Filter error:', error);
      } finally {
        loadingOverlay?.classList.remove('is-loading');
      }
    },

    initAnimations() {
      if (!window.IntersectionObserver) return;

      const animatedElements = document.querySelectorAll('[data-animate]');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(element => {
        observer.observe(element);
      });
    },

    initAccessibility() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-nav');
        }
      });

      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
      });

      const skipLink = document.querySelector('.skip-to-content-link');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(skipLink.getAttribute('href'));
          if (target) {
            target.focus();
            window.scrollTo({
              top: target.offsetTop,
              behavior: 'smooth'
            });
          }
        });
      }
    },

    showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.className = `notification notification--${type}`;
      notification.textContent = message;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('is-visible');
      }, 10);

      setTimeout(() => {
        notification.classList.remove('is-visible');

        setTimeout(() => {
          notification.remove();
        }, this.settings.animationDuration);
      }, 3000);
    },

    formatMoney(cents) {
      const money = (cents / 100).toFixed(2);
      return window.theme?.moneyFormat?.replace('{{amount}}', money) || `$${money}`;
    },

    debounce(func, delay) {
      let timeoutId;
      return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    Prestige.init();
  });

  window.Prestige = Prestige;
})();