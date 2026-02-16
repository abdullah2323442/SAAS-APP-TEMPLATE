const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navWrap = document.querySelector(".nav-wrap");
const heroCard = document.querySelector(".hero-card");

const initializePreloader = () => {
  document.body.classList.add("is-loading");

  const preloader = document.createElement("div");
  preloader.className = "site-preloader";
  preloader.innerHTML = `
    <div class="preloader-inner" aria-hidden="true">
      <span class="preloader-logo"></span>
      <span class="preloader-spinner"></span>
      <span class="preloader-text">Loading AuroraFlow</span>
    </div>
  `;

  document.body.append(preloader);

  const finishLoading = () => {
    preloader.classList.add("hidden");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-loaded");
    window.setTimeout(() => preloader.remove(), 520);
  };

  if (document.readyState === "complete") {
    window.setTimeout(finishLoading, 250);
    return;
  }

  window.addEventListener("load", () => {
    window.setTimeout(finishLoading, 280);
  });
};

initializePreloader();

const initializeTextReveal = () => {
  const heroHeadings = document.querySelectorAll(".hero h1, .page-hero h1, .hero .lead, .page-hero .lead");

  heroHeadings.forEach((element, index) => {
    const text = element.textContent;
    const words = text.split(/\s+/);
    
    element.innerHTML = words
      .map((word, i) => {
        const delay = index === 0 ? i * 0.05 : i * 0.04;
        return `<span class="text-reveal" style="animation-delay: ${0.3 + delay}s">${word}</span>`;
      })
      .join(" ");
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTextReveal);
} else {
  initializeTextReveal();
}

const THEME_KEY = "auroraflow-theme";

const getPreferredTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
};

const updateThemeToggleA11y = (toggle, theme) => {
  const isDark = theme === "dark";
  toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  toggle.title = isDark ? "Light mode" : "Dark mode";
};

const initializeThemeSwitcher = () => {
  // Check if there's already a theme toggle button (e.g., on dashboard)
  const existingToggle = document.querySelector("[data-theme-switcher]");
  
  if (existingToggle) {
    let activeTheme = getPreferredTheme();
    setTheme(activeTheme);
    updateThemeToggleA11y(existingToggle, activeTheme);

    existingToggle.addEventListener("click", () => {
      activeTheme = activeTheme === "dark" ? "light" : "dark";
      setTheme(activeTheme);
      localStorage.setItem(THEME_KEY, activeTheme);
      updateThemeToggleA11y(existingToggle, activeTheme);
    });
    return;
  }

  if (!navWrap) return;

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "btn btn-ghost btn-sm theme-toggle";

  const updateToggleLabel = (theme) => {
    toggle.textContent = theme === "dark" ? "☀" : "☾";
    updateThemeToggleA11y(toggle, theme);
  };

  let activeTheme = getPreferredTheme();
  setTheme(activeTheme);
  updateToggleLabel(activeTheme);

  toggle.addEventListener("click", () => {
    activeTheme = activeTheme === "dark" ? "light" : "dark";
    setTheme(activeTheme);
    localStorage.setItem(THEME_KEY, activeTheme);
    updateToggleLabel(activeTheme);
  });

  navWrap.append(toggle);
};

initializeThemeSwitcher();

if (menuToggle && nav) {
  if (!nav.id) {
    nav.id = "primary-nav";
  }

  menuToggle.setAttribute("aria-controls", nav.id);
  menuToggle.setAttribute("aria-expanded", "false");

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const counters = document.querySelectorAll("[data-counter]");

const animateCounter = (el) => {
  const target = Number(el.dataset.counter || 0);
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if (counters.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

document.querySelectorAll("[data-faq]").forEach((question) => {
  question.addEventListener("click", () => {
    const item = question.parentElement;
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      openItem.classList.remove("open");
    });
    if (!isOpen) item.classList.add("open");
  });
});

const revealSelectors = ".card, .panel, .price-card, .faq-item, .chip, .contact-form, .contact-side article";
const revealItems = document.querySelectorAll(revealSelectors);

if (revealItems.length) {
  revealItems.forEach((element) => element.classList.add("reveal-item"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((element) => revealObserver.observe(element));
}

if (heroCard) {
  heroCard.addEventListener("pointermove", (event) => {
    const rect = heroCard.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width;
    const offsetY = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - offsetY) * 4;
    const rotateY = (offsetX - 0.5) * 6;
    heroCard.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  heroCard.addEventListener("pointerleave", () => {
    heroCard.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}

const magneticButtons = document.querySelectorAll(".btn");

magneticButtons.forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    button.style.transform = `translate(${x * 0.08}px, ${y * 0.1}px)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "translate(0, 0)";
  });
});

const initializeCursorSpotlight = () => {
  const desktopPointer = window.matchMedia("(pointer: fine)").matches;
  const desktopWidth = window.matchMedia("(min-width: 1025px)").matches;

  if (!desktopPointer || !desktopWidth) return;

  const spotlight = document.createElement("div");
  spotlight.className = "cursor-spotlight";
  document.body.append(spotlight);

  let targetX = -999;
  let targetY = -999;
  let currentX = -999;
  let currentY = -999;

  const animate = () => {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    spotlight.style.transform = `translate3d(${currentX - 160}px, ${currentY - 160}px, 0)`;
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);

  window.addEventListener("pointermove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    document.body.classList.add("spotlight-active");
  });

  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("spotlight-active");
  });
};

initializeCursorSpotlight();

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }

    const url = new URL(href, window.location.href);
    const isSameOrigin = url.origin === window.location.origin;
    const isSameTab = !link.target || link.target === "_self";
    const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    if (isSameOrigin && isSameTab && !isModified) {
      event.preventDefault();
      document.body.classList.add("is-leaving");
      window.setTimeout(() => {
        window.location.href = url.href;
      }, 180);
    }
  });
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const formStatus = contactForm.querySelector(".form-status");
  const requiredFields = contactForm.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (!field.checkValidity()) {
        field.setAttribute("aria-invalid", "true");
      } else {
        field.removeAttribute("aria-invalid");
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (!submitButton) return;

    if (!contactForm.checkValidity()) {
      requiredFields.forEach((field) => {
        if (!field.checkValidity()) {
          field.setAttribute("aria-invalid", "true");
        }
      });

      if (formStatus) {
        formStatus.classList.add("error");
        formStatus.textContent = "Please complete all required fields before submitting.";
      }
      return;
    }

    const originalText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;

    if (formStatus) {
      formStatus.classList.remove("error");
      formStatus.textContent = "";
    }

    window.setTimeout(() => {
      contactForm.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;

      requiredFields.forEach((field) => field.removeAttribute("aria-invalid"));

      if (formStatus) {
        formStatus.classList.remove("error");
        formStatus.textContent = "Request sent successfully. Our team will get back to you shortly.";
      }
    }, 1400);
  });
}
