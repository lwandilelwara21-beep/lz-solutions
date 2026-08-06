(() => {
  const BASE_URL = "https://lzsolutions.co.za";
  const WHATSAPP_NUMBER = "27695165196";
  const COOKIE_KEY = "lz_cookie_consent";
  const N8N_WEBHOOK_URL = "";

  const navLinks = [
    { href: "index.html", label: "Home" },
    { href: "services.html", label: "Solutions" },
    { href: "solutions-store.html", label: "Solutions Store" },
    { href: "portfolio.html", label: "Portfolio" },
    { href: "pricing.html", label: "Pricing" },
    { href: "resources.html", label: "Resources" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" }
  ];

  const quickLinks = [
    { href: "services.html", label: "Solutions" },
    { href: "solutions-store.html", label: "Solutions Store" },
    { href: "portfolio.html", label: "Portfolio" },
    { href: "pricing.html", label: "Pricing" },
    { href: "resources.html", label: "Resources" },
    { href: "client-portal.html", label: "Client Portal" },
    { href: "privacy.html", label: "Privacy Policy" },
    { href: "terms.html", label: "Terms" }
  ];

  const futureArchitecture = {
    commerce: ["Supplier partnerships", "Dropshipping", "Inventory", "Payments", "Order tracking"],
    product: ["Customer accounts", "Booking system", "Courses", "Community", "Affiliate program"],
    operations: ["Email marketing", "CRM integration", "LZ ClientFlow integration", "Analytics dashboard", "Invoice generation"],
    intelligence: ["AI recommendations", "Marketplace", "Academy", "AI platform"]
  };

  function currentPageName() {
    const path = window.location.pathname.split("/").pop();
    return path || "index.html";
  }

  function createSkipLink() {
    if (document.querySelector(".skip-link")) {
      return;
    }
    const link = document.createElement("a");
    link.className = "skip-link";
    link.href = "#main-content";
    link.textContent = "Skip to main content";
    document.body.insertAdjacentElement("afterbegin", link);

    const main = document.querySelector("main");
    if (main && !main.id) {
      main.id = "main-content";
      main.setAttribute("tabindex", "-1");
    }
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
              <a href="contact.html" class="mobile-consult-link">Book Consultation</a>
              <a href="client-portal.html" class="mobile-coming-soon-link">Client Portal <span class="soon-badge">Coming Soon</span></a>
            </nav>
            <div class="nav-action">
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
              <h4>Navigation</h4>
              <div class="footer-links">
                ${quickLinks.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
                <a href="faq.html">FAQ</a>
                <a href="project-enquiry.html">Project Enquiry</a>
                <a href="contact.html">Book Consultation</a>
                <a href="client-portal.html">Careers (Coming Soon)</a>
                <a href="client-portal.html">Partners (Coming Soon)</a>
              </div>
            </div>
            <div>
              <h4>Contact</h4>
              <div class="footer-links">
                <a href="https://wa.me/27695165196" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a href="tel:+27695165196" aria-label="Call LZ Solutions">069 516 5196</a>
                <a href="mailto:lwandilezengethwa772@gmail.com">lwandilezengethwa772@gmail.com</a>
                <a href="https://www.linkedin.com/in/lwandile-zengethwa" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://github.com/lwandilelwara21-beep" target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
              <form class="footer-newsletter" data-newsletter-form>
                <label for="newsletterEmail">Newsletter</label>
                <div class="newsletter-row">
                  <input id="newsletterEmail" name="newsletterEmail" type="email" placeholder="Enter your email" required>
                  <button type="submit" class="button button-outline">Subscribe</button>
                </div>
                <p class="success-message" data-newsletter-success aria-live="polite"></p>
              </form>
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
      wa.innerHTML = '<i data-lucide="message-circle" aria-hidden="true"></i>';
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

    createSkipLink();
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

  async function setupLucideIcons() {
    const render = () => {
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    };

    if (window.lucide) {
      render();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/lucide@0.462.0/dist/umd/lucide.min.js";
    script.defer = true;
    script.onload = render;
    document.head.appendChild(script);
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

  function setupNewsletterForm() {
    const form = document.querySelector("[data-newsletter-form]");
    if (!form) {
      return;
    }
    const success = form.querySelector("[data-newsletter-success]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const emailInput = form.querySelector("input[name='newsletterEmail']");
      const value = emailInput instanceof HTMLInputElement ? emailInput.value.trim() : "";
      if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
        if (success) {
          success.textContent = "Please enter a valid email address.";
        }
        return;
      }
      if (success) {
        success.textContent = "Thank you. You are on the newsletter list.";
      }
      form.reset();
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

  function setupImpactCounters() {
    const counters = document.querySelectorAll("[data-counter-target]");
    if (!counters.length) {
      return;
    }

    const animateCounter = (counter) => {
      const target = Number(counter.getAttribute("data-counter-target") || "0");
      const suffix = counter.getAttribute("data-counter-suffix") || "";
      const duration = 1300;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        counter.textContent = `${value}${suffix}`;
        if (progress < 1) {
          window.requestAnimationFrame(tick);
        }
      };
      window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach((counter) => observer.observe(counter));
  }

  function setupTestimonialsSlider() {
    const slider = document.querySelector("[data-testimonial-slider]");
    if (!slider) {
      return;
    }
    const slides = Array.from(slider.querySelectorAll(".testimonial-slide"));
    const prev = slider.querySelector("[data-slide-prev]");
    const next = slider.querySelector("[data-slide-next]");
    if (!slides.length || !(prev instanceof HTMLElement) || !(next instanceof HTMLElement)) {
      return;
    }

    let index = 0;
    const show = (nextIndex) => {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === index);
      });
    };

    prev.addEventListener("click", () => show(index - 1));
    next.addEventListener("click", () => show(index + 1));
    window.setInterval(() => show(index + 1), 6000);
    show(0);
  }

  function setupMediaOptimizations() {
    document.querySelectorAll("img").forEach((img, index) => {
      if (!img.loading) {
        img.loading = index < 2 ? "eager" : "lazy";
      }
      img.decoding = "async";
    });
  }

  function injectStructuredData() {
    const page = currentPageName();
    const title = document.title;

    const graph = [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "LZ Solutions",
        url: BASE_URL,
        logo: `${BASE_URL}/assets/images/logo.svg`,
        sameAs: [
          "https://www.linkedin.com/in/lwandile-zengethwa",
          "https://github.com/lwandilelwara21-beep"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        name: "LZ Solutions",
        url: BASE_URL,
        publisher: {
          "@id": `${BASE_URL}/#organization`
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${BASE_URL}/index.html`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title.replace(" | LZ Solutions", ""),
            item: `${BASE_URL}/${page}`
          }
        ]
      }
    ];

    if (page === "services.html") {
      graph.push({
        "@type": "Service",
        name: "Digital Solutions Services",
        provider: { "@id": `${BASE_URL}/#organization` },
        serviceType: ["Websites", "Software", "Automation", "Digital Growth"],
        areaServed: "South Africa"
      });
    }

    if (page === "solutions-store.html") {
      graph.push({
        "@type": "CollectionPage",
        name: "Solutions Store",
        description: "Curated collection of business and technology solutions."
      });
      graph.push({
        "@type": "Product",
        name: "Business Launch Kit",
        brand: "LZ Solutions",
        offers: {
          "@type": "Offer",
          priceCurrency: "ZAR",
          price: "0",
          availability: "https://schema.org/PreOrder"
        }
      });
    }

    if (page === "faq.html") {
      graph.push({
        "@type": "FAQPage",
        mainEntity: Array.from(document.querySelectorAll(".faq-item")).map((item) => {
          const q = item.querySelector(".faq-question");
          const a = item.querySelector(".faq-answer p");
          return {
            "@type": "Question",
            name: q ? q.textContent || "" : "",
            acceptedAnswer: {
              "@type": "Answer",
              text: a ? a.textContent || "" : ""
            }
          };
        })
      });
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(script);
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
    window.LZFutureArchitecture = futureArchitecture;
    injectLayout();
    setActiveNav();
    setupMobileNav();
    setupLucideIcons();
    setupRevealAnimations();
    setupProgressAndBackTop();
    setupFaqAccordion();
    setupCookieBanner();
    setupNewsletterForm();
    setupContactForm();
    setupImpactCounters();
    setupTestimonialsSlider();
    setupParticles();
    setupLoadingScreen();
    setupMediaOptimizations();
    setupCanonicalAndSeoFallback();
    injectStructuredData();
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
