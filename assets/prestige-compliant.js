/**
 * Prestige Theme - Shopify Compliant Psychology System
 * Implements ethical psychological principles within Shopify guidelines
 * Author: Michael Benjamin Crowe
 * Version: 2.1.0 - Theme Store Compliant
 */

(function() {
  'use strict';

  /**
   * SHOPIFY-COMPLIANT LUXURY PSYCHOLOGY
   * Ethical psychological triggers that enhance UX without deception
   */
  const CompliantLuxuryPsychology = {

    init() {
      this.initTypographyEnhancements();
      this.initColorPsychology();
      this.initSophisticatedAnimations();
      this.initAccessibleInteractions();
      this.initPerformanceOptimizations();
      this.initLuxuryComponents();
    },

    /**
     * TYPOGRAPHY PSYCHOLOGY
     * Research-based typography that conveys luxury
     */
    initTypographyEnhancements() {
      // Apply golden ratio scaling to dynamic text
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        heading.style.letterSpacing = '-0.02em';
        heading.style.fontWeight = '300';
      });

      // Enhance readability with optimal line heights
      const bodyText = document.querySelectorAll('p, .rte');
      bodyText.forEach(text => {
        text.style.lineHeight = '1.7';
      });
    },

    /**
     * COLOR PSYCHOLOGY
     * Implement research-based color psychology
     */
    initColorPsychology() {
      // Add subtle color interactions for engagement
      document.addEventListener('click', (e) => {
        if (e.target.matches('.button, .product-card, a')) {
          this.createColorRipple(e.target, e);
        }
      });
    },

    /**
     * Create subtle color ripple effect
     */
    createColorRipple(element, event) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';

      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple 600ms ease-out;
      `;

      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    },

    /**
     * SOPHISTICATED ANIMATIONS
     * Premium animations that enhance perceived quality
     */
    initSophisticatedAnimations() {
      this.initScrollReveal();
      this.initParallaxScroll();
      this.initSmoothTransitions();
    },

    /**
     * Scroll-triggered reveals with Intersection Observer
     */
    initScrollReveal() {
      const revealElements = document.querySelectorAll(
        '.product-card, .section-header, .hero-content, h1, h2, h3'
      );

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
      });
    },

    /**
     * Subtle parallax scrolling for depth
     */
    initParallaxScroll() {
      const parallaxElements = document.querySelectorAll('[data-parallax]');

      if (parallaxElements.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let ticking = false;

        const updateParallax = () => {
          const scrolled = window.pageYOffset;

          parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
          });

          ticking = false;
        };

        window.addEventListener('scroll', () => {
          if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
          }
        });
      }
    },

    /**
     * Smooth hover transitions
     */
    initSmoothTransitions() {
      const hoverElements = document.querySelectorAll(
        '.product-card, .button, .card, a'
      );

      hoverElements.forEach(element => {
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    },

    /**
     * ACCESSIBLE INTERACTIONS
     * Premium interactions that work for everyone
     */
    initAccessibleInteractions() {
      this.initKeyboardNavigation();
      this.initFocusManagement();
      this.initReducedMotion();
    },

    /**
     * Enhanced keyboard navigation
     */
    initKeyboardNavigation() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-nav');
        }
      });

      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
      });
    },

    /**
     * Proper focus management
     */
    initFocusManagement() {
      const focusableElements = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-modal-open]')) {
          const modalId = e.target.dataset.modalOpen;
          const modal = document.querySelector(`[data-modal="${modalId}"]`);

          if (modal) {
            const firstFocusable = modal.querySelector(focusableElements);
            if (firstFocusable) {
              setTimeout(() => firstFocusable.focus(), 100);
            }
          }
        }
      });
    },

    /**
     * Respect reduced motion preferences
     */
    initReducedMotion() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const style = document.createElement('style');
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `;
        document.head.appendChild(style);
      }
    },

    /**
     * PERFORMANCE OPTIMIZATIONS
     * Ensure Theme Store performance requirements
     */
    initPerformanceOptimizations() {
      this.initLazyLoading();
      this.initImageOptimization();
      this.initCriticalResourcePriority();
    },

    /**
     * Lazy loading for images
     */
    initLazyLoading() {
      if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
      }
    },

    /**
     * Image optimization hints
     */
    initImageOptimization() {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.getAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      });
    },

    /**
     * Critical resource priority
     */
    initCriticalResourcePriority() {
      // Preload critical fonts
      const criticalFonts = [
        'playfair-display-v30-latin-regular.woff2',
        'assistant-v18-latin-regular.woff2'
      ];

      criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = `{{ '${font}' | asset_url }}`;
        document.head.appendChild(link);
      });
    },

    /**
     * LUXURY COMPONENTS
     * Premium UI components that enhance UX
     */
    initLuxuryComponents() {
      this.initPremiumButtons();
      this.initElegantModals();
      this.initSophisticatedForms();
    },

    /**
     * Premium button interactions
     */
    initPremiumButtons() {
      const buttons = document.querySelectorAll('.button, [type="submit"]');

      buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });

        button.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
          this.style.boxShadow = 'none';
        });

        button.addEventListener('mousedown', function() {
          this.style.transform = 'translateY(0)';
        });

        button.addEventListener('mouseup', function() {
          this.style.transform = 'translateY(-2px)';
        });
      });
    },

    /**
     * Elegant modal interactions
     */
    initElegantModals() {
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-modal-open]')) {
          const modalId = e.target.dataset.modalOpen;
          this.openModal(modalId);
        }

        if (e.target.matches('[data-modal-close]') || e.target.classList.contains('modal-overlay')) {
          this.closeModal(e.target.closest('.modal'));
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openModal = document.querySelector('.modal.is-open');
          if (openModal) {
            this.closeModal(openModal);
          }
        }
      });
    },

    /**
     * Open modal with elegant animation
     */
    openModal(modalId) {
      const modal = document.querySelector(`[data-modal="${modalId}"]`);
      if (modal) {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        // Animate in
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';

        requestAnimationFrame(() => {
          modal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          modal.style.opacity = '1';
          modal.style.transform = 'scale(1)';
        });
      }
    },

    /**
     * Close modal with elegant animation
     */
    closeModal(modal) {
      if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';

        setTimeout(() => {
          modal.classList.remove('is-open');
          document.body.style.overflow = '';
        }, 300);
      }
    },

    /**
     * Sophisticated form enhancements
     */
    initSophisticatedForms() {
      const inputs = document.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          this.parentElement.classList.add('is-focused');
        });

        input.addEventListener('blur', function() {
          this.parentElement.classList.remove('is-focused');
          if (this.value) {
            this.parentElement.classList.add('has-value');
          } else {
            this.parentElement.classList.remove('has-value');
          }
        });

        // Initialize state
        if (input.value) {
          input.parentElement.classList.add('has-value');
        }
      });
    },

    /**
     * REAL-TIME STOCK DISPLAY (HONEST)
     * Show actual inventory levels if available
     */
    initHonestStockDisplay() {
      const stockElements = document.querySelectorAll('[data-variant-stock]');

      stockElements.forEach(element => {
        const stock = parseInt(element.dataset.variantStock);

        if (stock <= 5 && stock > 0) {
          element.innerHTML = `
            <div class="stock-level stock-level--low">
              <span class="stock-icon">⚡</span>
              <span>Only ${stock} left</span>
            </div>
          `;
        } else if (stock > 5) {
          element.innerHTML = `
            <div class="stock-level stock-level--available">
              <span class="stock-icon">✓</span>
              <span>In stock</span>
            </div>
          `;
        } else {
          element.innerHTML = `
            <div class="stock-level stock-level--out">
              <span class="stock-icon">○</span>
              <span>Out of stock</span>
            </div>
          `;
        }
      });
    },

    /**
     * LEGITIMATE SOCIAL PROOF
     * Show real reviews and ratings
     */
    initLegitimateReviews() {
      const reviewElements = document.querySelectorAll('[data-product-reviews]');

      reviewElements.forEach(element => {
        const rating = parseFloat(element.dataset.rating || 0);
        const reviewCount = parseInt(element.dataset.reviewCount || 0);

        if (rating > 0 && reviewCount > 0) {
          element.innerHTML = this.renderStarRating(rating, reviewCount);
        }
      });
    },

    /**
     * Render star rating display
     */
    renderStarRating(rating, count) {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

      let stars = '';

      // Full stars
      for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star star--full">★</span>';
      }

      // Half star
      if (hasHalfStar) {
        stars += '<span class="star star--half">☆</span>';
      }

      // Empty stars
      for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star star--empty">☆</span>';
      }

      return `
        <div class="product-reviews">
          <div class="star-rating">${stars}</div>
          <span class="review-count">(${count} review${count !== 1 ? 's' : ''})</span>
        </div>
      `;
    }
  };

  /**
   * Initialize when DOM is ready
   */
  document.addEventListener('DOMContentLoaded', () => {
    CompliantLuxuryPsychology.init();
  });

  // Expose for debugging (Theme Store allows this)
  window.CompliantLuxuryPsychology = CompliantLuxuryPsychology;

})();

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }

  .stock-level {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .stock-level--low {
    color: #f57c00;
  }

  .stock-level--available {
    color: #2e7d32;
  }

  .stock-level--out {
    color: #b71c1c;
  }

  .star {
    color: #d4af37;
    font-size: 1rem;
  }

  .star--empty {
    opacity: 0.3;
  }

  .star--half {
    background: linear-gradient(90deg, #d4af37 50%, transparent 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .product-reviews {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }

  .review-count {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }

  .keyboard-nav *:focus {
    outline: 2px solid var(--color-accent) !important;
    outline-offset: 2px;
  }

  .form__field.is-focused label {
    color: var(--color-accent);
  }

  .form__field.has-value input,
  .form__field.has-value textarea {
    border-color: var(--color-accent);
  }
`;
document.head.appendChild(style);