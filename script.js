/**
 * ISKCON Temple Website - Multi-Language Translation System
 * Supports: English, Telugu, Tamil, Hindi
 */

class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('preferredLanguage') || 'en';
    this.translations = {};
    this.init();
  }

  async init() {
    // Load translation file for current language
    await this.loadTranslations(this.currentLang);
    this.updateContent();
    this.setupLanguageSelector();
  }

  async loadTranslations(lang) {
    try {
      const response = await fetch(`./translations/${lang}.json`);
      this.translations[lang] = await response.json();
    } catch (error) {
      console.error(`Failed to load ${lang} translations:`, error);
      // Fallback to English if loading fails
      if (lang !== 'en') {
        await this.loadTranslations('en');
        this.currentLang = 'en';
      }
    }
  }

  setupLanguageSelector() {
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.value = this.currentLang;
      selector.addEventListener('change', async (e) => {
        const newLang = e.target.value;
        await this.changeLanguage(newLang);
      });
    }
  }

  async changeLanguage(lang) {
    if (!this.translations[lang]) {
      await this.loadTranslations(lang);
    }
    this.currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    this.updateContent();
    
    // Add smooth transition effect
    document.body.style.opacity = '0.7';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 200);
  }

  updateContent() {
    const t = this.translations[this.currentLang];
    if (!t) return;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const value = this.getNestedValue(t, key);
      
      if (value) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = value;
        } else {
          element.textContent = value;
        }
      }
    });

    // Update elements with data-i18n-html (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const value = this.getNestedValue(t, key);
      if (value) {
        element.innerHTML = value;
      }
    });

    // Update document title and meta
    document.title = `${t.header.logo} | Bhagavad Gita Seva`;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  t(key) {
    return this.getNestedValue(this.translations[this.currentLang], key) || key;
  }
}

// Initialize i18n when DOM is ready
let i18n;
document.addEventListener('DOMContentLoaded', () => {
  i18n = new I18n();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}

