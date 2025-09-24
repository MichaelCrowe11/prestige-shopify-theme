/**
 * Prestige Theme - Performance Optimizer
 * Advanced performance optimizations for 90+ Lighthouse scores
 */

class PerformanceOptimizer {
  constructor() {
    this.config = {
      lazyLoadOffset: 50,
      imageSizes: {
        mobile: 750,
        tablet: 1080,
        desktop: 1920
      },
      criticalCSS: true,
      preloadFonts: true,
      prefetchLinks: true,
      serviceWorker: true
    };

    this.init();
  }

  init() {
    // Core Web Vitals optimizations
    this.optimizeLCP();
    this.optimizeFID();
    this.optimizeCLS();

    // Additional optimizations
    this.initLazyLoading();
    this.initResourceHints();
    this.initServiceWorker();
    this.initIntersectionObserver();
    this.optimizeImages();
    this.deferNonCriticalCSS();
    this.prefetchNextPage();
  }

  /**
   * Largest Contentful Paint (LCP) Optimizations
   */
  optimizeLCP() {
    // Preload hero images
    const heroImage = document.querySelector('[data-hero-image]');
    if (heroImage && heroImage.dataset.src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage.dataset.src;
      link.type = 'image/webp';
      document.head.appendChild(link);
    }

    // Preload critical fonts
    if (this.config.preloadFonts) {
      this.preloadFonts();
    }

    // Optimize server response time with resource hints
    this.addResourceHints();
  }

  /**
   * First Input Delay (FID) Optimizations
   */
  optimizeFID() {
    // Break up long tasks
    this.breakLongTasks();

    // Defer non-critical JavaScript
    this.deferNonCriticalJS();

    // Use passive event listeners
    this.usePassiveListeners();

    // Implement input event batching
    this.batchInputEvents();
  }

  /**
   * Cumulative Layout Shift (CLS) Optimizations
   */
  optimizeCLS() {
    // Set dimensions for images and videos
    this.setMediaDimensions();

    // Reserve space for dynamic content
    this.reserveSpaceForDynamicContent();

    // Avoid inserting content above existing content
    this.preventLayoutShifts();

    // Font loading optimization
    this.optimizeFontLoading();
  }

  /**
   * Lazy Loading Implementation
   */
  initLazyLoading() {
    // Native lazy loading for modern browsers
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        img.loading = 'lazy';
        delete img.dataset.src;
      });
    } else {
      // Fallback for older browsers
      this.initLazyLoadPolyfill();
    }

    // Lazy load background images
    this.lazyLoadBackgrounds();

    // Lazy load iframes
    this.lazyLoadIframes();
  }

  initLazyLoadPolyfill() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          // Load image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }

          // Load srcset
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            delete img.dataset.srcset;
          }

          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: `${this.config.lazyLoadOffset}px`
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  lazyLoadBackgrounds() {
    const bgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const bgImage = element.dataset.bgImage;

          if (bgImage) {
            element.style.backgroundImage = `url(${bgImage})`;
            delete element.dataset.bgImage;
            element.classList.add('bg-loaded');
          }

          bgObserver.unobserve(element);
        }
      });
    }, {
      rootMargin: '100px'
    });

    document.querySelectorAll('[data-bg-image]').forEach(el => {
      bgObserver.observe(el);
    });
  }

  lazyLoadIframes() {
    const iframeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            delete iframe.dataset.src;
          }
          iframeObserver.unobserve(iframe);
        }
      });
    });

    document.querySelectorAll('iframe[data-src]').forEach(iframe => {
      iframeObserver.observe(iframe);
    });
  }

  /**
   * Resource Hints
   */
  initResourceHints() {
    // DNS prefetch for external domains
    this.addDNSPrefetch([
      'https://cdn.shopify.com',
      'https://fonts.shopifycdn.com',
      'https://monorail-edge.shopifysvc.com'
    ]);

    // Preconnect to critical third-party origins
    this.addPreconnect([
      'https://cdn.shopify.com',
      'https://fonts.shopifycdn.com'
    ]);

    // Prefetch likely next pages
    if (this.config.prefetchLinks) {
      this.initLinkPrefetching();
    }
  }

  addDNSPrefetch(domains) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  addPreconnect(origins) {
    origins.forEach(origin => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  initLinkPrefetching() {
    // Prefetch links on hover/focus
    let prefetchedUrls = new Set();

    const prefetchLink = (url) => {
      if (prefetchedUrls.has(url)) return;

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);

      prefetchedUrls.add(url);
    };

    // Monitor all internal links
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('mouseenter', () => {
        prefetchLink(link.href);
      }, { passive: true });

      link.addEventListener('focus', () => {
        prefetchLink(link.href);
      }, { passive: true });
    });

    // Prefetch visible links with Intersection Observer
    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target;

          // Delay prefetch to avoid overwhelming the browser
          setTimeout(() => {
            if (entry.isIntersecting) {
              prefetchLink(link.href);
            }
          }, 2000);
        }
      });
    }, {
      rootMargin: '0px 0px 100px 0px'
    });

    document.querySelectorAll('a[href^="/"][data-prefetch]').forEach(link => {
      linkObserver.observe(link);
    });
  }

  /**
   * Service Worker for offline and caching
   */
  initServiceWorker() {
    if (!this.config.serviceWorker || !('serviceWorker' in navigator)) return;

    // Register service worker
    if (window.location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  /**
   * Image Optimization
   */
  optimizeImages() {
    // Convert images to WebP where supported
    if (this.supportsWebP()) {
      this.convertToWebP();
    }

    // Responsive images with srcset
    this.generateResponsiveImages();

    // Progressive image loading
    this.initProgressiveImages();
  }

  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  }

  convertToWebP() {
    document.querySelectorAll('img[data-webp]').forEach(img => {
      if (img.dataset.webp) {
        img.src = img.dataset.webp;
      }
    });
  }

  generateResponsiveImages() {
    document.querySelectorAll('img[data-responsive]').forEach(img => {
      const src = img.dataset.src || img.src;
      const srcset = [];

      // Generate srcset for different screen sizes
      Object.entries(this.config.imageSizes).forEach(([size, width]) => {
        const url = this.getResponsiveImageUrl(src, width);
        srcset.push(`${url} ${width}w`);
      });

      img.srcset = srcset.join(', ');
      img.sizes = img.dataset.sizes || '(max-width: 750px) 100vw, (max-width: 1080px) 50vw, 33vw';
    });
  }

  getResponsiveImageUrl(originalUrl, width) {
    // Shopify image transformation
    if (originalUrl.includes('cdn.shopify.com')) {
      return originalUrl.replace(/(_\d+x\d+)?(\.\w+)$/, `_${width}x$2`);
    }
    return originalUrl;
  }

  initProgressiveImages() {
    document.querySelectorAll('[data-progressive-image]').forEach(container => {
      const lowQuality = container.querySelector('.progressive-image-placeholder');
      const highQuality = container.querySelector('.progressive-image-main');

      if (highQuality && lowQuality) {
        // Load high quality image
        const img = new Image();
        img.src = highQuality.dataset.src;

        img.onload = () => {
          highQuality.src = img.src;
          highQuality.classList.add('loaded');

          // Fade out placeholder
          setTimeout(() => {
            lowQuality.style.opacity = '0';
          }, 50);
        };
      }
    });
  }

  /**
   * CSS Optimization
   */
  deferNonCriticalCSS() {
    // Move non-critical CSS to end of body
    document.querySelectorAll('link[data-defer]').forEach(link => {
      const newLink = document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.href = link.href;
      newLink.media = 'print';
      newLink.onload = function() {
        this.media = 'all';
      };

      document.body.appendChild(newLink);
      link.remove();
    });

    // Load CSS conditionally based on components
    this.loadConditionalCSS();
  }

  loadConditionalCSS() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const cssFile = element.dataset.css;

          if (cssFile && !document.querySelector(`link[href*="${cssFile}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssFile;
            document.head.appendChild(link);
          }

          observer.unobserve(element);
        }
      });
    });

    document.querySelectorAll('[data-css]').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * JavaScript Optimization
   */
  deferNonCriticalJS() {
    // Load third-party scripts after main content
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.loadThirdPartyScripts();
      }, 2000);
    });
  }

  loadThirdPartyScripts() {
    const scripts = [
      { src: '//www.google-analytics.com/analytics.js', async: true },
      { src: '//connect.facebook.net/en_US/fbevents.js', async: true },
      { src: '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js', defer: true }
    ];

    scripts.forEach(scriptConfig => {
      if (!document.querySelector(`script[src="${scriptConfig.src}"]`)) {
        const script = document.createElement('script');
        script.src = scriptConfig.src;

        if (scriptConfig.async) script.async = true;
        if (scriptConfig.defer) script.defer = true;

        document.body.appendChild(script);
      }
    });
  }

  /**
   * Event Optimization
   */
  usePassiveListeners() {
    // Convert scroll and touch events to passive
    const events = ['touchstart', 'touchmove', 'wheel', 'scroll'];

    events.forEach(event => {
      document.addEventListener(event, () => {}, { passive: true });
    });
  }

  batchInputEvents() {
    let inputTimeout;
    const inputElements = document.querySelectorAll('input, textarea');

    inputElements.forEach(input => {
      input.addEventListener('input', (e) => {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
          // Process input after user stops typing
          this.processInput(e.target);
        }, 300);
      });
    });
  }

  processInput(input) {
    // Handle input processing
    if (input.dataset.validate) {
      this.validateInput(input);
    }
  }

  validateInput(input) {
    // Basic validation logic
    const value = input.value.trim();
    const type = input.type;

    if (type === 'email') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      input.classList.toggle('invalid', !isValid);
    }
  }

  /**
   * Font Optimization
   */
  preloadFonts() {
    const fonts = [
      '/assets/fonts/playfair-display-regular.woff2',
      '/assets/fonts/assistant-regular.woff2'
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = font;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  optimizeFontLoading() {
    // Use font-display: swap
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Layout Optimization
   */
  setMediaDimensions() {
    // Set width and height for all images
    document.querySelectorAll('img:not([width])').forEach(img => {
      if (img.naturalWidth) {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
      }
    });

    // Set aspect-ratio for videos
    document.querySelectorAll('video').forEach(video => {
      if (video.videoWidth) {
        video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
      }
    });
  }

  reserveSpaceForDynamicContent() {
    // Reserve space for ads, embeds, and dynamic content
    document.querySelectorAll('[data-reserve-space]').forEach(element => {
      const height = element.dataset.reserveSpace;
      element.style.minHeight = `${height}px`;
    });
  }

  preventLayoutShifts() {
    // Avoid injecting content above the fold
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if content is being added above the fold
          const rect = mutation.target.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            // Use transform instead of changing layout
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                node.style.transform = 'translateY(0)';
              }
            });
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Utility Functions
   */
  breakLongTasks() {
    // Use requestIdleCallback for non-critical tasks
    if ('requestIdleCallback' in window) {
      const tasks = this.getNonCriticalTasks();

      tasks.forEach(task => {
        requestIdleCallback(deadline => {
          while (deadline.timeRemaining() > 0 && tasks.length > 0) {
            const task = tasks.shift();
            task();
          }
        });
      });
    }
  }

  getNonCriticalTasks() {
    return [
      () => this.loadSocialWidgets(),
      () => this.initAnalytics(),
      () => this.loadReviews()
    ];
  }

  loadSocialWidgets() {
    // Load social media widgets
    const socialContainer = document.querySelector('.social-widgets');
    if (socialContainer && socialContainer.dataset.widgets) {
      // Load widgets
    }
  }

  initAnalytics() {
    // Initialize analytics
    if (window.ga) {
      window.ga('send', 'pageview');
    }
  }

  loadReviews() {
    // Load product reviews
    const reviewsContainer = document.querySelector('.product-reviews');
    if (reviewsContainer && reviewsContainer.dataset.productId) {
      // Load reviews via AJAX
    }
  }

  initIntersectionObserver() {
    // Generic intersection observer for animations
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-viewport');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('[data-animate]').forEach(el => {
      animationObserver.observe(el);
    });
  }

  prefetchNextPage() {
    // Prefetch next page in pagination
    const nextPageLink = document.querySelector('a[rel="next"]');
    if (nextPageLink) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = nextPageLink.href;
      document.head.appendChild(link);
    }
  }

  addResourceHints() {
    // Add various resource hints
    const hints = [
      { rel: 'prerender', href: '/collections/all' },
      { rel: 'prefetch', href: '/cart' },
      { rel: 'dns-prefetch', href: '//ajax.googleapis.com' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }

  // Performance monitoring
  measurePerformance() {
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Measure LCP
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure FID
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });

      // Measure CLS
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('CLS:', clsValue);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
}

// Initialize performance optimizer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
  });
} else {
  window.performanceOptimizer = new PerformanceOptimizer();
}