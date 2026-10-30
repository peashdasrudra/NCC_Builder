/* ================================================================
   NCC BUILDERS LTD — LUXURY REAL ESTATE JAVASCRIPT ENGINE
   Navigation, Preloader, Property Finder, Lightbox Modal,
   EMI Investment Calculator, Testimonials Carousel, VIP Booking
   ================================================================ */

(function () {
    'use strict';

    /* ===================== CINEMATIC LUXURY PRELOADER ===================== */
    const preloader = document.getElementById('preloader');
    const preloaderBarFill = document.getElementById('preloader-bar-fill');
    const preloaderCounter = document.getElementById('preloader-counter');
    const preloaderStatus = document.getElementById('preloader-status');

    let preloaderDismissed = false;

    function runPreloaderSequence() {
        if (!preloader || preloaderDismissed) return;
        
        const startTime = performance.now();
        const duration = 750; // ms

        function updatePreloader(now) {
            if (preloaderDismissed) return;
            const elapsed = now - startTime;
            const progress = Math.min(Math.round((elapsed / duration) * 100), 100);

            if (preloaderCounter) preloaderCounter.textContent = progress + '%';
            if (preloaderBarFill) preloaderBarFill.style.width = progress + '%';

            if (preloaderStatus) {
                if (progress < 30) {
                    preloaderStatus.textContent = 'Initializing Khulna Landmark Portfolio...';
                } else if (progress < 65) {
                    preloaderStatus.textContent = 'Verifying 100% KDA Sanctions & BUET Codes...';
                } else if (progress < 95) {
                    preloaderStatus.textContent = 'Syncing 6 Active Construction Sites...';
                } else {
                    preloaderStatus.textContent = 'Portfolio Ready \u2022 Welcome to NCC Builders';
                }
            }

            if (progress < 100) {
                requestAnimationFrame(updatePreloader);
            } else {
                setTimeout(dismissPreloader, 180);
            }
        }

        requestAnimationFrame(updatePreloader);
    }

    function dismissPreloader() {
        if (preloaderDismissed) return;
        preloaderDismissed = true;
        if (preloader) {
            preloader.classList.add('loaded');
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runPreloaderSequence);
    } else {
        runPreloaderSequence();
    }

    // Safety fallback: ensure dismissal within 1.2s max
    setTimeout(dismissPreloader, 1200);

    /* ===================== NAVBAR & STICKY SCROLL ===================== */
    const navbar = document.getElementById('navbar');
    const navHamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function handleNavScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Mobile Hamburger & Drawer Toggle
    const navCloseBtn = document.getElementById('nav-close-btn');

    function closeMobileMenu() {
        if (navHamburger) navHamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (navHamburger && navMenu) {
        navHamburger.addEventListener('click', () => {
            const isActive = navHamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        if (navCloseBtn) {
            navCloseBtn.addEventListener('click', closeMobileMenu);
        }

        navLinks.forEach((link) => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close drawer when clicking outside content
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navHamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    /* ===================== SCROLL SPY ===================== */
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 180;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    /* ===================== SMOOTH SCROLL FOR ANCHORS ===================== */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const target = document.querySelector(targetId);

            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = target.offsetTop - navHeight + 10;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });

    /* ===================== PROJECT FILTERING ===================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    function filterProjects(filterCategory) {
        filterBtns.forEach((btn) => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filterCategory);
        });

        projectCards.forEach((card) => {
            const cardCat = card.getAttribute('data-category');
            if (filterCategory === 'all' || cardCat === filterCategory) {
                card.style.display = 'flex';
                card.classList.remove('hiding');
                card.classList.add('showing');
                card.classList.add('visible');
                card.style.opacity = '1';
                card.style.transform = 'none';
            } else {
                card.classList.add('hiding');
                card.classList.remove('showing');
                setTimeout(() => {
                    if (card.classList.contains('hiding')) {
                        card.style.display = 'none';
                    }
                }, 200);
            }
        });
    }

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });
    });

    /* ===================== PROPERTY FINDER WIDGET ===================== */
    const finderBtn = document.getElementById('finder-submit-btn');
    const finderLocation = document.getElementById('finder-location');
    const finderType = document.getElementById('finder-type');
    const finderStatus = document.getElementById('finder-status');

    if (finderBtn) {
        finderBtn.addEventListener('click', () => {
            const loc = finderLocation ? finderLocation.value : 'all';
            const pType = finderType ? finderType.value : 'all';
            const stat = finderStatus ? finderStatus.value : 'all';

            // Filter project cards matching criteria
            let matchedCount = 0;

            projectCards.forEach((card) => {
                const cardLoc = card.getAttribute('data-location') || '';
                const cardType = card.getAttribute('data-type') || '';
                const cardStat = card.getAttribute('data-category') || '';

                const locMatch = (loc === 'all' || cardLoc.toLowerCase().includes(loc.toLowerCase()));
                const typeMatch = (pType === 'all' || cardType === pType);
                const statMatch = (stat === 'all' || cardStat === stat);

                if (locMatch && typeMatch && statMatch) {
                    card.style.display = 'flex';
                    card.classList.remove('hiding');
                    card.classList.add('showing');
                    card.classList.add('visible');
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                    matchedCount++;
                } else {
                    card.classList.add('hiding');
                    card.classList.remove('showing');
                    setTimeout(() => {
                        if (card.classList.contains('hiding')) {
                            card.style.display = 'none';
                        }
                    }, 200);
                }
            });

            // If no match found, show all so UI never looks empty
            if (matchedCount === 0) {
                projectCards.forEach((card) => {
                    card.style.display = 'flex';
                    card.classList.remove('hiding');
                    card.classList.add('showing');
                    card.classList.add('visible');
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                });
            }

            // Smooth scroll to projects section
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                const navHeight = navbar ? navbar.offsetHeight : 64;
                window.scrollTo({
                    top: projectsSection.offsetTop - navHeight + 10,
                    behavior: 'smooth'
                });
            }
        });
    }

    /* ===================== PROJECT LIGHTBOX MODAL ===================== */
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalBadge = document.getElementById('modal-badge');
    const modalLocationText = document.getElementById('modal-location-text');
    const modalDesc = document.getElementById('modal-desc');
    const modalFloors = document.getElementById('modal-floors');
    const modalUnits = document.getElementById('modal-units');
    const modalSize = document.getElementById('modal-size');
    const modalHandover = document.getElementById('modal-handover');
    const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');
    const modalInquireBtn = document.getElementById('modal-inquire-btn');
    const projectSelectDropdown = document.getElementById('contact-project-select');

    function openProjectModal(data) {
        if (!projectModal) return;

        if (modalImg && data.image) modalImg.src = data.image;
        if (modalTitle) modalTitle.textContent = data.title || 'NCC Landmark Project';
        if (modalBadge) {
            modalBadge.textContent = data.status || 'Ongoing';
            modalBadge.className = `project-badge-pill ${(data.status || 'ongoing').toLowerCase().replace(/\s+/g, '-')}`;
        }
        if (modalLocationText) modalLocationText.textContent = data.location || 'Khulna, Bangladesh';
        if (modalDesc) modalDesc.textContent = data.desc || '';
        if (modalFloors) modalFloors.textContent = data.floors || '12 Floors';
        if (modalUnits) modalUnits.textContent = data.units || '48 Units';
        if (modalSize) modalSize.textContent = data.size || '1,800 sq.ft.';
        if (modalHandover) modalHandover.textContent = data.handover || '2027';

        // Update WhatsApp pre-filled link
        if (modalWhatsappBtn) {
            const encodedMsg = encodeURIComponent(
                `Hello NCC Builders Ltd, I am interested in scheduling a viewing for "${data.title}" in ${data.location}. Please share floor plans and price list.`
            );
            modalWhatsappBtn.href = `https://wa.me/8801911434140?text=${encodedMsg}`;
        }

        // Prefill contact form selection
        if (projectSelectDropdown && data.title) {
            for (let option of projectSelectDropdown.options) {
                if (option.text.includes(data.title) || data.title.includes(option.value)) {
                    option.selected = true;
                    break;
                }
            }
        }

        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.view-details-trigger').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const data = {
                title: btn.getAttribute('data-title'),
                location: btn.getAttribute('data-location'),
                status: btn.getAttribute('data-status'),
                image: btn.getAttribute('data-image'),
                floors: btn.getAttribute('data-floors'),
                units: btn.getAttribute('data-units'),
                size: btn.getAttribute('data-size'),
                handover: btn.getAttribute('data-handover'),
                desc: btn.getAttribute('data-desc'),
            };
            openProjectModal(data);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeProjectModal);
    }

    const modalPullHandle = document.querySelector('.modal-pull-handle');
    if (modalPullHandle) {
        modalPullHandle.addEventListener('click', closeProjectModal);
    }

    if (modalInquireBtn) {
        modalInquireBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeProjectModal();
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const navHeight = navbar ? navbar.offsetHeight : 64;
                    window.scrollTo({
                        top: contactSection.offsetTop - navHeight + 10,
                        behavior: 'smooth'
                    });
                    const nameField = document.getElementById('contact-name');
                    if (nameField) nameField.focus();
                }
            }, 200);
        });
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });

        // Touch drag-down dismissal for mobile sheet
        let modalTouchStartY = 0;
        projectModal.addEventListener('touchstart', (e) => {
            modalTouchStartY = e.touches[0].clientY;
        }, { passive: true });

        projectModal.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            if (touchEndY - modalTouchStartY > 80 && modalTouchStartY < window.innerHeight * 0.45) {
                closeProjectModal();
            }
        }, { passive: true });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
            closeSuccessModal();
        }
    });

    /* ===================== REAL ESTATE EMI CALCULATOR ===================== */
    const priceSlider = document.getElementById('calc-price-slider');
    const downSlider = document.getElementById('calc-down-slider');
    const tenureSlider = document.getElementById('calc-tenure-slider');
    const rateSlider = document.getElementById('calc-rate-slider');

    const priceVal = document.getElementById('calc-price-val');
    const downVal = document.getElementById('calc-down-val');
    const tenureVal = document.getElementById('calc-tenure-val');
    const rateVal = document.getElementById('calc-rate-val');

    const emiDisplay = document.getElementById('calc-emi-display');
    const loanAmountDisplay = document.getElementById('calc-loan-amount');
    const downAmountDisplay = document.getElementById('calc-down-amount');

    function formatBDT(amount) {
        const rounded = Math.round(amount);
        return '৳ ' + rounded.toLocaleString('en-IN');
    }

    function formatBDTWords(amount) {
        const lacs = amount / 100000;
        if (lacs >= 100) {
            const crore = (lacs / 100).toFixed(2);
            return `৳ ${crore} Crore`;
        }
        return `৳ ${Math.round(lacs)} Lacs`;
    }

    function calculateEMI() {
        if (!priceSlider || !downSlider || !tenureSlider || !rateSlider) return;

        const propertyPrice = parseFloat(priceSlider.value);
        const downPercent = parseFloat(downSlider.value);
        const tenureYears = parseFloat(tenureSlider.value);
        const annualRate = parseFloat(rateSlider.value);

        const downPaymentAmount = propertyPrice * (downPercent / 100);
        const loanAmount = propertyPrice - downPaymentAmount;

        // Monthly rate and months
        const monthlyRate = (annualRate / 12) / 100;
        const totalMonths = tenureYears * 12;

        let monthlyEMI = 0;
        if (monthlyRate > 0) {
            const factor = Math.pow(1 + monthlyRate, totalMonths);
            monthlyEMI = (loanAmount * monthlyRate * factor) / (factor - 1);
        } else {
            monthlyEMI = loanAmount / totalMonths;
        }

        // Update labels
        if (priceVal) priceVal.textContent = formatBDT(propertyPrice) + ` (${formatBDTWords(propertyPrice)})`;
        if (downVal) downVal.textContent = `${downPercent}% (${formatBDT(downPaymentAmount)})`;
        if (tenureVal) tenureVal.textContent = `${tenureYears} Years (${totalMonths} months)`;
        if (rateVal) rateVal.textContent = `${annualRate.toFixed(1)}% p.a.`;

        // Update results
        if (emiDisplay) emiDisplay.textContent = formatBDT(monthlyEMI);
        if (loanAmountDisplay) loanAmountDisplay.textContent = formatBDT(loanAmount);
        if (downAmountDisplay) downAmountDisplay.textContent = formatBDT(downPaymentAmount);
    }

    if (priceSlider && downSlider && tenureSlider && rateSlider) {
        priceSlider.addEventListener('input', calculateEMI);
        downSlider.addEventListener('input', calculateEMI);
        tenureSlider.addEventListener('input', calculateEMI);
        rateSlider.addEventListener('input', calculateEMI);
        calculateEMI();
    }

    /* ===================== TESTIMONIALS SLIDER ===================== */
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const totalSlides = dots.length;
    let autoSlideInterval;

    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide >= totalSlides) currentSlide = 0;
        if (currentSlide < 0) currentSlide = totalSlides - 1;

        if (track) {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function startAutoSlide() {
        if (totalSlides > 1) {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 6000);
        }
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
            resetAutoSlide();
        });
    }

    // Native Mobile Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const threshold = 40;
            if (touchEndX < touchStartX - threshold) {
                // Swiped Left -> Next
                goToSlide(currentSlide + 1);
                resetAutoSlide();
            } else if (touchEndX > touchStartX + threshold) {
                // Swiped Right -> Previous
                goToSlide(currentSlide - 1);
                resetAutoSlide();
            }
        }, { passive: true });
    }

    startAutoSlide();

    /* ===================== VIP CONTACT FORM & SUCCESS MODAL ===================== */
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('success-modal');
    const successModalClose = document.getElementById('success-modal-close');

    function openSuccessModal() {
        if (!successModal) return;
        successModal.classList.add('active');
        successModal.setAttribute('aria-hidden', 'false');
    }

    function closeSuccessModal() {
        if (!successModal) return;
        successModal.classList.remove('active');
        successModal.setAttribute('aria-hidden', 'true');
    }

    if (successModalClose) {
        successModalClose.addEventListener('click', closeSuccessModal);
    }

    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeSuccessModal();
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('contact-submit');

            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Registering VIP Viewing...</span>';

                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    contactForm.reset();
                    openSuccessModal();
                }, 800);
            }
        });
    }

    /* ===================== BACK TO TOP WITH PROGRESS RING ===================== */
    const backToTopBtn = document.getElementById('back-to-top');
    const progressCircle = document.querySelector('.progress-ring-circle');

    if (backToTopBtn && progressCircle) {
        const circumference = 2 * Math.PI * 21; // radius 21 -> 131.95
        progressCircle.style.strokeDasharray = `${circumference}`;

        function updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
            const offset = circumference - scrollPercent * circumference;

            progressCircle.style.strokeDashoffset = offset;

            if (scrollTop > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }

    /* ===================== HERO LIVE INTERACTIVE FX CANVAS ===================== */
    const heroCanvas = document.getElementById('hero-fx-canvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let width = 0;
        let height = 0;
        let particles = [];
        let mouse = { x: -1000, y: -1000, active: false };
        let animationFrameId = null;
        let isHeroVisible = true;

        const PARTICLE_COUNT = 50;
        const CONNECT_DISTANCE = 110;
        const MOUSE_RADIUS = 160;

        function resizeCanvas() {
            if (!heroCanvas.parentElement) return;
            const rect = heroCanvas.parentElement.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            heroCanvas.width = width * dpr;
            heroCanvas.height = height * dpr;
            ctx.resetTransform ? ctx.resetTransform() : ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        }

        class StarNode {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = initial ? Math.random() * width : Math.random() * width;
                this.y = initial ? Math.random() * height : height + 10;
                this.radius = Math.random() * 1.8 + 0.8;
                this.baseAlpha = Math.random() * 0.45 + 0.25;
                this.alpha = this.baseAlpha;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = -(Math.random() * 0.4 + 0.15);
                this.hue = Math.random() > 0.4 ? 43 : 48; // Gold spectrum
                this.pulse = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.03 + 0.015;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.pulse += this.pulseSpeed;
                this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.18;

                // Mouse interaction physics
                if (mouse.active) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS && dist > 0) {
                        const force = (1 - dist / MOUSE_RADIUS) * 0.8;
                        this.x -= (dx / dist) * force;
                        this.y -= (dy / dist) * force;
                        this.alpha = Math.min(1, this.alpha + force * 0.5);
                    }
                }

                if (this.y < -10 || this.x < -20 || this.x > width + 20) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 85%, 62%, ${Math.max(0, this.alpha)})`;
                ctx.shadowColor = `hsla(${this.hue}, 90%, 65%, 0.6)`;
                ctx.shadowBlur = 8;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new StarNode());
            }
        }

        function drawConnections() {
            ctx.shadowBlur = 0;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECT_DISTANCE) {
                        const alpha = (1 - dist / CONNECT_DISTANCE) * 0.18;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }

                // Connect to mouse if active
                if (mouse.active) {
                    const mdx = mouse.x - particles[i].x;
                    const mdy = mouse.y - particles[i].y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < MOUSE_RADIUS) {
                        const malpha = (1 - mdist / MOUSE_RADIUS) * 0.35;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 215, 0, ${malpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            // Draw volumetric cursor spotlight
            if (mouse.active) {
                const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS);
                grad.addColorStop(0, 'rgba(212, 175, 55, 0.14)');
                grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.04)');
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function animateCanvas() {
            if (!isHeroVisible) {
                animationFrameId = requestAnimationFrame(animateCanvas);
                return;
            }
            ctx.clearRect(0, 0, width, height);
            drawConnections();
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animateCanvas);
        }

        resizeCanvas();
        initParticles();
        animateCanvas();

        window.addEventListener('resize', resizeCanvas, { passive: true });

        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroCanvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
                mouse.active = true;
            }, { passive: true });

            heroSection.addEventListener('mouseleave', () => {
                mouse.active = false;
            });

            heroSection.addEventListener('touchmove', (e) => {
                if (e.touches && e.touches.length > 0) {
                    const rect = heroCanvas.getBoundingClientRect();
                    mouse.x = e.touches[0].clientX - rect.left;
                    mouse.y = e.touches[0].clientY - rect.top;
                    mouse.active = true;
                }
            }, { passive: true });

            heroSection.addEventListener('touchend', () => {
                mouse.active = false;
            });
        }

        // Pause canvas when hero is not in view
        if ('IntersectionObserver' in window && heroSection) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    isHeroVisible = entry.isIntersecting;
                });
            }, { threshold: 0.05 });
            heroObserver.observe(heroSection);
        }
    }

    /* ===================== VIP ARCHITECTURAL BLUEPRINT & LIVE SITES MODAL ===================== */
    const vipTourModal = document.getElementById('vip-tour-modal');
    const heroRadarTrigger = document.getElementById('hero-radar-trigger');
    const heroVipTourBtn = document.getElementById('hero-vip-tour-btn');
    const vipTourCloseBtn = document.getElementById('vip-tour-close-btn');
    const vipTourPullHandle = document.getElementById('vip-tour-pull-handle');
    const blueprintSliderWrap = document.getElementById('blueprint-slider-wrap');
    const blueprintLayer = document.getElementById('blueprint-layer');
    const blueprintDragDivider = document.getElementById('blueprint-drag-divider');

    let isDraggingBlueprint = false;
    let idleAnimFrame = null;
    let userInteractedWithSlider = false;

    function openVipTourModal() {
        if (!vipTourModal) return;
        vipTourModal.classList.add('active');
        vipTourModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        startBlueprintIdleAnimation();
    }

    function closeVipTourModal() {
        if (!vipTourModal) return;
        vipTourModal.classList.remove('active');
        vipTourModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        stopBlueprintIdleAnimation();
    }

    if (heroRadarTrigger) {
        heroRadarTrigger.addEventListener('click', openVipTourModal);
        heroRadarTrigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openVipTourModal();
            }
        });
    }

    if (heroVipTourBtn) {
        heroVipTourBtn.addEventListener('click', openVipTourModal);
    }

    if (vipTourCloseBtn) {
        vipTourCloseBtn.addEventListener('click', closeVipTourModal);
    }

    if (vipTourPullHandle) {
        vipTourPullHandle.addEventListener('click', closeVipTourModal);
    }

    if (vipTourModal) {
        vipTourModal.addEventListener('click', (e) => {
            if (e.target === vipTourModal) {
                closeVipTourModal();
            }
        });
    }

    // Blueprint Slider Drag / Move Physics
    function setBlueprintPosition(clientX) {
        if (!blueprintSliderWrap || !blueprintLayer || !blueprintDragDivider) return;
        const rect = blueprintSliderWrap.getBoundingClientRect();
        let pct = ((clientX - rect.left) / rect.width) * 100;
        pct = Math.max(4, Math.min(96, pct));
        blueprintLayer.style.width = `${pct}%`;
        blueprintDragDivider.style.left = `${pct}%`;
    }

    function onBlueprintMove(e) {
        userInteractedWithSlider = true;
        stopBlueprintIdleAnimation();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setBlueprintPosition(clientX);
    }

    if (blueprintSliderWrap) {
        blueprintSliderWrap.addEventListener('mousedown', (e) => {
            isDraggingBlueprint = true;
            onBlueprintMove(e);
        });

        window.addEventListener('mouseup', () => {
            isDraggingBlueprint = false;
        });

        blueprintSliderWrap.addEventListener('mousemove', (e) => {
            if (isDraggingBlueprint || e.buttons === 1) {
                onBlueprintMove(e);
            }
        });

        blueprintSliderWrap.addEventListener('touchstart', (e) => {
            isDraggingBlueprint = true;
            onBlueprintMove(e);
        }, { passive: true });

        blueprintSliderWrap.addEventListener('touchmove', (e) => {
            if (isDraggingBlueprint) {
                onBlueprintMove(e);
            }
        }, { passive: true });

        blueprintSliderWrap.addEventListener('touchend', () => {
            isDraggingBlueprint = false;
        });
    }

    function startBlueprintIdleAnimation() {
        userInteractedWithSlider = false;
        let start = null;
        function step(now) {
            if (userInteractedWithSlider) return;
            if (!start) start = now;
            const elapsed = (now - start) / 1000;
            // Oscillate smoothly between 35% and 65%
            const pct = 50 + Math.sin(elapsed * 2.2) * 20;
            if (blueprintLayer && blueprintDragDivider) {
                blueprintLayer.style.width = `${pct}%`;
                blueprintDragDivider.style.left = `${pct}%`;
            }
            idleAnimFrame = requestAnimationFrame(step);
        }
        stopBlueprintIdleAnimation();
        idleAnimFrame = requestAnimationFrame(step);
    }

    function stopBlueprintIdleAnimation() {
        if (idleAnimFrame) {
            cancelAnimationFrame(idleAnimFrame);
            idleAnimFrame = null;
        }
    }

    /* ===================== 3D MAGNETIC TILT ON PROJECT CARDS ===================== */
    if (window.innerWidth > 768 && typeof projectCards !== 'undefined' && projectCards.length > 0) {
        projectCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
})();
