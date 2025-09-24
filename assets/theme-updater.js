/**
 * Prestige Theme - Update Checker
 * Checks for theme updates and notifies merchants
 */

class ThemeUpdater {
  constructor() {
    this.currentVersion = '1.0.0';
    this.updateCheckUrl = 'https://prestige-theme.com/api/version-check';
    this.updateInterval = 86400000; // 24 hours
    this.lastCheckKey = 'prestige_last_update_check';
    this.init();
  }

  init() {
    // Only run in admin context
    if (this.isAdminContext()) {
      this.checkForUpdates();
    }
  }

  isAdminContext() {
    return window.Shopify && window.Shopify.designMode;
  }

  async checkForUpdates() {
    const lastCheck = localStorage.getItem(this.lastCheckKey);
    const now = Date.now();

    // Check if we should check for updates
    if (lastCheck && (now - parseInt(lastCheck)) < this.updateInterval) {
      return;
    }

    try {
      const response = await fetch(this.updateCheckUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_version: this.currentVersion,
          store_domain: window.Shopify.shop,
          theme_id: window.Shopify.theme.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.handleUpdateResponse(data);
      }

      localStorage.setItem(this.lastCheckKey, now.toString());
    } catch (error) {
      console.error('Theme update check failed:', error);
    }
  }

  handleUpdateResponse(data) {
    if (data.update_available && data.latest_version !== this.currentVersion) {
      this.showUpdateNotification(data);
    }
  }

  showUpdateNotification(data) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'theme-update-notification';
    notification.innerHTML = `
      <div class="theme-update-notification__content">
        <div class="theme-update-notification__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>
        <div class="theme-update-notification__message">
          <strong>Theme Update Available!</strong>
          <p>Version ${data.latest_version} is now available with ${data.improvements || 'new features and improvements'}.</p>
        </div>
        <div class="theme-update-notification__actions">
          <button class="theme-update-notification__button theme-update-notification__button--primary" onclick="window.open('${data.download_url || 'https://prestige-theme.com/updates'}', '_blank')">
            View Update
          </button>
          <button class="theme-update-notification__button theme-update-notification__button--secondary" onclick="this.closest('.theme-update-notification').remove()">
            Dismiss
          </button>
        </div>
      </div>
    `;

    // Add styles
    const styles = `
      <style>
        .theme-update-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          padding: 20px;
          max-width: 400px;
          z-index: 10000;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .theme-update-notification__content {
          display: flex;
          gap: 15px;
          align-items: start;
        }

        .theme-update-notification__icon {
          color: #4CAF50;
          flex-shrink: 0;
        }

        .theme-update-notification__message {
          flex: 1;
        }

        .theme-update-notification__message strong {
          display: block;
          margin-bottom: 5px;
          font-size: 16px;
        }

        .theme-update-notification__message p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .theme-update-notification__actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .theme-update-notification__button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .theme-update-notification__button--primary {
          background: #4CAF50;
          color: white;
        }

        .theme-update-notification__button--primary:hover {
          background: #45a049;
        }

        .theme-update-notification__button--secondary {
          background: #f0f0f0;
          color: #333;
        }

        .theme-update-notification__button--secondary:hover {
          background: #e0e0e0;
        }
      </style>
    `;

    // Inject styles if not already present
    if (!document.querySelector('#theme-update-styles')) {
      const styleElement = document.createElement('div');
      styleElement.id = 'theme-update-styles';
      styleElement.innerHTML = styles;
      document.head.appendChild(styleElement.firstElementChild);
    }

    // Add notification to page
    document.body.appendChild(notification);

    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 30000);
  }

  // Manual update check method
  manualCheck() {
    localStorage.removeItem(this.lastCheckKey);
    this.checkForUpdates();
  }
}

// Initialize theme updater
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeUpdater = new ThemeUpdater();
  });
} else {
  window.themeUpdater = new ThemeUpdater();
}