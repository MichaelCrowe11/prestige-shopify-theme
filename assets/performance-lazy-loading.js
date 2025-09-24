/**
 * Prestige Theme - Lazy Loading Module
 * Handles all lazy loading functionality
 */

export class LazyLoadingModule {
  constructor(config) {
    this.config = {
      lazyLoadOffset: 50,
      imageSizes: {
        mobile: 750,
        tablet: 1080,
        desktop: 1920
      },
      ...config
    };
  }

  init() {
    this.initLazyLoading();
    this.lazyLoadBackgrounds();
    this.lazyLoadIframes();
    this.initProgressiveImages();
  }

  initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        img.loading = 'lazy';
        delete img.dataset.src;
      });
    } else {
      this.initLazyLoadPolyfill();
    }
  }

  initLazyLoadPolyfill() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;

          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }

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

  initProgressiveImages() {
    document.querySelectorAll('[data-progressive-image]').forEach(container => {
      const lowQuality = container.querySelector('.progressive-image-placeholder');
      const highQuality = container.querySelector('.progressive-image-main');

      if (highQuality && lowQuality) {
        const img = new Image();
        img.src = highQuality.dataset.src;

        img.onload = () => {
          highQuality.src = img.src;
          highQuality.classList.add('loaded');

          setTimeout(() => {
            lowQuality.style.opacity = '0';
          }, 50);
        };
      }
    });
  }

  generateResponsiveImages() {
    document.querySelectorAll('img[data-responsive]').forEach(img => {
      const src = img.dataset.src || img.src;
      const srcset = [];

      Object.entries(this.config.imageSizes).forEach(([size, width]) => {
        const url = this.getResponsiveImageUrl(src, width);
        srcset.push(`${url} ${width}w`);
      });

      img.srcset = srcset.join(', ');
      img.sizes = img.dataset.sizes || '(max-width: 750px) 100vw, (max-width: 1080px) 50vw, 33vw';
    });
  }

  getResponsiveImageUrl(originalUrl, width) {
    if (originalUrl.includes('cdn.shopify.com')) {
      return originalUrl.replace(/(_\d+x\d+)?(\.\w+)$/, `_${width}x$2`);
    }
    return originalUrl;
  }
}