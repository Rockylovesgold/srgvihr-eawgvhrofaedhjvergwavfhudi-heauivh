/**
 * ROCKMOUNT AI — Navigation Module
 * Sticky header · Mega menus (keyboard) · Mobile nav
 * Modal system (focus trap, ESC, restore focus) · Search dialog (Cmd+K)
 * Region selector · External link interstitial · Active link highlight
 * Accessible: WCAG 2.2 AA, roving tabindex, ESC everywhere
 */

(function () {
    'use strict';

    /* ─── FOCUSABLE QUERY ─── */
    const FOCUSABLE = [
        'a[href]', 'button:not([disabled])', 'input:not([disabled])',
        'select:not([disabled])', 'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    let activeModalTrigger = null;


    /* ─── MODAL SYSTEM ─── */
    function openModal(modalEl, triggerEl) {
        if (!modalEl) return;
        // Close any other open modals first
        document.querySelectorAll('.modal-backdrop.open').forEach(m => {
            if (m !== modalEl) closeModal(m);
        });

        activeModalTrigger = triggerEl || document.activeElement;
        modalEl.setAttribute('aria-hidden', 'false');
        modalEl.classList.add('open');
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            const first = modalEl.querySelector(FOCUSABLE);
            if (first) first.focus();
        });

        modalEl.addEventListener('keydown', trapFocus);
    }

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.classList.remove('open');
        document.body.style.overflow = '';
        modalEl.removeEventListener('keydown', trapFocus);

        if (activeModalTrigger && typeof activeModalTrigger.focus === 'function') {
            activeModalTrigger.focus();
        }
        activeModalTrigger = null;
    }

    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        const modal = e.currentTarget;
        const focusable = Array.from(modal.querySelectorAll(FOCUSABLE)).filter(
            el => !el.closest('[aria-hidden="true"]') && el.offsetParent !== null
        );
        if (!focusable.length) { e.preventDefault(); return; }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }

    // ESC closes any open modal or mobile nav
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const openModal = document.querySelector('.modal-backdrop.open');
        if (openModal) { closeModal(openModal); return; }

        // Also close mega menus on ESC
        document.querySelectorAll('.mega-menu.open').forEach(m => {
            m.classList.remove('open');
            m.closest('.nav-item')?.removeAttribute('data-mega-open');
            const trigger = m.closest('.nav-item')?.querySelector('[aria-expanded]');
            if (trigger) { trigger.setAttribute('aria-expanded', 'false'); trigger.focus(); }
        });
    });

    // Backdrop click closes
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal(backdrop);
        });
    });

    // [data-modal-close] buttons
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-backdrop');
            if (modal) closeModal(modal);
        });
    });

    // Expose globally
    window.RM = window.RM || {};
    window.RM.openModal = openModal;
    window.RM.closeModal = closeModal;


    /* ─── STICKY HEADER (IntersectionObserver, no layout shift) ─── */
    const header = document.querySelector('.site-header');
    if (header) {
        const sentinel = document.createElement('div');
        sentinel.style.cssText = 'position:absolute;top:80px;left:0;height:1px;width:1px;pointer-events:none;aria-hidden:true;';
        sentinel.setAttribute('aria-hidden', 'true');
        document.body.prepend(sentinel);

        new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { threshold: 0 }).observe(sentinel);
    }


    /* ─── MOBILE NAV ─── */
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger && mobileNav) {
        function openMobileNav() {
            mobileNav.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Close navigation');
            document.body.style.overflow = 'hidden';
            const first = mobileNav.querySelector(FOCUSABLE);
            if (first) requestAnimationFrame(() => first.focus());
        }

        function closeMobileNav() {
            mobileNav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation');
            document.body.style.overflow = '';
            hamburger.focus();
        }

        hamburger.addEventListener('click', () => {
            mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                closeMobileNav();
            }
        });

        // Trap focus inside mobile nav
        mobileNav.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            const focusable = Array.from(mobileNav.querySelectorAll(FOCUSABLE));
            if (!focusable.length) { e.preventDefault(); return; }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }


    /* ─── MEGA MENUS (keyboard + mouse) ─── */
    document.querySelectorAll('.nav-item[data-mega]').forEach(navItem => {
        const trigger = navItem.querySelector('.nav-link');
        const menu = navItem.querySelector('.mega-menu');
        if (!trigger || !menu) return;

        const links = Array.from(menu.querySelectorAll(FOCUSABLE));
        let hoverTimeout;

        function openMenu() {
            clearTimeout(hoverTimeout);
            document.querySelectorAll('.mega-menu.open').forEach(m => {
                if (m !== menu) {
                    m.classList.remove('open');
                    m.closest('.nav-item')?.removeAttribute('data-mega-open');
                    m.closest('.nav-item')?.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
                }
            });
            menu.classList.add('open');
            navItem.setAttribute('data-mega-open', '');
            trigger.setAttribute('aria-expanded', 'true');
        }

        function closeMenu(restoreFocus = false) {
            hoverTimeout = setTimeout(() => {
                menu.classList.remove('open');
                navItem.removeAttribute('data-mega-open');
                trigger.setAttribute('aria-expanded', 'false');
                if (restoreFocus) trigger.focus();
            }, 80);
        }

        navItem.addEventListener('mouseenter', openMenu);
        navItem.addEventListener('mouseleave', () => closeMenu(false));
        menu.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
        menu.addEventListener('mouseleave', () => closeMenu(false));

        // Keyboard on trigger
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                if (menu.classList.contains('open')) {
                    clearTimeout(hoverTimeout);
                    menu.classList.remove('open');
                    navItem.removeAttribute('data-mega-open');
                    trigger.setAttribute('aria-expanded', 'false');
                } else {
                    openMenu();
                    requestAnimationFrame(() => links[0]?.focus());
                }
            }
            if (e.key === 'Escape') {
                clearTimeout(hoverTimeout);
                menu.classList.remove('open');
                navItem.removeAttribute('data-mega-open');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        });

        // Roving tabindex within menu
        links.forEach((link, i) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length]?.focus(); }
                if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length]?.focus(); }
                if (e.key === 'Home') { e.preventDefault(); links[0]?.focus(); }
                if (e.key === 'End') { e.preventDefault(); links[links.length - 1]?.focus(); }
                if (e.key === 'Escape') {
                    clearTimeout(hoverTimeout);
                    menu.classList.remove('open');
                    navItem.removeAttribute('data-mega-open');
                    trigger.setAttribute('aria-expanded', 'false');
                    trigger.focus();
                }
                // Tab on last item: close and let focus move naturally
                if (e.key === 'Tab' && !e.shiftKey && i === links.length - 1) {
                    clearTimeout(hoverTimeout);
                    menu.classList.remove('open');
                    navItem.removeAttribute('data-mega-open');
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    });

    // Click outside closes mega menus
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item[data-mega]')) {
            document.querySelectorAll('.mega-menu.open').forEach(m => {
                m.classList.remove('open');
                m.closest('.nav-item')?.removeAttribute('data-mega-open');
                m.closest('.nav-item')?.querySelector('[aria-expanded]')?.setAttribute('aria-expanded', 'false');
            });
        }
    });


    /* ─── SEARCH DIALOG ─── */
    const searchOpen = document.getElementById('search-open');
    const searchModal = document.getElementById('modal-search');
    const searchField = searchModal?.querySelector('#search-field');

    if (searchOpen && searchModal) {
        searchOpen.addEventListener('click', () => {
            openModal(searchModal, searchOpen);
            requestAnimationFrame(() => searchField?.focus());
        });
    }

    // Kbd shortcut: Cmd/Ctrl + K
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (!searchModal) return;
            if (searchModal.classList.contains('open')) {
                closeModal(searchModal);
            } else {
                openModal(searchModal, document.activeElement);
                requestAnimationFrame(() => searchField?.focus());
            }
        }
    });


    /* ─── REGION SELECTOR ─── */
    const regionBtn = document.querySelector('.region-btn');
    const regionModal = document.getElementById('modal-region');
    if (regionBtn && regionModal) {
        // Load persisted region
        const savedRegion = localStorage.getItem('rm-region');
        if (savedRegion) {
            const span = regionBtn.querySelector('span:not(.arrow)');
            if (span) span.textContent = savedRegion;
            else regionBtn.textContent = savedRegion;
        }

        regionBtn.addEventListener('click', () => openModal(regionModal, regionBtn));

        regionModal.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-region]');
            if (!btn) return;
            const region = btn.getAttribute('data-region');
            localStorage.setItem('rm-region', region);
            const span = regionBtn.querySelector('span:not(.arrow)');
            if (span) span.textContent = region;
            else regionBtn.textContent = region;
            closeModal(regionModal);
        });
    }


    /* ─── EXTERNAL LINK INTERSTITIAL ─── */
    const externalModal = document.getElementById('modal-external');
    const externalConfirm = document.getElementById('external-confirm');
    const externalDomainSpan = document.getElementById('external-domain');
    let externalUrl = '';

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

        try {
            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) {
                e.preventDefault();
                externalUrl = href;
                if (externalDomainSpan) {
                    externalDomainSpan.textContent = url.hostname;
                }
                if (externalModal) openModal(externalModal, link);
            }
        } catch { /* relative URL or invalid — allow through */ }
    });

    if (externalConfirm) {
        externalConfirm.addEventListener('click', () => {
            if (externalModal) closeModal(externalModal);
            if (externalUrl) window.open(externalUrl, '_blank', 'noopener,noreferrer');
            externalUrl = '';
        });
    }

    // Cancel button in external modal
    document.querySelector('#modal-external [data-modal-close]')?.addEventListener('click', () => {
        externalUrl = '';
    });


    /* ─── ACTIVE NAV LINK ─── */
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === currentPath || href === './' + currentPath)) {
            link.classList.add('active');
        }
    });

})();
