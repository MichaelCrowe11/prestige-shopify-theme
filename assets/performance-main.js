/**
 * Prestige Theme - Performance Main
 * Orchestrates all performance modules
 */

import { LazyLoadingModule } from './performance-lazy-loading.js';
import { CoreVitalsModule } from './performance-core-vitals.js';

class PerformanceOptimizer {
  constructor() {
    const perf = (window.theme && window.theme.performance) || {};
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
      serviceWorker: !!perf.serviceWorker,
      enableCoreVitals: perf.coreVitals !== false,
      enableLazyLoading: perf.lazyLoading !== false,
      deferThirdParty: perf.deferThirdParty !== false
    };

    this.modules = {};
    if (this.config.enableLazyLoading) this.modules.lazyLoading = new LazyLoadingModule(this.config);
    if (this.config.enableCoreVitals) this.modules.coreVitals = new CoreVitalsModule(this.config);

    this.init();
  }

  init() {
    // Initialize all modules
    Object.values(this.modules).forEach(module => module.init());

    // Additional optimizations
    this.initResourceHints();
    this.initServiceWorker();
    this.initIntersectionObserver();
    this.optimizeImages();
    this.deferNonCriticalCSS();
    this.prefetchNextPage();
  }

  initResourceHints() {
    this.addDNSPrefetch([
      'https://cdn.shopify.com',
      'https://fonts.shopifycdn.com',
      'https://monorail-edge.shopifysvc.com'
    ]);

    this.addPreconnect([
      'https://cdn.shopify.com',
      'https://fonts.shopifycdn.com'
    ]);

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
    let prefetchedUrls = new Set();

    const prefetchLink = (url) => {
      if (prefetchedUrls.has(url)) return;

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);

      prefetchedUrls.add(url);
    };

    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('mouseenter', () => {
        prefetchLink(link.href);
      }, { passive: true });

      link.addEventListener('focus', () => {
        prefetchLink(link.href);
      }, { passive: true });
    });

    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target;
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

  initServiceWorker() {
  if (!this.config.serviceWorker || !('serviceWorker' in navigator)) return;

    if (window.location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          // Service Worker registered successfully
        })
        .catch(error => {
          // Service Worker registration failed
        });
    }
  }

  optimizeImages() {
    if (this.supportsWebP()) {
      this.convertToWebP();
    }
    if (this.modules.lazyLoading) {
      this.modules.lazyLoading.generateResponsiveImages();
    }
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

  deferNonCriticalCSS() {
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

  initIntersectionObserver() {
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
    const nextPageLink = document.querySelector('a[rel="next"]');
    if (nextPageLink) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = nextPageLink.href;
      document.head.appendChild(link);
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