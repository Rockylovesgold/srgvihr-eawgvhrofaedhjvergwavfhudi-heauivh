/**
 * ROCKMOUNT AI — Animations Module
 * Scroll reveal · Counter animation · Rotating text · Accordion
 * Filter system · Form validation · Toast · TOC · Cookie banner
 *
 * All motion respects prefers-reduced-motion.
 * GPU-friendly: opacity + transform only.
 */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


    /* ─── SCROLL REVEAL ─── */
    function initScrollReveal() {
        const els = document.querySelectorAll('[data-reveal], [data-stagger]');
        if (!els.length) return;

        if (prefersReducedMotion) {
            els.forEach(el => {
                if (el.dataset.stagger !== undefined) {
                    // Set stagger indexes even in reduced-motion for completeness
                    el.querySelectorAll(':scope > *').forEach((c, i) => {
                        c.style.setProperty('--stagger-index', i);
                    });
                    el.classList.add('revealed');
                } else {
                    el.classList.add('revealed');
                }
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;

                if (el.dataset.stagger !== undefined) {
                    // Add .revealed to the PARENT — CSS selects [data-stagger].revealed > *
                    el.classList.add('revealed');
                } else {
                    el.classList.add('revealed');
                }

                // Trigger counters inside revealed elements
                el.querySelectorAll('[data-count]').forEach(count => initCounter(count));
                observer.unobserve(el);
            });
        }, { threshold: 0.10, rootMargin: '0px 0px -56px 0px' });

        els.forEach(el => observer.observe(el));
    }


    /* ─── COUNTER ANIMATION ─── */
    function initCounter(el) {
        if (el.dataset.counted) return;
        el.dataset.counted = '1';

        const raw = el.dataset.count || '0';
        const suffix = raw.replace(/[\d.]/g, '');
        const target = parseFloat(raw.replace(/[^0-9.]/g, ''));
        const decimals = (raw.split('.')[1] || '').replace(/\D/g, '').length;

        if (prefersReducedMotion) {
            el.textContent = el.dataset.count;
            return;
        }

        const duration = 1800;
        let start = null;
        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
        function step(ts) {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            el.textContent = (target * easeOutCubic(p)).toFixed(decimals) + suffix;
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function initVisibleCounters() {
        document.querySelectorAll('[data-count]').forEach(el => {
            new IntersectionObserver(([entry], obs) => {
                if (entry.isIntersecting) { initCounter(el); obs.disconnect(); }
            }, { threshold: 0.5 }).observe(el);
        });
    }


    /* ─── ROTATING TEXT ─── */
    function initRotatingText(el) {
        let words;
        try { words = JSON.parse(el.dataset.words || '[]'); } catch { return; }
        if (!words.length) return;

        let current = 0;
        const interval = parseInt(el.dataset.interval || '3200', 10);
        el.textContent = words[0];

        if (prefersReducedMotion) return;

        setInterval(() => {
            el.style.transition = `opacity 120ms ease, transform 120ms ease`;
            el.style.opacity = '0';
            el.style.transform = 'translateY(-6px)';

            setTimeout(() => {
                current = (current + 1) % words.length;
                el.textContent = words[current];
                el.style.transform = 'translateY(6px)';
                el.style.opacity = '0';

                // Double rAF ensures browser has painted before transitioning in
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    el.style.transition = `opacity 200ms ease, transform 200ms ease`;
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }));
            }, 140);
        }, interval);
    }
    document.querySelectorAll('[data-rotating-text]').forEach(initRotatingText);


    /* ─── ACCORDION ─── */
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            if (!item) return;
            const isOpen = item.classList.contains('open');

            // Optionally close siblings
            const group = item.closest('[data-accordion-group]');
            if (group) {
                group.querySelectorAll('.accordion-item.open').forEach(other => {
                    if (other !== item) {
                        other.classList.remove('open');
                        other.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
                    }
                });
            }

            item.classList.toggle('open', !isOpen);
            trigger.setAttribute('aria-expanded', String(!isOpen));
        });

        trigger.addEventListener('keydown', (e) => {
            const all = Array.from(document.querySelectorAll('.accordion-trigger'));
            const i = all.indexOf(trigger);
            if (e.key === 'ArrowDown') { e.preventDefault(); all[i + 1]?.focus(); }
            if (e.key === 'ArrowUp') { e.preventDefault(); all[i - 1]?.focus(); }
            if (e.key === 'Home') { e.preventDefault(); all[0]?.focus(); }
            if (e.key === 'End') { e.preventDefault(); all[all.length - 1]?.focus(); }
        });
    });


    /* ─── FILTER SYSTEM ─── */
    document.querySelectorAll('.filter-bar').forEach(bar => {
        bar.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            bar.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filter = btn.dataset.filter;
            const section = bar.closest('section') || bar.parentElement;
            const grid = section?.querySelector('[data-filter-grid]') ||
                document.querySelector('[data-filter-grid]');
            if (!grid) return;

            const items = grid.querySelectorAll('[data-category]');
            items.forEach(item => {
                const cats = item.dataset.category || '';
                const match = filter === 'all' || cats.split(' ').includes(filter);

                if (match) {
                    item.style.display = '';
                    // Small delay so display:'' resolves before opacity transition
                    requestAnimationFrame(() => requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }));
                } else {
                    if (!prefersReducedMotion) {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(4px)';
                        const hide = () => { item.style.display = 'none'; };
                        item.addEventListener('transitionend', hide, { once: true });
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });

        // Init transition on filterable items
        const section = bar.closest('section') || bar.parentElement;
        const grid = section?.querySelector('[data-filter-grid]');
        if (grid && !prefersReducedMotion) {
            grid.querySelectorAll('[data-category]').forEach(item => {
                item.style.transition = 'opacity 200ms ease, transform 200ms ease';
            });
        }
    });


    /* ─── CONTACT FORM VALIDATION ─── */
    const contactForm = document.querySelector('form#contact-form');
    if (contactForm) {
        // Create or find aria-live status region
        let formStatus = document.getElementById('form-status');
        if (!formStatus) {
            formStatus = document.createElement('div');
            formStatus.id = 'form-status';
            formStatus.setAttribute('role', 'status');
            formStatus.setAttribute('aria-live', 'polite');
            formStatus.setAttribute('aria-atomic', 'true');
            formStatus.className = 'visually-hidden';
            contactForm.parentElement.insertBefore(formStatus, contactForm.nextSibling);
        }

        function validateField(input) {
            const errEl = document.getElementById(input.id + '-error');
            let isValid = input.value.trim() !== '';
            if (isValid && input.type === 'email') {
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
            }
            if (isValid && input.tagName === 'SELECT') {
                isValid = input.value !== '';
            }
            if (isValid && input.type === 'checkbox') {
                isValid = input.checked;
            }
            input.classList.toggle('error', !isValid);
            input.setAttribute('aria-invalid', String(!isValid));
            if (errEl) {
                errEl.style.display = isValid ? 'none' : 'flex';
            }
            return isValid;
        }

        contactForm.querySelectorAll('[required]').forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.getAttribute('aria-invalid') === 'true') validateField(input);
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let valid = true;
            contactForm.querySelectorAll('[required]').forEach(input => {
                if (!validateField(input)) valid = false;
            });

            if (valid) {
                contactForm.style.display = 'none';
                const confirm = document.getElementById('form-confirm');
                if (confirm) {
                    confirm.hidden = false;
                    confirm.style.display = '';
                }
                formStatus.textContent = 'Message sent successfully.';
                showToast('Message sent — we\'ll be in touch within 1 business day.', 'success');
            } else {
                // Focus first invalid field
                const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
                if (firstInvalid) firstInvalid.focus();
                // Count invalid fields for announcement
                const invalidCount = contactForm.querySelectorAll('[aria-invalid="true"]').length;
                formStatus.textContent = invalidCount + ' field' + (invalidCount !== 1 ? 's' : '') + ' require attention.';
                showToast('Please complete all required fields.', 'error');
            }
        });
    }


    /* ─── SUBSCRIBE FORMS ─── */
    document.querySelectorAll('.subscribe-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                showToast('You\'re subscribed. Look out for insights in your inbox.', 'success');
                input.value = '';
            } else {
                showToast('Please enter a valid email address.', 'error');
                if (input) input.focus();
            }
        });
    });


    /* ─── TOAST NOTIFICATIONS ─── */
    let toastTimeout;
    function showToast(message, type = 'info') {
        let toast = document.querySelector('.rm-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast rm-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.setAttribute('aria-atomic', 'true');
            document.body.appendChild(toast);
        }

        toast.className = `toast rm-toast toast-${type}`;
        toast.innerHTML = `<div class="toast-dot"></div><span>${message}</span>`;

        clearTimeout(toastTimeout);
        // Remove .active first so re-triggering animates in again
        toast.classList.remove('active');
        requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('active')));
        toastTimeout = setTimeout(() => toast.classList.remove('active'), 5000);
    }

    window.RM = window.RM || {};
    window.RM.showToast = showToast;


    /* ─── TOC ACTIVE STATE ─── */
    function initTOC() {
        const links = document.querySelectorAll('[data-toc-link]');
        if (!links.length) return;

        const headings = Array.from(links)
            .map(l => document.querySelector(l.getAttribute('href')))
            .filter(Boolean);

        if (!headings.length) return;

        // Use scroll-based detection: find the heading closest to top of viewport
        function updateTOC() {
            let activeIdx = 0;
            const scrollY = window.scrollY + window.innerHeight * 0.25;

            headings.forEach((h, i) => {
                if (h.getBoundingClientRect().top + window.scrollY <= scrollY) {
                    activeIdx = i;
                }
            });

            links.forEach((l, i) => l.classList.toggle('active', i === activeIdx));
        }

        // Initial call
        updateTOC();

        // Throttle scroll listener
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => { updateTOC(); ticking = false; });
                ticking = true;
            }
        }, { passive: true });
    }
    initTOC();


    /* ─── COOKIE BANNER ─── */
    function initCookieBanner() {
        const banner = document.querySelector('.cookie-banner');
        if (!banner) return;
        if (localStorage.getItem('rm-cookie')) return;

        setTimeout(() => banner.classList.add('active'), 1400);

        const acceptBtn = banner.querySelector('[data-cookie-accept]');
        const manageBtn = banner.querySelector('[data-cookie-manage]');

        acceptBtn?.addEventListener('click', () => {
            localStorage.setItem('rm-cookie', 'all');
            banner.classList.remove('active');
            showToast('Cookie preferences saved.', 'success');
        });

        manageBtn?.addEventListener('click', () => {
            const modal = document.getElementById('modal-cookie');
            if (modal && window.RM?.openModal) window.RM.openModal(modal, manageBtn);
        });

        // Save in cookie modal
        document.querySelector('[data-cookie-save]')?.addEventListener('click', () => {
            localStorage.setItem('rm-cookie', 'custom');
            banner.classList.remove('active');
            const modal = document.getElementById('modal-cookie');
            if (modal && window.RM?.closeModal) window.RM.closeModal(modal);
            showToast('Cookie preferences saved.', 'success');
        });

        // Footer "Cookie preferences" button
        document.querySelectorAll('[data-cookie-manage]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = document.getElementById('modal-cookie');
                if (modal && window.RM?.openModal) window.RM.openModal(modal, btn);
            });
        });
    }


    /* ─── CHART LINE ANIMATION ─── */
    document.querySelectorAll('.chart-container').forEach(container => {
        const line = container.querySelector('.chart-line');
        if (!line || prefersReducedMotion) return;
        new IntersectionObserver(([entry], obs) => {
            if (entry.isIntersecting) { line.classList.add('animated'); obs.disconnect(); }
        }, { threshold: 0.4 }).observe(container);
    });


    /* ─── DELIVERY TIMELINE BAR CHART ─── */
    function initTimelineChart() {
        const bars = document.querySelectorAll('[data-timeline-bar]');
        if (!bars.length || prefersReducedMotion) return;

        const observe = new IntersectionObserver(([entry], obs) => {
            if (!entry.isIntersecting) return;
            obs.disconnect();
            bars.forEach((bar, i) => {
                const width = bar.dataset.timelineBar || '0';
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, i * 80);
            });
        }, { threshold: 0.3 });

        // Observe first bar's parent section
        const parent = bars[0].closest('section') || bars[0].parentElement;
        if (parent) observe.observe(parent);
    }
    initTimelineChart();


    /* ─── LEGAL PAGE NAV ─── */
    const legalNavBtns = document.querySelectorAll('.legal-nav-btn');
    if (legalNavBtns.length) {
        legalNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                legalNavBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Sync on hash
        const syncFromHash = () => {
            const hash = window.location.hash;
            if (hash) {
                legalNavBtns.forEach(b => b.classList.remove('active'));
                const match = document.querySelector(`.legal-nav-btn[href="${hash}"]`);
                if (match) match.classList.add('active');
            }
        };
        syncFromHash();
        window.addEventListener('hashchange', syncFromHash);
    }


    /* ─── HOVER ACTIVE STATE on career/news filter ─── */
    // Keyboard: pressing Enter on filter-btn fires click
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    });


    /* ─── STAGGER INDEX INJECTION ─── */
    function initStaggerIndexes() {
        document.querySelectorAll('[data-stagger]').forEach(wrapper => {
            const children = wrapper.querySelectorAll(':scope > *');
            children.forEach((child, i) => {
                child.style.setProperty('--stagger-index', i);
            });
        });
    }


    /* ─── GLOBE INITIALIZATION ─── */
    function initGlobeCanvas() {
        const globeCanvas = document.getElementById('globe-canvas');
        if (globeCanvas && typeof window.initGlobe === 'function') {
            window.initGlobe('globe-canvas', {
                dotColor: 'rgba(200, 205, 214, ALPHA)', // Silver dots
                arcColor: 'rgba(138, 148, 159, 0.4)', // Steel arcs
                markerColor: 'rgba(255, 255, 255, 1)' // White markers
            });
        }
    }

    /* ─── INIT ─── */
    function init() {
        initScrollReveal();
        initStaggerIndexes();
        initVisibleCounters();
        initCookieBanner();
        initGlobeCanvas();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
