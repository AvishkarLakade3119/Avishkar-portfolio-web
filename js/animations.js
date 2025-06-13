// Advanced animations and scroll effects
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.scrollListeners = [];
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupTypewriterEffect();
        this.bindScrollEvents();
    }

    // Setup scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: [0, 0.1, 0.3, 0.5, 0.7, 1],
            rootMargin: '-10% 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                const animationType = element.dataset.animation || 'fadeInUp';
                const delay = parseInt(element.dataset.delay) || 0;
                const duration = parseInt(element.dataset.duration) || 600;

                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    setTimeout(() => {
                        this.triggerAnimation(element, animationType, duration);
                    }, delay);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(
            '.animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-scale, .animate-bounce'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Trigger specific animations
    triggerAnimation(element, type, duration = 600) {
        if (this.animations.has(element)) return;

        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        
        switch (type) {
            case 'fadeInUp':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
            case 'fadeInLeft':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'fadeInRight':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'scaleIn':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
            case 'bounceIn':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                element.style.animation = `bounceIn ${duration}ms ease-out`;
                break;
        }

        this.animations.set(element, type);
    }

    // Setup parallax effects for hero section
    setupParallaxEffects() {
        const heroSection = document.querySelector('.hero');
        const heroImage = document.querySelector('.hero-image');
        
        if (!heroSection || !heroImage) return;

        const parallaxListener = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        };

        this.scrollListeners.push(parallaxListener);
    }

    // Setup counter animations for stats
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            counter.textContent = '0';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(counter, target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        });
    }

    // Animate counter numbers
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current + (element.textContent.includes('+') ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Setup typewriter effect for hero title
    setupTypewriterEffect() {
        const titleElement = document.querySelector('.hero-title');
        if (!titleElement) return;

        const text = titleElement.textContent;
        const words = text.split(' ');
        titleElement.innerHTML = '';

        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + (index < words.length - 1 ? ' ' : '');
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.display = 'inline-block';
            span.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            titleElement.appendChild(span);

            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, index * 200 + 500);
        });
    }

    // Bind scroll events with throttling
    bindScrollEvents() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.scrollListeners.forEach(listener => listener());
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Add floating animation to cards
    setupFloatingCards() {
        const cards = document.querySelectorAll('.project-card, .timeline-item');
        
        cards.forEach((card, index) => {
            card.style.animation = `float 3s ease-in-out infinite`;
            card.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // Setup magnetic button effect
    setupMagneticButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }

    // Setup cursor trail effect
    setupCursorTrail() {
        if (window.innerWidth < 1024) return; // Skip on mobile/tablet

        const trail = [];
        const trailLength = 10;

        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i / trailLength};
                transition: all 0.1s ease-out;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }

        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateTrail = () => {
            let x = mouseX;
            let y = mouseY;

            trail.forEach((dot, index) => {
                const nextDot = trail[index + 1] || trail[0];
                
                x += (mouseX - x) * 0.3;
                y += (mouseY - y) * 0.3;

                dot.style.left = x + 'px';
                dot.style.top = y + 'px';
            });

            requestAnimationFrame(animateTrail);
        };

        animateTrail();
    }

    // Setup scroll progress indicator
    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 9999;
            transition: width 0.1s ease-out;
        `;
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        };

        this.scrollListeners.push(updateProgress);
    }

    // Clean up animations and event listeners
    destroy() {
        this.animations.clear();
        this.scrollListeners = [];
        
        // Remove cursor trail
        const trailElements = document.querySelectorAll('.cursor-trail');
        trailElements.forEach(el => el.remove());
        
        // Remove scroll progress
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) progressBar.remove();
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    
    // Setup additional effects
    setTimeout(() => {
        animationController.setupFloatingCards();
        animationController.setupMagneticButtons();
        animationController.setupCursorTrail();
        animationController.setupScrollProgress();
    }, 1000);
});

// CSS Keyframes for additional animations
const additionalStyles = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    @keyframes slideInFromBottom {
        0% { transform: translateY(100px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    
    .animate-pulse {
        animation: pulse 2s infinite;
    }
    
    .animate-slide-up {
        animation: slideInFromBottom 0.6s ease-out;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);