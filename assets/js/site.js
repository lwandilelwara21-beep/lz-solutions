(() => {
  const BASE_URL = "https://lzsolutions.co.za";
  const WHATSAPP_NUMBER = "27695165196";
  const COOKIE_KEY = "lz_cookie_consent";
  const N8N_WEBHOOK_URL = "";

  const navLinks = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "services.html", label: "Services" },
    { href: "portfolio.html", label: "Portfolio" },
    { href: "pricing.html", label: "Pricing" },
    { href: "process.html", label: "Process" },
    { href: "faq.html", label: "FAQ" },
    { href: "contact.html", label: "Contact" }
  ];

  const quickLinks = [
    { href: "services.html", label: "Services" },
    { href: "portfolio.html", label: "Portfolio" },
    { href: "pricing.html", label: "Pricing" },
    { href: "contact.html", label: "Contact" },
    { href: "project-enquiry.html", label: "Project Enquiry" },
    { href: "privacy.html", label: "Privacy Policy" },
    { href: "terms.html", label: "Terms & Conditions" }
  ];

  function currentPageName() {
    const path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function injectLayout() {
    const headerRoot = document.querySelector("[data-site-header]");
    const footerRoot = document.querySelector("[data-site-footer]");

    if (headerRoot) {
      headerRoot.innerHTML = `
        <header class="site-header">
          <div class="container navbar">
            <a class="nav-brand header-brand" href="index.html" aria-label="LZ Solutions home">
              <span class="brand-logo-wrap">
                <img class="brand-logo" src="assets/images/lz-icon.png" alt="LZ Solutions icon">
              </span>
              <span class="brand-text">
                <span class="brand-name">LZ Solutions</span>
                <span class="brand-tagline">Your Vision. Our Solution.</span>
              </span>
            </a>
            <nav class="nav-links" id="siteNav" aria-label="Primary">
              ${navLinks.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
            </nav>
            <div class="nav-action">
              <a class="button button-primary" href="contact.html">Get Quote</a>
              <button class="mobile-toggle" id="mobileToggle" aria-controls="siteNav" aria-expanded="false" aria-label="Toggle navigation menu">☰</button>
            </div>
          </div>
        </header>
      `;
    }

    if (footerRoot) {
      footerRoot.innerHTML = `
        <footer class="site-footer">
          <div class="container footer-inner">
            <div>
              <a class="nav-brand" href="index.html" aria-label="LZ Solutions home">
                <span class="brand-logo-wrap">
                  <img class="brand-logo" src="assets/images/lz-solutions-logo.png" alt="LZ Solutions logo">
                </span>
              </a>
              <p class="text-muted">Based across East London and Cape Town, proudly serving businesses throughout South Africa.</p>
              <p class="notice">Monday-Friday | 08:00-17:00 | Remote projects across South Africa</p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <div class="footer-links">
                ${quickLinks.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
              </div>
            </div>
            <div>
              <h4>Contact</h4>
              <div class="footer-links">
                <a href="tel:+27695165196" aria-label="Call LZ Solutions">069 516 5196</a>
                <a href="mailto:lwandilezengethwa772@gmail.com">lwandilezengethwa772@gmail.com</a>
                <a href="https://www.linkedin.com/in/lwandile-zengethwa" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/lwandilelwara21-beep" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            </div>
          </div>
          <div class="container footer-bottom">© 2026 LZ Solutions. All rights reserved.</div>
        </footer>
      `;
    }

    if (!document.querySelector(".top-progress")) {
      const progress = document.createElement("div");
      progress.className = "top-progress";
      progress.setAttribute("aria-hidden", "true");
      document.body.appendChild(progress);
    }

    if (!document.querySelector(".back-to-top")) {
      const backTop = document.createElement("button");
      backTop.className = "back-to-top";
      backTop.type = "button";
      backTop.setAttribute("aria-label", "Back to top");
      backTop.innerHTML = "↑";
      document.body.appendChild(backTop);
    }

    if (!document.querySelector(".floating-whatsapp")) {
      const wa = document.createElement("a");
      wa.className = "floating-whatsapp";
      wa.href = `https://wa.me/${WHATSAPP_NUMBER}`;
      wa.target = "_blank";
      wa.rel = "noopener noreferrer";
      wa.setAttribute("aria-label", "Open WhatsApp chat");
      wa.innerHTML = "💬";
      document.body.appendChild(wa);
    }

    if (!document.querySelector(".cookie-banner")) {
      const cookieBanner = document.createElement("div");
      cookieBanner.className = "cookie-banner";
      cookieBanner.innerHTML = `
        <p class="notice">We use cookies and analytics placeholders to improve your experience. By continuing, you accept essential cookies.</p>
        <button class="button button-outline" type="button" id="cookieAccept">Accept</button>
      `;
      document.body.appendChild(cookieBanner);
    }

    if (!document.querySelector(".loading-screen")) {
      const loading = document.createElement("div");
      loading.className = "loading-screen";
      loading.innerHTML = `<div class="loader-ring" aria-label="Loading"></div>`;
      document.body.appendChild(loading);
    }
  }

  function setActiveNav() {
    const page = currentPageName();
    document.querySelectorAll(".nav-links a").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === page) {
        link.classList.add("active-link");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function setupMobileNav() {
    const button = document.getElementById("mobileToggle");
    const nav = document.getElementById("siteNav");
    if (!button || !nav) {
      return;
    }

    button.addEventListener("click", () => {
      nav.classList.toggle("open");
      const expanded = nav.classList.contains("open");
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLElement && event.target.tagName === "A") {
        nav.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  function setupRevealAnimations() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    if (!revealItems.length) {
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    revealItems.forEach((element) => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }

  function setupProgressAndBackTop() {
    const progress = document.querySelector(".top-progress");
    const backTop = document.querySelector(".back-to-top");
    if (!progress || !backTop) {
      return;
    }

    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = total > 0 ? (window.scrollY / total) * 100 : 0;
      progress.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;

      if (window.scrollY > 460) {
        backTop.classList.add("show");
      } else {
        backTop.classList.remove("show");
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupFaqAccordion() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) {
      return;
    }

    items.forEach((item) => {
      const button = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!button || !answer) {
        return;
      }

      button.addEventListener("click", () => {
        const open = item.classList.contains("open");
        items.forEach((other) => {
          other.classList.remove("open");
          const otherAnswer = other.querySelector(".faq-answer");
          const otherButton = other.querySelector(".faq-question");
          if (otherAnswer) {
            otherAnswer.style.maxHeight = "0px";
          }
          if (otherButton) {
            otherButton.setAttribute("aria-expanded", "false");
          }
        });

        if (!open) {
          item.classList.add("open");
          answer.style.maxHeight = `${answer.scrollHeight + 8}px`;
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function setupCookieBanner() {
    const banner = document.querySelector(".cookie-banner");
    const button = document.getElementById("cookieAccept");
    if (!banner || !button) {
      return;
    }

    const accepted = localStorage.getItem(COOKIE_KEY);
    if (accepted === "yes") {
      banner.classList.add("hide");
      return;
    }

    button.addEventListener("click", () => {
      localStorage.setItem(COOKIE_KEY, "yes");
      banner.classList.add("hide");
    });
  }

  function setupContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) {
      return;
    }

    const success = form.querySelector("[data-form-success]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      form.querySelectorAll(".error-text").forEach((el) => el.remove());
      if (success) {
        success.textContent = "";
      }

      const data = new FormData(form);
      const requiredFields = ["name", "email", "phone", "service", "message"];
      let hasError = false;

      requiredFields.forEach((field) => {
        const value = String(data.get(field) || "").trim();
        if (!value) {
          hasError = true;
          const input = form.querySelector(`[name="${field}"]`);
          if (input) {
            const error = document.createElement("span");
            error.className = "error-text";
            error.textContent = "This field is required.";
            input.insertAdjacentElement("afterend", error);
          }
        }
      });

      const email = String(data.get("email") || "").trim();
      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        hasError = true;
        const input = form.querySelector("[name='email']");
        if (input) {
          const error = document.createElement("span");
          error.className = "error-text";
          error.textContent = "Please enter a valid email address.";
          input.insertAdjacentElement("afterend", error);
        }
      }

      if (hasError) {
        return;
      }

      const payload = {
        name: data.get("name"),
        email: data.get("email"),
        phone: data.get("phone"),
        businessName: data.get("businessName"),
        location: data.get("location"),
        budget: data.get("budget"),
        service: data.get("service"),
        message: data.get("message"),
        submittedAt: new Date().toISOString(),
        source: window.location.href
      };

      // Future n8n webhook integration point.
      if (N8N_WEBHOOK_URL) {
        try {
          await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
        } catch (_error) {
          // Keep UX smooth if webhook fails during setup stage.
        }
      }

      form.reset();
      if (success) {
        success.textContent = "Thank you. Your message has been prepared successfully and we will contact you shortly.";
      }
    });
  }

  function setupParticles() {
    const canvas = document.querySelector("#particleCanvas");
    if (!(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let width = 0;
    let height = 0;
    let animationId = 0;

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.1 + 0.8,
      speedX: (Math.random() - 0.5) * 0.00055,
      speedY: (Math.random() - 0.5) * 0.00055
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        return;
      }
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(145, 186, 255, 0.6)";

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > 1) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > 1) {
          particle.speedY *= -1;
        }

        const x = particle.x * width;
        const y = particle.y * height;

        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 0.18) {
            ctx.strokeStyle = `rgba(128, 176, 255, ${0.17 - dist / 1.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x * width, p1.y * height);
            ctx.lineTo(p2.x * width, p2.y * height);
            ctx.stroke();
          }
        }
      }

      animationId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    window.addEventListener("beforeunload", () => {
      window.cancelAnimationFrame(animationId);
    });
  }

  function setupLoadingScreen() {
    const loading = document.querySelector(".loading-screen");
    if (!loading) {
      return;
    }

    window.addEventListener("load", () => {
      loading.classList.add("hidden");
    });

    // Fallback if load event already fired.
    window.setTimeout(() => {
      loading.classList.add("hidden");
    }, 1100);
  }

  function setupCanonicalAndSeoFallback() {
    const canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      return;
    }

    const page = currentPageName();
    canonical.setAttribute("href", `${BASE_URL}/${page}`);
  }

  function bootstrap() {
    injectLayout();
    setActiveNav();
    setupMobileNav();
    setupRevealAnimations();
    setupProgressAndBackTop();
    setupFaqAccordion();
    setupCookieBanner();
    setupContactForm();
    setupParticles();
    setupLoadingScreen();
    setupCanonicalAndSeoFallback();
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
