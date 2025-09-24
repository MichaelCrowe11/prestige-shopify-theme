/**
 * Prestige Theme - Core Web Vitals Module
 * Optimizes LCP, FID, and CLS metrics
 */

export class CoreVitalsModule {
  constructor(config) {
    this.config = {
      preloadFonts: true,
      criticalCSS: true,
      ...config
    };
  }

  init() {
    this.optimizeLCP();
    this.optimizeFID();
    this.optimizeCLS();
    this.measurePerformance();
  }

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

    if (this.config.preloadFonts) {
      this.preloadFonts();
    }

    this.addResourceHints();
  }

  optimizeFID() {
    this.breakLongTasks();
    this.deferNonCriticalJS();
    this.usePassiveListeners();
    this.batchInputEvents();
  }

  optimizeCLS() {
    this.setMediaDimensions();
    this.reserveSpaceForDynamicContent();
    this.preventLayoutShifts();
    this.optimizeFontLoading();
  }

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
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  setMediaDimensions() {
    document.querySelectorAll('img:not([width])').forEach(img => {
      if (img.naturalWidth) {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;
      }
    });

    document.querySelectorAll('video').forEach(video => {
      if (video.videoWidth) {
        video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
      }
    });
  }

  reserveSpaceForDynamicContent() {
    document.querySelectorAll('[data-reserve-space]').forEach(element => {
      const height = element.dataset.reserveSpace;
      element.style.minHeight = `${height}px`;
    });
  }

  preventLayoutShifts() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const rect = mutation.target.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
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

  breakLongTasks() {
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
    const socialContainer = document.querySelector('.social-widgets');
    if (socialContainer && socialContainer.dataset.widgets) {
      // Load widgets
    }
  }

  initAnalytics() {
    if (window.ga) {
      window.ga('send', 'pageview');
    }
  }

  loadReviews() {
    const reviewsContainer = document.querySelector('.product-reviews');
    if (reviewsContainer && reviewsContainer.dataset.productId) {
      // Load reviews via AJAX
    }
  }

  deferNonCriticalJS() {
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

  usePassiveListeners() {
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
          this.processInput(e.target);
        }, 300);
      });
    });
  }

  processInput(input) {
    if (input.dataset.validate) {
      this.validateInput(input);
    }
  }

  validateInput(input) {
    const value = input.value.trim();
    const type = input.type;

    if (type === 'email') {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      input.classList.toggle('invalid', !isValid);
    }
  }

  addResourceHints() {
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