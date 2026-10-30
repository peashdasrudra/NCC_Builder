/* ================================================================
   NCC BUILDERS LTD — SCROLL ANIMATIONS ENGINE
   IntersectionObserver-based scroll reveals, parallax, counters
   ================================================================ */

(function () {
    'use strict';

    /* ===================== SCROLL REVEAL ===================== */
    const animatedElements = document.querySelectorAll(
        '.anim-fade-up, .anim-slide-right, .anim-slide-left, .anim-scale-in'
    );

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05,
            rootMargin: '100px 0px 100px 0px',
        }
    );

    // Reveal elements currently in viewport or near top immediately
    const viewportHeight = window.innerHeight || 800;
    animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= viewportHeight * 1.3) {
            el.classList.add('visible');
        } else {
            revealObserver.observe(el);
        }
    });

    // Failsafe: reveal all elements after 1.2s to prevent any hidden content
    setTimeout(() => {
        animatedElements.forEach((el) => el.classList.add('visible'));
    }, 1200);

    /* ===================== COUNTER ANIMATION ===================== */
    const counters = document.querySelectorAll('[data-count]');
    const counterObserverMap = new WeakMap();

    function animateCounter(el) {
        if (counterObserverMap.has(el)) return;
        counterObserverMap.set(el, true);

        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000; // ms
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));

    /* ===================== HERO PARALLAX ===================== */
    const heroImg = document.querySelector('.hero-bg-img');

    if (heroImg) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    if (scrollY < window.innerHeight) {
                        heroImg.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ===================== HERO PARTICLES ===================== */
    const particlesContainer = document.getElementById('hero-particles');

    if (particlesContainer) {
        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            const size = Math.random() * 4 + 2;
            const isGold = Math.random() > 0.5;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const tx = (Math.random() - 0.5) * 200;
            const ty = -(Math.random() * 300 + 100);
            const duration = Math.random() * 8 + 6;
            const delay = Math.random() * 8;

            particle.style.cssText = `
                --size: ${size}px;
                --color: ${isGold ? 'rgba(201, 168, 76, 0.25)' : 'rgba(26, 158, 92, 0.2)'};
                --tx: ${tx}px;
                --ty: ${ty}px;
                --duration: ${duration}s;
                --delay: ${delay}s;
                left: ${x}%;
                top: ${y}%;
            `;

            particlesContainer.appendChild(particle);
        }
    }
})();
