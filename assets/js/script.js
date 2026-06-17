/* ===================================
   Portfolio Website JavaScript
   v2 — Mobile perf fixes + enhanced animations
   =================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // Device Detection
    // ===================================
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    const isLowEnd = navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 2;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = () => window.innerWidth <= 768;

    // ===================================
    // Dark Mode Toggle
    // ===================================
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle ? darkModeToggle.querySelector('i') : null;
    const body = document.body;

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled' || savedDarkMode === null) {
        body.classList.add('dark-mode');
        if (darkModeIcon) updateDarkModeIcon(true);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function () {
            body.classList.toggle('dark-mode');
            const isDarkMode = body.classList.contains('dark-mode');
            if (darkModeIcon) updateDarkModeIcon(isDarkMode);
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        });
    }

    function updateDarkModeIcon(isDarkMode) {
        darkModeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ===================================
    // Language Toggle
    // ===================================
    const languageToggle = document.getElementById('languageToggle');
    const langText = languageToggle ? languageToggle.querySelector('.lang-text') : null;
    let currentLang = localStorage.getItem('language') || 'en';

    document.querySelectorAll('[data-en]').forEach(el => {
        if (!el.getAttribute('data-en-cached')) {
            const enVal = el.getAttribute('data-en');
            if (enVal) el.setAttribute('data-en-cached', 'true');
        }
    });

    if (currentLang === 'ar') {
        switchToArabic(false);
    }

    if (languageToggle) {
        languageToggle.addEventListener('click', function () {
            if (currentLang === 'en') {
                switchToArabic(true);
            } else {
                switchToEnglish(true);
            }
        });
    }

    function switchToArabic(restartTypewriter) {
        currentLang = 'ar';
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        body.classList.add('rtl');
        if (langText) langText.textContent = 'EN';
        document.querySelectorAll('[data-ar]').forEach(element => {
            const arVal = element.getAttribute('data-ar');
            if (!arVal) return;
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = element.getAttribute('data-placeholder-ar') || '';
            } else {
                if (element.classList.contains('hero-subtitle')) return;
                element.textContent = arVal;
            }
        });
        localStorage.setItem('language', 'ar');
        if (restartTypewriter) restartTypewriterEffect();
    }

    function switchToEnglish(restartTypewriter) {
        currentLang = 'en';
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        body.classList.remove('rtl');
        if (langText) langText.textContent = 'AR';
        document.querySelectorAll('[data-en]').forEach(element => {
            const enVal = element.getAttribute('data-en');
            if (!enVal) return;
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = element.getAttribute('data-placeholder-en') || '';
            } else {
                if (element.classList.contains('hero-subtitle')) return;
                element.textContent = enVal;
            }
        });
        localStorage.setItem('language', 'en');
        if (restartTypewriter) restartTypewriterEffect();
    }

    // ===================================
    // Mobile Navigation Toggle
    // ===================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open', !isExpanded);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        document.addEventListener('click', function (event) {
            const toggleSwitches = document.querySelector('.toggle-switches');
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
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
                const targetPosition = targetElement.offsetTop - navHeight - 16;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ===================================
    // Nav: Scroll Shrink + Shadow
    // ===================================
    const nav = document.querySelector('.nav');

    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 60) {
                    nav.style.boxShadow = '0 2px 20px rgba(43, 35, 22, 0.12)';
                    nav.style.height = isMobileViewport() ? '60px' : '58px';
                } else {
                    nav.style.boxShadow = 'none';
                    nav.style.height = '72px';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ===================================
    // Active Navigation Highlighting
    // ===================================
    const sections = document.querySelectorAll('.section');
    const navMenuLinks = document.querySelectorAll('.nav-menu a');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= (section.offsetTop - 220)) {
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
    updateActiveLink();

    // ===================================
    // Intersection Observer — Sections & Cards
    // ===================================
    const observerOptions = { threshold: 0.07, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-init')) {
                    entry.target.classList.remove('reveal-init');
                    entry.target.classList.add('revealed');
                    const el = entry.target;
                    setTimeout(() => { el.style.transitionDelay = ''; }, 700);
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(28px)';
        section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(section);
    });

    // Skill tags — staggered pop-in
    document.querySelectorAll('.skill-tag').forEach((tag, index) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(18px) scale(0.9)';
        tag.style.transition = `opacity 0.4s ease ${index * 0.04}s, transform 0.4s ease ${index * 0.04}s`;
        observer.observe(tag);
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(28px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.14}s, transform 0.6s ease ${index * 0.14}s`;
        observer.observe(item);
    });

    // Contact cards
    document.querySelectorAll('.contact-card').forEach((card, index) => {
        card.classList.add('reveal-init');
        card.style.transitionDelay = `${index * 0.065}s`;
        observer.observe(card);
    });

    // Highlight items
    document.querySelectorAll('.highlight-item').forEach((item, index) => {
        item.classList.add('reveal-init');
        item.style.transitionDelay = `${index * 0.09}s`;
        observer.observe(item);
    });

    // ===================================
    // Typewriter Effect
    // ===================================
    const heroSubtitle = document.querySelector('.hero-subtitle');
    let typeTimeout;
    let typeIndex = 0;
    let isDeleting = false;

    const typeTexts = {
        en: 'Computer Engineer',
        ar: 'مهندس حاسوب'
    };

    function typeWrite() {
        const fullText = typeTexts[currentLang] || typeTexts.en;

        if (!isDeleting) {
            heroSubtitle.textContent = fullText.substring(0, typeIndex + 1);
            typeIndex++;
            if (typeIndex === fullText.length) {
                typeTimeout = setTimeout(() => {
                    isDeleting = true;
                    typeWrite();
                }, 3200);
                return;
            }
        } else {
            heroSubtitle.textContent = fullText.substring(0, typeIndex - 1);
            typeIndex--;
            if (typeIndex === 0) {
                isDeleting = false;
                typeTimeout = setTimeout(typeWrite, 450);
                return;
            }
        }

        typeTimeout = setTimeout(typeWrite, isDeleting ? 55 : 85);
    }

    if (heroSubtitle) {
        setTimeout(() => {
            heroSubtitle.textContent = '';
            typeIndex = 0;
            isDeleting = false;
            typeWrite();
        }, 1200);
    }

    function restartTypewriterEffect() {
        clearTimeout(typeTimeout);
        typeIndex = 0;
        isDeleting = false;
        if (heroSubtitle) {
            heroSubtitle.textContent = '';
            setTimeout(typeWrite, 250);
        }
    }

    // ===================================
    // Hero Canvas Particles
    // PERF FIX: Disabled on mobile/touch/low-end devices
    // PERF FIX: Reduced particle count; use offscreen canvas if available
    // ===================================
    const hero = document.querySelector('.hero');
    if (hero && !isTouchDevice && !isLowEnd && !prefersReducedMotion) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.28';
        hero.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let animFrame;

        function resizeCanvas() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
        resizeCanvas();

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resizeCanvas, 150);
        });

        function getAccentColor() {
            return getComputedStyle(document.documentElement)
                .getPropertyValue('--color-accent').trim() || '#8b7355';
        }

        // Reduced from 24 → 16 for better desktop perf too
        const PARTICLE_COUNT = 16;
        const particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                r: Math.random() * 2.0 + 0.5,
                dx: (Math.random() - 0.5) * 0.28,
                dy: (Math.random() - 0.5) * 0.28,
                opacity: Math.random() * 0.42 + 0.15
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
                const dist = Math.hypot(p.x - mx, p.y - my);
                if (dist < 90) {
                    const angle = Math.atan2(p.y - my, p.x - mx);
                    const force = (90 - dist) / 90 * 0.5;
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

        // Only run when hero is visible
        const heroObs = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) {
                cancelAnimationFrame(animFrame);
            } else {
                animFrame = requestAnimationFrame(drawParticles);
            }
        }, { threshold: 0 });
        heroObs.observe(hero);
    }

    // ===================================
    // Timeline Marker Pulse Rings
    // ===================================
    document.querySelectorAll('.timeline-marker').forEach(marker => {
        const ring = document.createElement('span');
        ring.className = 'timeline-marker-ring';
        ring.setAttribute('aria-hidden', 'true');
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
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            navProgress.setAttribute('aria-valuenow', Math.round(pct));
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
    }, { threshold: 0.4 });

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
    }, { threshold: 0.12 });

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
            const visible = Math.min(Math.max(window.innerHeight - rect.top, 0), rect.height);
            const pct = Math.round((visible / rect.height) * 100);
            timeline.style.setProperty('--timeline-fill', pct + '%');
        }, { passive: true });
    }

    // ===================================
    // Glass Card 3D Tilt (desktop only)
    // PERF FIX: Skip on touch/mobile
    // ===================================
    if (!isTouchDevice && !isMobileViewport()) {
        document.querySelectorAll('.glass-card, .highlight-item').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                card.style.transform = `translateY(-5px) rotateX(${(-dy * 3.5).toFixed(1)}deg) rotateY(${(dx * 3.5).toFixed(1)}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ===================================
    // Animated Stat Counters
    // ===================================
    const aboutIntro = document.querySelector('.about-intro');
    if (aboutIntro && !document.querySelector('.stat-counter')) {
        const statHtml = `
            <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin:0.85rem 0;max-width:100%;overflow:hidden;">
                <span class="stat-counter"><span class="count-num" data-target="3">0</span><span class="stat-label" data-en="+ yrs experience" data-ar="+ سنوات خبرة">+ yrs experience</span></span>
                <span class="stat-counter"><span class="count-num" data-target="50">0</span><span class="stat-label" data-en="+ incidents/week" data-ar="+ حادثة أسبوعياً">+ incidents/week</span></span>
                <span class="stat-counter"><span class="count-num" data-target="2">0</span><span class="stat-label" data-en=" internships" data-ar=" تدريب"> internships</span></span>
            </div>`;
        aboutIntro.insertAdjacentHTML('afterend', statHtml);

        // Apply current language to newly injected stat labels
        if (currentLang === 'ar') {
            document.querySelectorAll('.stat-label[data-ar]').forEach(el => {
                el.textContent = el.getAttribute('data-ar');
            });
        }

        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.count-num').forEach(el => {
                        const target = parseInt(el.dataset.target);
                        let current = 0;
                        const step = Math.ceil(target / 28);
                        const timer = setInterval(() => {
                            current = Math.min(current + step, target);
                            el.textContent = current;
                            if (current >= target) clearInterval(timer);
                        }, 38);
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
    // PERF FIX: Not created on touch/mobile
    // ===================================
    if (!isTouchDevice) {
        const cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        cursorGlow.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursorGlow);

        let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorGlow.classList.add('visible');
        });

        document.addEventListener('mouseleave', () => cursorGlow.classList.remove('visible'));

        const interactiveEls = 'a, button, .skill-tag, .contact-card, .glass-card, .btn';
        document.addEventListener('mouseover', e => {
            if (e.target.closest(interactiveEls)) cursorGlow.classList.add('expanded');
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest(interactiveEls)) cursorGlow.classList.remove('expanded');
        });

        let glowFrame;
        function animateGlow() {
            glowX += (mouseX - glowX) * 0.11;
            glowY += (mouseY - glowY) * 0.11;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            glowFrame = requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ===================================
    // Magnetic Buttons (desktop only)
    // ===================================
    if (!isTouchDevice) {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const rect = btn.getBoundingClientRect();
                const dx = e.clientX - (rect.left + rect.width / 2);
                const dy = e.clientY - (rect.top + rect.height / 2);
                btn.style.transform = `translate(${dx * 0.16}px, ${dy * 0.16}px) translateY(-2px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ===================================
    // Particle Mouse Repel — expose coords (desktop only)
    // ===================================
    if (!isTouchDevice) {
        window._portfolioMouse = { x: -9999, y: -9999 };
        document.addEventListener('mousemove', e => {
            window._portfolioMouse.x = e.clientX;
            window._portfolioMouse.y = e.clientY;
        });
    }

    // ===================================
    // Keyboard Navigation
    // ===================================
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.focus();
            }
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });

    // ===================================
    // Scroll Restoration — start at top
    // ===================================
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

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
    // Current Year in Footer
    // ===================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // ===================================
    // Resume Download Tracking
    // ===================================
    document.querySelectorAll('a[download]').forEach(button => {
        button.addEventListener('click', function () {
            console.log('%cResume download initiated', 'color: #8b7355; font-weight: bold;');
        });
    });

    // ===================================
    // Console Welcome
    // ===================================
    console.log('%c👋 Hello, fellow developer!', 'font-size:20px;font-weight:bold;color:#8b7355;');
    console.log('%cCurious about the code? Check the repo or reach out.', 'font-size:13px;color:#6b6b6b;');

    // ===================================
    // Hero entrance shimmer (enhanced)
    // ===================================
    const heroName = document.querySelector('.hero-name');
    if (heroName && !prefersReducedMotion) {
        setTimeout(() => heroName.classList.add('shimmer-active'), 900);
    }

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
// Prevent default on empty hash links
// ===================================
document.addEventListener('click', function (e) {
    const el = e.target.closest('a');
    if (el && el.getAttribute('href') === '#') {
        e.preventDefault();
    }
});
