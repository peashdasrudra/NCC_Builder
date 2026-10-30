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
        { threshold: 0.15 }
    );

    // If counters are already in viewport or near top, trigger them smoothly
    const currentViewportHeight = window.innerHeight || 800;
    counters.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= currentViewportHeight * 1.1) {
            setTimeout(() => animateCounter(el), 350);
        } else {
            counterObserver.observe(el);
        }
    });

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

    /* ===================== HERO FX CANVAS (LUXURY AMBIENT GOLD PARTICLES) ===================== */
    const canvas = document.getElementById('hero-fx-canvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let particles = [];
        let animationFrameId = null;
        let isVisible = true;

        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 30 : 54;
        const mouse = { x: -9999, y: -9999, radius: isMobile ? 80 : 120 };

        function resizeCanvas() {
            const heroSection = document.getElementById('hero');
            if (!heroSection) return;
            const rect = heroSection.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        class GoldParticle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + 10;
                this.size = Math.random() * 2.2 + 0.8;
                this.baseAlpha = Math.random() * 0.45 + 0.25;
                this.alpha = this.baseAlpha;
                this.speedY = Math.random() * 0.45 + 0.18;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulse = Math.random() * Math.PI;

                const colors = [
                    'rgba(255, 215, 0,',
                    'rgba(245, 230, 160,',
                    'rgba(212, 175, 55,',
                    'rgba(255, 235, 180,'
                ];
                this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y -= this.speedY;
                this.pulse += this.pulseSpeed;
                this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.2;
                this.x += this.speedX + Math.sin(this.pulse * 0.5) * 0.25;

                // Gentle magnetic reaction to touch / cursor
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (1 - dist / mouse.radius) * 1.6;
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force;
                    this.alpha = Math.min(this.alpha + 0.3, 0.95);
                }

                if (this.y < -10 || this.x < -20 || this.x > width + 20) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${this.colorPrefix} ${Math.max(this.alpha, 0.1)})`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new GoldParticle());
            }
        }

        function drawConnections() {
            const maxDist = isMobile ? 65 : 85;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }

        function renderFrame() {
            if (!isVisible) return;
            ctx.clearRect(0, 0, width, height);

            drawConnections();

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }

            animationFrameId = requestAnimationFrame(renderFrame);
        }

        resizeCanvas();
        initParticles();
        renderFrame();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initParticles();
        }, { passive: true });

        const heroEl = document.getElementById('hero');
        if (heroEl) {
            heroEl.addEventListener('mousemove', (e) => {
                const rect = heroEl.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            }, { passive: true });

            heroEl.addEventListener('mouseleave', () => {
                mouse.x = -9999;
                mouse.y = -9999;
            }, { passive: true });

            heroEl.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches[0]) {
                    const rect = heroEl.getBoundingClientRect();
                    mouse.x = e.touches[0].clientX - rect.left;
                    mouse.y = e.touches[0].clientY - rect.top;
                }
            }, { passive: true });

            heroEl.addEventListener('touchend', () => {
                setTimeout(() => { mouse.x = -9999; mouse.y = -9999; }, 400);
            }, { passive: true });

            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (!isVisible) {
                            isVisible = true;
                            renderFrame();
                        }
                    } else {
                        isVisible = false;
                        if (animationFrameId) cancelAnimationFrame(animationFrameId);
                    }
                });
            }, { threshold: 0.05 });

            heroObserver.observe(heroEl);
        }
    }
})();
