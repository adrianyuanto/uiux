/**
 * Portfolio Showcase - Main JavaScript
 * Handles: Navigation, Animations, Project Loading, Forms, Interactions
 */

(function () {
  'use strict';

  // ---- DOM READY ----
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initLoader();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initBackToTop();
    initContactForm();
    loadProjects();
    initProcessAnimation();
    initParallax();
    initThemeToggle();
    initLazyIframes();
  }

  // ---- PAGE LOADER ----
  function initLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    // Fallback
    setTimeout(() => loader.classList.add('hidden'), 2500);
  }

  // ---- NAVBAR ----
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (sections.length && navLinks.length) {
      window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
          const top = section.offsetTop - 100;
          if (window.pageYOffset >= top) {
            current = section.getAttribute('id');
          }
        });
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
          }
        });
      }, { passive: true });
    }
  }

  // ---- MOBILE MENU ----
  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!toggle || !mobileMenu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- SCROLL REVEAL ANIMATIONS ----
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  }

  // ---- SMOOTH SCROLL ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }

  // ---- BACK TO TOP ----
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- LOAD PROJECTS FROM JSON ----
  function loadProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // Show skeletons
    grid.innerHTML = generateSkeletons(6);

    fetch('projects.json')
      .then(res => res.json())
      .then(projects => {
        setTimeout(() => {
          renderProjects(projects, grid);
          initFilterBar(projects, grid);
        }, 600);
      })
      .catch(err => {
        console.error('Failed to load projects:', err);
        grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:60px 0;">Unable to load projects.</p>';
      });
  }

  function generateSkeletons(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="project-card">
          <div class="project-thumb skeleton" style="height:240px;"></div>
          <div class="project-body">
            <div class="skeleton" style="height:24px;width:60%;margin-bottom:12px;"></div>
            <div class="skeleton" style="height:14px;width:100%;margin-bottom:8px;"></div>
            <div class="skeleton" style="height:14px;width:80%;margin-bottom:20px;"></div>
            <div style="display:flex;gap:8px;">
              <div class="skeleton" style="height:24px;width:60px;border-radius:20px;"></div>
              <div class="skeleton" style="height:24px;width:80px;border-radius:20px;"></div>
            </div>
          </div>
        </div>`;
    }
    return html;
  }

  function renderProjects(projects, grid) {
    grid.innerHTML = '';
    if (!projects.length) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);grid-column:1/-1;padding:60px 0;">No projects found.</p>';
      return;
    }

    const icons = ['V', 'S', 'E', 'H', 'F', 'C', 'G', 'M'];
    projects.forEach((project, i) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.style.transitionDelay = `${i * 0.1}s`;
      card.dataset.category = project.category;

      let iconHtml = `<div class="project-thumb-icon" style="background: ${project.color};">${icons[i % icons.length]}</div>`;
      if (project.title === 'VOLT') {
        iconHtml = `
          <div class="project-thumb-icon" style="background: #EAFF00; color: #000; display: flex; align-items: center; justify-content: center; padding: 18px; border: 2px solid #000; box-shadow: 3px 3px 0px #000;">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;" fill="currentColor" fill-rule="evenodd">
              <path d="M20 20H42.5L50 52L57.5 20H80L59.5 80H40.5L20 20Z M53 50L45 61H54L48 78L55 64H46L53 50Z"/>
            </svg>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="project-thumb" style="background: linear-gradient(135deg, ${project.color}22, ${project.color}11);">
          <div class="project-thumb-inner">
            <div class="project-thumb-bg"></div>
            ${iconHtml}
          </div>
          <span class="project-category-badge">${project.category}</span>
        </div>
        <div class="project-body">
          <h3 class="project-card-title">${project.title}</h3>
          <p class="project-card-desc">${project.description}</p>
          <div class="project-tags">
            ${project.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <div class="project-card-footer">
            <span class="project-meta">${project.year} · ${project.role}</span>
            <a href="${project.caseStudy}" class="project-link">
              View Case Study <span class="btn-icon">→</span>
            </a>
          </div>
        </div>`;

      grid.appendChild(card);
    });

    // Re-init reveal for new cards
    setTimeout(initScrollReveal, 100);
  }

  // ---- FILTER BAR ----
  function initFilterBar(projects, grid) {
    const filterBar = document.getElementById('filter-bar');
    if (!filterBar) return;

    const categories = ['All', ...new Set(projects.map(p => p.category))];
    filterBar.innerHTML = '';

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (cat === 'All') {
          renderProjects(projects, grid);
        } else {
          renderProjects(projects.filter(p => p.category === cat), grid);
        }
      });
      filterBar.appendChild(btn);
    });
  }

  // ---- PROCESS TIMELINE ANIMATION ----
  function initProcessAnimation() {
    const lineFill = document.querySelector('.process-line-fill');
    const steps = document.querySelectorAll('.process-step');
    if (!lineFill || !steps.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          lineFill.classList.add('animate');
          steps.forEach((step, i) => {
            setTimeout(() => step.classList.add('active'), i * 300);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(lineFill.parentElement);
  }

  // ---- PARALLAX ----
  function initParallax() {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // ---- CONTACT FORM ----
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '✓ Message Sent!';
      submitBtn.style.background = 'var(--success)';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  // ---- PROTOTYPE VIEWER (for project detail pages) ----
  window.initPrototypeViewer = function (prototypes) {
    const tabsContainer = document.getElementById('proto-tabs');
    const frame = document.getElementById('proto-iframe');
    const deviceFrame = document.querySelector('.proto-device-frame');
    if (!tabsContainer || !frame) return;

    let currentIndex = 0;

    // Render tabs
    tabsContainer.innerHTML = '';
    if (prototypes.length > 1) {
      prototypes.forEach((proto, i) => {
        const tab = document.createElement('button');
        tab.className = 'proto-tab' + (i === 0 ? ' active' : '');
        tab.textContent = proto.name;
        tab.addEventListener('click', () => {
          tabsContainer.querySelectorAll('.proto-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          currentIndex = i;
          frame.src = proto.embedUrl;
        });
        tabsContainer.appendChild(tab);
      });
      tabsContainer.style.display = 'flex';
    } else {
      tabsContainer.style.display = 'none';
    }

    // Load first prototype
    if (prototypes.length > 0) {
      frame.src = prototypes[0].embedUrl;
    }

    // Device selector
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const device = btn.dataset.device;
        if (deviceFrame) {
          deviceFrame.className = 'proto-device-frame ' + device;
        }
      });
    });

    // Controls
    const fullscreenBtn = document.getElementById('proto-fullscreen');
    const reloadBtn = document.getElementById('proto-reload');
    const openFigmaBtn = document.getElementById('proto-open-figma');

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (frame.requestFullscreen) frame.requestFullscreen();
        else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
      });
    }

    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        frame.src = frame.src;
      });
    }

    if (openFigmaBtn) {
      openFigmaBtn.addEventListener('click', () => {
        window.open(prototypes[currentIndex].embedUrl, '_blank');
      });
    }
  };

  // ---- LIGHTBOX ----
  window.openLightbox = function (src) {
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <button class="lightbox-close" onclick="closeLightbox()">✕</button>
        <img src="" alt="Preview">`;
      document.body.appendChild(lightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }
    lightbox.querySelector('img').src = src;
    requestAnimationFrame(() => lightbox.classList.add('active'));
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---- THEME TOGGLE ----
  function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    if (!toggleBtns.length) return;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcons(savedTheme);

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcons(newTheme);
      });
    });

    function updateToggleIcons(theme) {
      toggleBtns.forEach(btn => {
        const icon = btn.querySelector('.theme-toggle-icon');
        if (icon) {
          icon.innerHTML = theme === 'light' ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
        }
      });
    }
  }

  // ---- LAZY LOADING IFRAMES ----
  function initLazyIframes() {
    const lazyIframes = document.querySelectorAll('.lazy-iframe');
    if (!lazyIframes.length) return;

    // Observer to LOAD iframe when it comes into view
    const loadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const iframe = entry.target;
        if (entry.isIntersecting) {
          if (!iframe.src && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
          }
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0
    });

    // Observer to UNLOAD iframe when it's far from view (save RAM)
    const unloadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const iframe = entry.target;
        if (!entry.isIntersecting && iframe.src) {
          iframe.src = '';
        }
      });
    }, {
      rootMargin: '800px 0px',
      threshold: 0
    });

    lazyIframes.forEach(iframe => {
      loadObserver.observe(iframe);
      unloadObserver.observe(iframe);
    });
  }

})();
