/* ===================================
   Portfolio Website JavaScript
   Enhanced: Bug fixes + animations
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // Dark Mode Toggle
    // ===================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle.querySelector('i');
    const body = document.body;

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        body.classList.add('dark-mode');
        updateDarkModeIcon(true);
    }

    darkModeToggle.addEventListener('click', function () {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        updateDarkModeIcon(isDarkMode);
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });

    function updateDarkModeIcon(isDarkMode) {
        darkModeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ===================================
    // Language Toggle (BUG FIX: tagElement → tagName)
    // ===================================
    const languageToggle = document.getElementById('languageToggle');
    const langText = languageToggle.querySelector('.lang-text');
    let currentLang = localStorage.getItem('language') || 'en';

    if (currentLang === 'ar') {
        switchToArabic();
    }

    languageToggle.addEventListener('click', function () {
        if (currentLang === 'en') {
            switchToArabic();
        } else {
            switchToEnglish();
        }
    });

    function switchToArabic() {
        currentLang = 'ar';
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        body.classList.add('rtl');
        langText.textContent = 'EN';
        document.querySelectorAll('[data-ar]').forEach(element => {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = element.getAttribute('data-placeholder-ar') || '';
            } else {
                element.textContent = element.getAttribute('data-ar');
            }
        });
        localStorage.setItem('language', 'ar');
    }

    function switchToEnglish() {
        currentLang = 'en';
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        body.classList.remove('rtl');
        langText.textContent = 'AR';
        document.querySelectorAll('[data-en]').forEach(element => {
            // BUG FIX: was element.tagElement (typo)
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = element.getAttribute('data-placeholder-en') || '';
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
        navToggle.addEventListener('click', function () {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', function (event) {
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
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ===================================
    // Navigation: Scroll Shrink + Shadow
    // ===================================
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 80) {
            nav.style.boxShadow = '0 4px 20px rgba(43, 43, 43, 0.12)';
            nav.style.height = '64px';
        } else {
            nav.style.boxShadow = 'none';
            nav.style.height = '80px';
        }
    });

    // ===================================
    // Active Navigation Link Highlighting
    // ===================================
    const sections = document.querySelectorAll('.section');
    const navMenuLinks = document.querySelectorAll('.nav-menu a');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= (section.offsetTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        navMenuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Run on load

    // ===================================
    // Intersection Observer - Sections & Cards
    // BUG FIX: Sections were animating via CSS before observer could fire
    // ===================================
    const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -60px 0px' };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    // Prep sections (override CSS fadeInUp which fires immediately)
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(section);
    });

    // Skill tags with staggered pop-in
    document.querySelectorAll('.skill-tag').forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px) scale(0.9)';
        tag.style.transition = `opacity 0.4s ease ${index * 0.045}s, transform 0.4s ease ${index * 0.045}s`;
        observer.observe(tag);
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(item);
    });

    // Highlight items
    document.querySelectorAll('.highlight-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // ===================================
    // Hero Typewriter Effect on Subtitle
    // ===================================
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const enText = 'Computer Engineer';
        const arText = 'مهندس حاسوب';
        let typeIndex = 0;
        let isDeleting = false;
        let typeTimeout;

        function typeWrite() {
            const isAr = currentLang === 'ar';
            const fullText = isAr ? arText : enText;

            if (!isDeleting) {
                heroSubtitle.textContent = fullText.substring(0, typeIndex + 1);
                typeIndex++;
                if (typeIndex === fullText.length) {
                    isDeleting = false;
                    typeTimeout = setTimeout(typeWrite, 3000); // pause
                    return;
                }
            } else {
                heroSubtitle.textContent = fullText.substring(0, typeIndex - 1);
                typeIndex--;
                if (typeIndex === 0) {
                    isDeleting = false;
                    typeTimeout = setTimeout(typeWrite, 400);
                    return;
                }
            }
            typeTimeout = setTimeout(typeWrite, isDeleting ? 60 : 90);
        }

        // Start after hero fade-in completes
        setTimeout(() => {
            heroSubtitle.textContent = '';
            typeWrite();
        }, 1200);

        // Restart on language switch
        languageToggle.addEventListener('click', () => {
            clearTimeout(typeTimeout);
            typeIndex = 0;
            isDeleting = false;
            setTimeout(() => {
                heroSubtitle.textContent = '';
                typeWrite();
            }, 200);
        });
    }

    // ===================================
    // Hero Floating Particles
    // ===================================
    const hero = document.querySelector('.hero');
    if (hero) {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.35';
        hero.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animFrame;

        function resizeCanvas() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function getAccentColor() {
            return getComputedStyle(document.documentElement)
                .getPropertyValue('--color-accent').trim() || '#8b7355';
        }

        for (let i = 0; i < 28; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2.5 + 0.8,
                dx: (Math.random() - 0.5) * 0.35,
                dy: (Math.random() - 0.5) * 0.35,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const color = getAccentColor();
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            ctx.globalAlpha = 1;
            animFrame = requestAnimationFrame(drawParticles);
        }

        drawParticles();

        // Pause particles when hero not visible (perf)
        const heroObs = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) {
                cancelAnimationFrame(animFrame);
            } else {
                drawParticles();
            }
        }, { threshold: 0 });
        heroObs.observe(hero);
    }

    // ===================================
    // Timeline Marker Pulse Animation
    // ===================================
    document.querySelectorAll('.timeline-marker').forEach(marker => {
        const ring = document.createElement('span');
        ring.className = 'timeline-marker-ring';
        marker.appendChild(ring);
    });

    // ===================================
    // Back to Top Button
    // ===================================
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===================================
    // Resume Download Button Tracking
    // ===================================
    document.querySelectorAll('a[download]').forEach(button => {
        button.addEventListener('click', function () {
            console.log('Resume download initiated:', this.getAttribute('href'));
        });
    });

    // ===================================
    // Keyboard Navigation Enhancement
    // ===================================
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            navToggle.focus();
        }
    });

    // ===================================
    // Scroll Restoration
    // ===================================
    window.addEventListener('load', function () {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
    });

    // ===================================
    // Lazy Loading Images
    // ===================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        obs.unobserve(img);
                    }
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // ===================================
    // Current Year
    // ===================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // ===================================
    // Console Welcome
    // ===================================
    console.log('%c👋 Hello, fellow developer!', 'font-size: 20px; font-weight: bold; color: #8b7355;');
    console.log('%cInterested in the code? Check out the repo or get in touch!', 'font-size: 14px; color: #6b6b6b;');
});

// ===================================
// External Links — Open in New Tab
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});

// ===================================
// Prevent Default on Empty Hash Links
// ===================================
document.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') === '#') {
        e.preventDefault();
    }
});
