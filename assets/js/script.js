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
            document.body.classList.toggle('nav-open', !isExpanded); // FIX: lock scroll when menu open
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        document.addEventListener('click', function (event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            const toggleSwitches = document.querySelector('.toggle-switches');
            const isClickOnToggles = toggleSwitches && toggleSwitches.contains(event.target);
            if (!isClickInsideNav && !isClickOnToggles && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
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
    const isMobile = () => window.innerWidth <= 991;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 60) {
            nav.style.boxShadow = '0 2px 16px rgba(43, 43, 43, 0.10)';
            nav.style.height = isMobile() ? '60px' : '58px';
        } else {
            nav.style.boxShadow = 'none';
            nav.style.height = '72px';
        }
    }, { passive: true });

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

    window.addEventListener('scroll', updateActiveLink, { passive: true });
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

    // Contact cards with staggered pop-in
    document.querySelectorAll('.contact-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`;
        observer.observe(card);
    });

    // Highlight items
    document.querySelectorAll('.highlight-item').forEach((item, index) => {
        item.style.opacity = '0';
        // direction set via nth-child in CSS, just ensure base state
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s`;
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
            const mouse = window._portfolioMouse || { x: -9999, y: -9999 };
            const canvasRect = canvas.getBoundingClientRect();
            const mx = mouse.x - canvasRect.left;
            const my = mouse.y - canvasRect.top;

            particles.forEach(p => {
                // Mouse repel
                const dist = Math.hypot(p.x - mx, p.y - my);
                if (dist < 80) {
                    const angle = Math.atan2(p.y - my, p.x - mx);
                    const force = (80 - dist) / 80 * 0.6;
                    p.x += Math.cos(angle) * force;
                    p.y += Math.sin(angle) * force;
                }

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
    }, { passive: true });

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
    // Reading Progress Bar
    // ===================================
    const navProgress = document.getElementById('navProgress');
    if (navProgress) {
        window.addEventListener('scroll', () => {
            const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
            navProgress.style.width = pct.toFixed(1) + '%';
        }, { passive: true });
    }

    // ===================================
    // Button Ripple Effect
    // ===================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // ===================================
    // Section Title Underline Draw
    // ===================================
    const titleObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('line-drawn');
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section-title').forEach(t => titleObserver.observe(t));

    // ===================================
    // Skill Categories — alternating slide-in
    // ===================================
    const skillObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.skill-category').forEach((cat, i) => {
        if (i % 2 !== 0) cat.classList.add('from-right');
        skillObserver.observe(cat);
    });

    // ===================================
    // Timeline Line Fill on Scroll
    // ===================================
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        window.addEventListener('scroll', () => {
            const rect = timeline.getBoundingClientRect();
            const total = rect.height;
            const visible = Math.min(Math.max(window.innerHeight - rect.top, 0), total);
            const pct = Math.round((visible / total) * 100);
            timeline.style.setProperty('--timeline-fill', pct + '%');
        }, { passive: true });
    }

    // ===================================
    // Glass Card 3D Tilt on Hover (desktop only)
    // ===================================
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) {
        document.querySelectorAll('.glass-card, .highlight-item').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                card.style.transform = `translateY(-5px) rotateX(${(-dy * 4).toFixed(1)}deg) rotateY(${(dx * 4).toFixed(1)}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ===================================
    // Animated Stat Counters
    // (inject 3-yr stat badge into about section)
    // ===================================
    const aboutIntro = document.querySelector('.about-intro');
    if (aboutIntro && !document.querySelector('.stat-counter')) {
        const statHtml = `
            <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin:0.75rem 0;max-width:100%;overflow:hidden;">
                <span class="stat-counter"><span class="count-num" data-target="3">0</span>+ yrs experience</span>
                <span class="stat-counter"><span class="count-num" data-target="50">0</span>+ incidents/week</span>
                <span class="stat-counter"><span class="count-num" data-target="2">0</span> internships</span>
            </div>`;
        aboutIntro.insertAdjacentHTML('afterend', statHtml);

        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.count-num').forEach(el => {
                        const target = parseInt(el.dataset.target);
                        let current = 0;
                        const step = Math.ceil(target / 30);
                        const timer = setInterval(() => {
                            current = Math.min(current + step, target);
                            el.textContent = current;
                            if (current >= target) clearInterval(timer);
                        }, 40);
                    });
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const statWrap = document.querySelector('.stat-counter');
        if (statWrap) counterObserver.observe(statWrap);
    }

    // ===================================
    // Cursor Glow (desktop only)
    // ===================================
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    let glowRaf;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => cursorGlow.classList.remove('visible'));

    const interactiveEls = 'a, button, .skill-tag, .contact-card, .glass-card, .btn';
    document.addEventListener('mouseover', e => {
        if (e.target.closest(interactiveEls)) {
            cursorGlow.classList.add('expanded');
        }
    });
    document.addEventListener('mouseout', e => {
        if (e.target.closest(interactiveEls)) {
            cursorGlow.classList.remove('expanded');
        }
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        glowRaf = requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // ===================================
    // Magnetic Buttons (desktop only)
    // ===================================
    if (!isTouchDevice) {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const dx = e.clientX - (rect.left + rect.width / 2);
                const dy = e.clientY - (rect.top + rect.height / 2);
                btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px) translateY(-2px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ===================================
    // Particle Mouse Repel
    // ===================================
    // Expose mouse coords for particle system
    window._portfolioMouse = { x: -9999, y: -9999 };
    document.addEventListener('mousemove', e => {
        window._portfolioMouse.x = e.clientX;
        window._portfolioMouse.y = e.clientY;
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
