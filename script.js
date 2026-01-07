/* ===================================
   Portfolio Website JavaScript
   Handles navigation, dark mode, language switching, and interactions
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Dark Mode Toggle with Proper Icons
    // ===================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle.querySelector('i');
    const body = document.body;
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        updateDarkModeIcon(isDarkMode);
        
        // Save preference
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });
    
    // Update icon based on mode (sun for dark mode, moon for light mode)
    function updateDarkModeIcon(isDarkMode) {
        darkModeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // ===================================
    // Language Toggle (English/Arabic) with Full RTL/LTR
    // ===================================
    const languageToggle = document.getElementById('languageToggle');
    const langText = languageToggle.querySelector('.lang-text');
    let currentLang = localStorage.getItem('language') || 'en';
    
    // Apply saved language on load
    if (currentLang === 'ar') {
        switchToArabic();
    }
    
    // Toggle language
    languageToggle.addEventListener('click', function() {
        if (currentLang === 'en') {
            switchToArabic();
        } else {
            switchToEnglish();
        }
    });
    
    function switchToArabic() {
        currentLang = 'ar';
        
        // Set HTML direction and language
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        body.classList.add('rtl');
        
        // Update toggle button
        langText.textContent = 'EN';
        
        // Update all elements with data-ar attribute
        document.querySelectorAll('[data-ar]').forEach(element => {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = element.getAttribute('data-placeholder-ar');
            } else {
                element.textContent = element.getAttribute('data-ar');
            }
        });
        
        localStorage.setItem('language', 'ar');
    }
    
    function switchToEnglish() {
        currentLang = 'en';
        
        // Set HTML direction and language
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        body.classList.remove('rtl');
        
        // Update toggle button
        langText.textContent = 'AR';
        
        // Update all elements with data-en attribute
        document.querySelectorAll('[data-en]').forEach(element => {
            if (element.tagElement === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = element.getAttribute('data-placeholder-en');
            } else {
                element.textContent = element.getAttribute('data-en');
            }
        });
        
        localStorage.setItem('language', 'en');
    }
    
    // ===================================
    // Mobile Navigation Toggle
    // ===================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            const toggleSwitches = document.querySelector('.toggle-switches');
            const isClickOnToggles = toggleSwitches && toggleSwitches.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnToggles && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // ===================================
    // Smooth Scrolling with Offset
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // Navigation Background on Scroll
    // ===================================
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.boxShadow = '0 4px 20px rgba(43, 43, 43, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
        
        lastScrollY = window.scrollY;
    });
    
    // ===================================
    // Active Navigation Link Highlighting
    // ===================================
    const sections = document.querySelectorAll('.section');
    const navMenuLinks = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navMenuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // ===================================
    // Intersection Observer for Animation
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Observe skill tags
    document.querySelectorAll('.skill-tag').forEach((tag, index) => {
        tag.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(tag);
    });
    
    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
    
    // ===================================
    // Resume Download Button Tracking
    // ===================================
    const resumeButtons = document.querySelectorAll('a[download]');
    resumeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Log download event (useful for analytics)
            console.log('Resume download initiated:', this.getAttribute('href'));
            
            // In production, you might want to track this with analytics:
            // gtag('event', 'download', { 'event_category': 'resume' });
        });
    });
    
    // ===================================
    // Keyboard Navigation Enhancement
    // ===================================
    document.addEventListener('keydown', function(e) {
        // Allow Escape key to close mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            navToggle.focus();
        }
    });
    
    // ===================================
    // Scroll to Top on Page Load
    // ===================================
    window.addEventListener('load', function() {
        // Smooth scroll to top after page reload
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    });
    
    // ===================================
    // Performance: Lazy Loading Images
    // ===================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===================================
    // Update Current Year in Footer
    // ===================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // ===================================
    // Contact Cards Interaction
    // ===================================
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ===================================
    // Console Welcome Message
    // ===================================
    console.log('%c👋 Hello, fellow developer!', 'font-size: 20px; font-weight: bold; color: #8b7355;');
    console.log('%cInterested in the code? Check out the repository or get in touch!', 'font-size: 14px; color: #6b6b6b;');
    
});

// ===================================
// External Links - Open in New Tab
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        // Skip links that already have target attribute
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});

// ===================================
// Prevent Default on Hash Links Without Target
// ===================================
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
});
