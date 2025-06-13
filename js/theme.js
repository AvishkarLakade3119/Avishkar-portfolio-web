// Theme management system
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupThemeToggle();
        this.watchSystemTheme();
        this.handleThemeTransitions();
    }

    // Load saved theme from localStorage or system preference
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            this.currentTheme = this.prefersDark.matches ? 'dark' : 'light';
        }
        
        this.applyTheme(this.currentTheme);
    }

    // Apply theme to document
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.updateThemeToggle();
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme }
        }));
    }

    // Toggle between light and dark themes
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    // Update theme toggle button state
    updateThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const sunIcon = themeToggle.querySelector('.sun');
        const moonIcon = themeToggle.querySelector('.moon');
        
        if (this.currentTheme === 'dark') {
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
            sunIcon.style.opacity = '0';
            sunIcon.style.transform = 'translate(-50%, -50%) rotate(-90deg)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        } else {
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'translate(-50%, -50%) rotate(0deg)';
            moonIcon.style.opacity = '0';
            moonIcon.style.transform = 'translate(-50%, -50%) rotate(90deg)';
        }
    }

    // Setup theme toggle button
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
            this.addToggleAnimation(themeToggle);
        });

        // Handle keyboard navigation
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
                this.addToggleAnimation(themeToggle);
            }
        });

        this.updateThemeToggle();
    }

    // Add animation to theme toggle
    addToggleAnimation(button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    // Watch for system theme changes
    watchSystemTheme() {
        this.prefersDark.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
            }
        });
    }

    // Handle smooth theme transitions
    handleThemeTransitions() {
        // Add transition styles for smooth theme switching
        const transitionStyle = document.createElement('style');
        transitionStyle.textContent = `
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
            
            *:before,
            *:after {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
            }
        `;
        
        document.head.appendChild(transitionStyle);

        // Remove transitions after theme change to avoid interfering with other animations
        window.addEventListener('themeChange', () => {
            setTimeout(() => {
                transitionStyle.remove();
            }, 300);
        });
    }

    // Get current theme
    getTheme() {
        return this.currentTheme;
    }

    // Set specific theme
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }

    // Auto theme based on time
    setupAutoTheme() {
        const hour = new Date().getHours();
        const isNightTime = hour < 7 || hour > 19;
        
        if (!localStorage.getItem('theme')) {
            this.applyTheme(isNightTime ? 'dark' : 'light');
        }
    }

    // Theme-aware image loading
    setupThemeAwareImages() {
        const images = document.querySelectorAll('[data-light-src][data-dark-src]');
        
        const updateImages = () => {
            images.forEach(img => {
                const src = this.currentTheme === 'dark' 
                    ? img.dataset.darkSrc 
                    : img.dataset.lightSrc;
                    
                if (img.src !== src) {
                    img.src = src;
                }
            });
        };

        window.addEventListener('themeChange', updateImages);
        updateImages(); // Initial setup
    }

    // Setup theme persistence across tabs
    setupCrossTabSync() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme' && e.newValue !== this.currentTheme) {
                this.applyTheme(e.newValue);
            }
        });
    }

    // High contrast mode detection
    setupHighContrastMode() {
        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
        
        const updateContrast = () => {
            document.documentElement.classList.toggle('high-contrast', highContrastQuery.matches);
        };

        highContrastQuery.addEventListener('change', updateContrast);
        updateContrast();
    }

    // Reduced motion detection
    setupReducedMotion() {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const updateMotion = () => {
            document.documentElement.classList.toggle('reduced-motion', reducedMotionQuery.matches);
        };

        reducedMotionQuery.addEventListener('change', updateMotion);
        updateMotion();
    }

    // Color scheme meta tag update
    updateColorSchemeMeta() {
        let metaTag = document.querySelector('meta[name="color-scheme"]');
        
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'color-scheme';
            document.head.appendChild(metaTag);
        }
        
        metaTag.content = this.currentTheme === 'dark' ? 'dark light' : 'light dark';
    }

    // Setup theme status for screen readers
    setupA11yAnnouncements() {
        window.addEventListener('themeChange', (e) => {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = `Switched to ${e.detail.theme} mode`;
            
            document.body.appendChild(announcement);
            
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        });
    }
}

// Enhanced theme functionality
class EnhancedThemeManager extends ThemeManager {
    constructor() {
        super();
        this.setupAdvancedFeatures();
    }

    setupAdvancedFeatures() {
        this.setupAutoTheme();
        this.setupThemeAwareImages();
        this.setupCrossTabSync();
        this.setupHighContrastMode();
        this.setupReducedMotion();
        this.setupA11yAnnouncements();
        this.updateColorSchemeMeta();
        
        // Update meta tag on theme change
        window.addEventListener('themeChange', () => {
            this.updateColorSchemeMeta();
        });
    }

    // Add theme preference to user settings
    saveUserPreference() {
        const preferences = {
            theme: this.currentTheme,
            autoTheme: false,
            timestamp: Date.now()
        };
        
        localStorage.setItem('userThemePreferences', JSON.stringify(preferences));
    }

    // Load user preferences
    loadUserPreferences() {
        try {
            const preferences = JSON.parse(localStorage.getItem('userThemePreferences'));
            if (preferences && preferences.theme) {
                return preferences;
            }
        } catch (error) {
            console.warn('Failed to load theme preferences:', error);
        }
        return null;
    }
}

// Initialize theme management
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new EnhancedThemeManager();
});

// Expose theme toggle function globally for potential external use
window.toggleTheme = () => {
    if (window.themeManager) {
        window.themeManager.toggleTheme();
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, EnhancedThemeManager };
}