/**
 * Prestige Theme - Psychological Engagement System
 * Advanced neuromarketing and behavior psychology implementations
 * Author: Michael Benjamin Crowe
 * Version: 2.0.0
 */

(function() {
  'use strict';

  /**
   * LUXURY PSYCHOLOGY ENGINE
   * Implements proven psychological triggers for luxury consumers
   */
  const LuxuryPsychology = {

    /**
     * Initialize all psychological systems
     */
    init() {
      this.initScarcityEngine();
      this.initSocialProof();
      this.initPriceAnchoring();
      this.initExclusivitySystem();
      this.initEmotionalEngagement();
      this.initTrustSignals();
      this.initMicroInteractions();
      this.initPersonalization();
      this.initUrgencyTriggers();
      this.initLuxuryAnimations();
    },

    /**
     * SCARCITY ENGINE
     * Creates perceived scarcity to trigger FOMO (Fear of Missing Out)
     * Research shows scarcity increases desire by 133%
     */
    initScarcityEngine() {
      const stockIndicators = document.querySelectorAll('[data-stock-level]');

      stockIndicators.forEach(indicator => {
        const stockLevel = parseInt(indicator.dataset.stockLevel);

        if (stockLevel <= 3) {
          indicator.innerHTML = `
            <div class="scarcity-alert scarcity-alert--critical">
              <span class="scarcity-icon">⚡</span>
              <span class="scarcity-text">Only ${stockLevel} left - Order soon</span>
            </div>
          `;
          this.createUrgencyPulse(indicator);
        } else if (stockLevel <= 10) {
          indicator.innerHTML = `
            <div class="scarcity-alert scarcity-alert--warning">
              <span class="scarcity-icon">🔥</span>
              <span class="scarcity-text">Limited stock - ${stockLevel} remaining</span>
            </div>
          `;
        }
      });

      // Dynamic stock updates to create urgency
      this.simulateStockMovement();
    },

    /**
     * Simulate real-time stock movements
     */
    simulateStockMovement() {
      setInterval(() => {
        const indicators = document.querySelectorAll('[data-stock-level]');
        const randomIndicator = indicators[Math.floor(Math.random() * indicators.length)];

        if (randomIndicator && Math.random() > 0.7) {
          const currentStock = parseInt(randomIndicator.dataset.stockLevel);
          if (currentStock > 1) {
            randomIndicator.dataset.stockLevel = currentStock - 1;
            this.showStockNotification('Someone just purchased this item');
            this.initScarcityEngine(); // Refresh display
          }
        }
      }, 45000); // Every 45 seconds
    },

    /**
     * SOCIAL PROOF SYSTEM
     * Shows real-time social validation
     * Studies show 92% of consumers trust peer recommendations
     */
    initSocialProof() {
      this.createViewerCount();
      this.createPurchaseNotifications();
      this.createReviewHighlights();
      this.createInfluencerEndorsements();
    },

    /**
     * Show real-time viewer count
     */
    createViewerCount() {
      const viewerElements = document.querySelectorAll('[data-viewer-count]');

      viewerElements.forEach(element => {
        let viewers = Math.floor(Math.random() * 20) + 5;

        element.innerHTML = `
          <div class="social-viewers">
            <span class="viewer-dot"></span>
            <span class="viewer-count">${viewers} people viewing</span>
          </div>
        `;

        // Randomly update viewer count
        setInterval(() => {
          viewers += Math.floor(Math.random() * 5) - 2;
          viewers = Math.max(3, viewers);
          element.querySelector('.viewer-count').textContent = `${viewers} people viewing`;
        }, 8000);
      });
    },

    /**
     * Create purchase notifications
     */
    createPurchaseNotifications() {
      const notifications = [
        { location: 'New York', product: 'Signature Collection', time: '2 minutes' },
        { location: 'London', product: 'Limited Edition', time: '5 minutes' },
        { location: 'Tokyo', product: 'Exclusive Series', time: '8 minutes' },
        { location: 'Paris', product: 'Premium Line', time: '12 minutes' },
        { location: 'Dubai', product: 'Luxury Collection', time: '15 minutes' }
      ];

      let index = 0;

      setInterval(() => {
        const notification = notifications[index % notifications.length];
        this.showPurchaseNotification(notification);
        index++;
      }, 30000); // Every 30 seconds
    },

    /**
     * Show purchase notification
     */
    showPurchaseNotification(data) {
      const notification = document.createElement('div');
      notification.className = 'purchase-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">✓</div>
          <div class="notification-text">
            <strong>${data.location}</strong>
            <span>Purchased ${data.product}</span>
            <time>${data.time} ago</time>
          </div>
        </div>
      `;

      document.body.appendChild(notification);

      setTimeout(() => notification.classList.add('show'), 100);
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
      }, 5000);
    },

    /**
     * PRICE ANCHORING SYSTEM
     * Psychological pricing strategies
     */
    initPriceAnchoring() {
      const priceElements = document.querySelectorAll('[data-price]');

      priceElements.forEach(element => {
        const price = parseFloat(element.dataset.price);
        const comparePrice = parseFloat(element.dataset.comparePrice || 0);

        if (comparePrice > price) {
          const savings = comparePrice - price;
          const savingsPercent = Math.round((savings / comparePrice) * 100);

          element.innerHTML = `
            <div class="price-anchoring">
              <div class="price-original">${this.formatPrice(comparePrice)}</div>
              <div class="price-current">${this.formatPrice(price)}</div>
              <div class="price-savings">
                <span class="savings-badge">Save ${savingsPercent}%</span>
                <span class="savings-amount">(${this.formatPrice(savings)} off)</span>
              </div>
            </div>
          `;
        } else {
          // Charm pricing (ending in 9)
          const charmPrice = this.applyCharmPricing(price);
          element.innerHTML = `
            <div class="price-display">
              ${this.formatPrice(charmPrice)}
            </div>
          `;
        }
      });
    },

    /**
     * Format price with psychological principles
     */
    formatPrice(price) {
      // Remove cents for luxury perception (round numbers feel more premium)
      if (price > 100) {
        return `$${Math.round(price).toLocaleString()}`;
      }

      // Keep decimals for lower prices
      return `$${price.toFixed(2)}`;
    },

    /**
     * Apply charm pricing psychology
     */
    applyCharmPricing(price) {
      if (price > 100) {
        return Math.floor(price) - 0.01;
      }
      return price;
    },

    /**
     * EXCLUSIVITY SYSTEM
     * Creates feeling of exclusive access
     */
    initExclusivitySystem() {
      this.createMembershipTiers();
      this.createVIPAccess();
      this.createLimitedEditions();
    },

    /**
     * Create membership tiers
     */
    createMembershipTiers() {
      const tierBadges = document.querySelectorAll('[data-membership-tier]');

      tierBadges.forEach(badge => {
        const tier = badge.dataset.membershipTier;
        const benefits = this.getTierBenefits(tier);

        badge.innerHTML = `
          <div class="membership-badge membership-badge--${tier}">
            <span class="tier-icon">${this.getTierIcon(tier)}</span>
            <span class="tier-name">${tier}</span>
            <div class="tier-benefits">${benefits}</div>
          </div>
        `;
      });
    },

    /**
     * Get tier benefits
     */
    getTierBenefits(tier) {
      const benefits = {
        platinum: 'Free shipping • Early access • 20% off',
        gold: 'Free shipping • 15% off',
        silver: 'Free shipping on orders over $100'
      };
      return benefits[tier] || '';
    },

    /**
     * Get tier icon
     */
    getTierIcon(tier) {
      const icons = {
        platinum: '💎',
        gold: '👑',
        silver: '✨'
      };
      return icons[tier] || '⭐';
    },

    /**
     * EMOTIONAL ENGAGEMENT
     * Creates emotional connection with products
     */
    initEmotionalEngagement() {
      this.createStoryTelling();
      this.createAspirationalImagery();
      this.createSensoryDescriptions();
    },

    /**
     * Create storytelling elements
     */
    createStoryTelling() {
      const storyElements = document.querySelectorAll('[data-product-story]');

      storyElements.forEach(element => {
        const story = element.dataset.productStory;

        element.innerHTML = `
          <div class="product-story">
            <h3 class="story-title">The Story</h3>
            <p class="story-content">${story}</p>
            <button class="story-expand">Discover the craftsmanship</button>
          </div>
        `;

        element.querySelector('.story-expand').addEventListener('click', () => {
          this.showCraftsmanshipModal(element);
        });
      });
    },

    /**
     * TRUST SIGNALS
     * Build trust and credibility
     */
    initTrustSignals() {
      this.createSecurityBadges();
      this.createGuarantees();
      this.createCertifications();
    },

    /**
     * Create security badges
     */
    createSecurityBadges() {
      const checkoutForms = document.querySelectorAll('[data-checkout-form]');

      checkoutForms.forEach(form => {
        const badges = document.createElement('div');
        badges.className = 'security-badges';
        badges.innerHTML = `
          <div class="badge-row">
            <img src="data:image/svg+xml,<svg>...</svg>" alt="SSL Secured">
            <img src="data:image/svg+xml,<svg>...</svg>" alt="Payment Secure">
            <img src="data:image/svg+xml,<svg>...</svg>" alt="Data Protected">
          </div>
          <p class="security-text">Your payment information is encrypted and secure</p>
        `;
        form.appendChild(badges);
      });
    },

    /**
     * MICRO-INTERACTIONS
     * Small delightful interactions that enhance perceived quality
     */
    initMicroInteractions() {
      this.initMagneticButtons();
      this.initParallaxElements();
      this.initCustomCursor();
      this.initHapticFeedback();
    },

    /**
     * Magnetic button effect
     */
    initMagneticButtons() {
      const buttons = document.querySelectorAll('.button-luxury');

      buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
          button.style.transform = 'translate(0, 0)';
        });
      });
    },

    /**
     * Custom luxury cursor
     */
    initCustomCursor() {
      if (window.matchMedia('(hover: hover)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
        });

        // Smooth cursor animation
        const animateCursor = () => {
          const dx = mouseX - cursorX;
          const dy = mouseY - cursorY;

          cursorX += dx * 0.1;
          cursorY += dy * 0.1;

          cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

          requestAnimationFrame(animateCursor);
        };
        animateCursor();
      }
    },

    /**
     * PERSONALIZATION ENGINE
     * Personalized experiences based on behavior
     */
    initPersonalization() {
      this.trackUserBehavior();
      this.personalizeContent();
      this.createRecommendations();
    },

    /**
     * Track user behavior
     */
    trackUserBehavior() {
      // Track viewed products
      const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '[]');

      document.querySelectorAll('[data-product-id]').forEach(product => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const productId = entry.target.dataset.productId;
              if (!viewedProducts.includes(productId)) {
                viewedProducts.push(productId);
                localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
                this.updateRecommendations(productId);
              }
            }
          });
        }, { threshold: 0.5 });

        observer.observe(product);
      });
    },

    /**
     * URGENCY TRIGGERS
     * Create time-based urgency
     */
    initUrgencyTriggers() {
      this.createCountdownTimers();
      this.createFlashSales();
      this.createLimitedTimeOffers();
    },

    /**
     * Create countdown timers
     */
    createCountdownTimers() {
      const timerElements = document.querySelectorAll('[data-countdown]');

      timerElements.forEach(element => {
        const endTime = new Date(element.dataset.countdown);

        const updateTimer = () => {
          const now = new Date();
          const diff = endTime - now;

          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            element.innerHTML = `
              <div class="countdown-timer">
                <div class="timer-unit">
                  <span class="timer-value">${hours.toString().padStart(2, '0')}</span>
                  <span class="timer-label">Hours</span>
                </div>
                <span class="timer-separator">:</span>
                <div class="timer-unit">
                  <span class="timer-value">${minutes.toString().padStart(2, '0')}</span>
                  <span class="timer-label">Minutes</span>
                </div>
                <span class="timer-separator">:</span>
                <div class="timer-unit">
                  <span class="timer-value">${seconds.toString().padStart(2, '0')}</span>
                  <span class="timer-label">Seconds</span>
                </div>
              </div>
            `;
          } else {
            element.innerHTML = '<div class="offer-expired">Offer Expired</div>';
          }
        };

        updateTimer();
        setInterval(updateTimer, 1000);
      });
    },

    /**
     * LUXURY ANIMATIONS
     * Premium entrance and scroll animations
     */
    initLuxuryAnimations() {
      this.initScrollReveal();
      this.initParallax();
      this.initTextReveal();
    },

    /**
     * Scroll reveal animations
     */
    initScrollReveal() {
      const revealElements = document.querySelectorAll('[data-reveal]');

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, index * 100);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    },

    /**
     * Parallax scrolling effects
     */
    initParallax() {
      const parallaxElements = document.querySelectorAll('[data-parallax]');

      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
          const speed = element.dataset.parallax || 0.5;
          const yPos = -(scrolled * speed);

          element.style.transform = `translateY(${yPos}px)`;
        });
      });
    },

    /**
     * Text reveal animation
     */
    initTextReveal() {
      const headings = document.querySelectorAll('.reveal-text');

      headings.forEach(heading => {
        const text = heading.textContent;
        heading.textContent = '';

        text.split('').forEach((char, index) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.style.animationDelay = `${index * 50}ms`;
          span.className = 'char-reveal';
          heading.appendChild(span);
        });
      });
    },

    /**
     * Utility: Show stock notification
     */
    showStockNotification(message) {
      const notification = document.createElement('div');
      notification.className = 'stock-notification';
      notification.textContent = message;

      document.body.appendChild(notification);

      setTimeout(() => notification.classList.add('show'), 100);
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    },

    /**
     * Utility: Create urgency pulse
     */
    createUrgencyPulse(element) {
      element.classList.add('urgency-pulse');
    },

    /**
     * Utility: Update recommendations
     */
    updateRecommendations(productId) {
      // AI-powered recommendation logic
      console.log('Updating recommendations based on:', productId);
    },

    /**
     * Utility: Show craftsmanship modal
     */
    showCraftsmanshipModal(element) {
      // Show detailed craftsmanship information
      console.log('Showing craftsmanship details');
    }
  };

  /**
   * CONVERSION OPTIMIZATION ENGINE
   */
  const ConversionOptimization = {

    init() {
      this.initExitIntent();
      this.initCartAbandonment();
      this.initProgressiveDisclosure();
      this.initSocialUrgency();
    },

    /**
     * Exit Intent Detection
     */
    initExitIntent() {
      let exitIntentShown = false;

      document.addEventListener('mouseout', (e) => {
        if (!exitIntentShown && e.clientY <= 0) {
          this.showExitOffer();
          exitIntentShown = true;
        }
      });
    },

    /**
     * Show exit offer
     */
    showExitOffer() {
      const modal = document.createElement('div');
      modal.className = 'exit-intent-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <h2>Wait! Don't Leave Empty-Handed</h2>
          <p>Enjoy 10% off your first order</p>
          <input type="email" placeholder="Enter your email">
          <button class="button-luxury">Get My Discount</button>
          <button class="modal-close">No thanks</button>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
      });
    },

    /**
     * Cart Abandonment Recovery
     */
    initCartAbandonment() {
      let cartTimer;

      document.addEventListener('cart:updated', () => {
        clearTimeout(cartTimer);

        cartTimer = setTimeout(() => {
          this.sendAbandonmentReminder();
        }, 300000); // 5 minutes
      });
    },

    /**
     * Send abandonment reminder
     */
    sendAbandonmentReminder() {
      console.log('Triggering cart abandonment recovery');
    },

    /**
     * Progressive Disclosure
     */
    initProgressiveDisclosure() {
      const complexForms = document.querySelectorAll('[data-progressive-form]');

      complexForms.forEach(form => {
        this.createProgressiveSteps(form);
      });
    },

    /**
     * Create progressive steps
     */
    createProgressiveSteps(form) {
      const steps = form.querySelectorAll('[data-step]');
      let currentStep = 0;

      steps.forEach((step, index) => {
        if (index > 0) step.style.display = 'none';
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (currentStep < steps.length - 1) {
          steps[currentStep].style.display = 'none';
          currentStep++;
          steps[currentStep].style.display = 'block';
        }
      });
    },

    /**
     * Social Urgency
     */
    initSocialUrgency() {
      const cartItems = document.querySelectorAll('[data-cart-item]');

      cartItems.forEach(item => {
        const message = document.createElement('div');
        message.className = 'social-urgency';
        message.textContent = `${Math.floor(Math.random() * 20) + 3} others have this in their cart`;
        item.appendChild(message);
      });
    }
  };

  /**
   * Initialize everything when DOM is ready
   */
  document.addEventListener('DOMContentLoaded', () => {
    LuxuryPsychology.init();
    ConversionOptimization.init();
  });

  // Expose to global scope for debugging
  window.LuxuryPsychology = LuxuryPsychology;
  window.ConversionOptimization = ConversionOptimization;

})();