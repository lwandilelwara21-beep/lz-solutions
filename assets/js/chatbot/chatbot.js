(() => {
  try {
    const config = window.LZChatbotConfig;
    const knowledge = window.LZChatbotKnowledge;
    const intentEngine = window.LZChatbotIntent;

    if (!config || !knowledge || !intentEngine) {
      return;
    }

    const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const mainPages = ["index.html", "about.html", "services.html", "solutions-store.html", "portfolio.html", "pricing.html", "process.html", "faq.html", "resources.html", "contact.html", "project-enquiry.html", "client-portal.html"];
    if (!mainPages.includes(page)) {
      return;
    }

    const state = {
      open: false,
      waiting: false,
      interactionSeen: false,
      flow: null,
      flowStep: 0,
      recommendationAnswers: {},
      leadAnswers: {},
      leadLastHash: "",
      leadLastSubmittedAt: 0,
      userName: ""
    };

    const recommendationQuestions = [
      { key: "businessType", question: "What type of business do you run?" },
      { key: "hasWebsite", question: "Do you already have a website?" },
      { key: "pages", question: "Approximately how many pages or sections do you need?" },
      { key: "commerce", question: "Do you need bookings, online payments or an online shop?" },
      { key: "automation", question: "Do you need automation or integrations?" },
      { key: "timeline", question: "When would you like the project completed?" }
    ];

    const leadQuestions = [
      { key: "fullName", question: "Please share your full name.", required: true },
      { key: "businessName", question: "What is your business name?", required: true },
      { key: "email", question: "What is your email address?", required: true, type: "email" },
      { key: "phone", question: "What is your phone number?", required: true, type: "phone" },
      { key: "service", question: "Which service do you need?", required: true },
      { key: "description", question: "Please give a short project description.", required: true },
      { key: "preferredContact", question: "Preferred contact method: WhatsApp, email, or call?", required: true }
    ];

    function createUi() {
      const launcher = document.createElement("button");
      launcher.type = "button";
      launcher.className = "chatbot-launcher";
      launcher.setAttribute("aria-label", "Open LZ Assistant chatbot");
      launcher.innerHTML = `
        <span class="assistant-icon" aria-hidden="true">LZ</span>
      `;

      const panel = document.createElement("section");
      panel.className = "chatbot";
      panel.hidden = true;
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "false");
      panel.setAttribute("aria-label", "LZ Assistant chat panel");

      panel.innerHTML = `
        <header class="chatbot-header">
          <div>
            <h3>LZ Assistant</h3>
            <p>Your Vision. Our Solution.</p>
          </div>
          <div class="chatbot-controls">
            <button type="button" data-chat-minimize aria-label="Minimise chat">−</button>
            <button type="button" data-chat-restart aria-label="Restart chat">↺</button>
            <button type="button" data-chat-close aria-label="Close chat">×</button>
          </div>
        </header>
        <div class="chatbot-messages" data-chat-messages aria-live="polite" aria-label="Chat messages"></div>
        <div class="quick-actions" data-quick-actions aria-label="Quick chat actions"></div>
        <div class="chatbot-input-wrap">
          <div class="chatbot-input-row">
            <textarea class="chatbot-textarea" data-chat-input rows="1" placeholder="Type your message..." aria-label="Type your message"></textarea>
            <button class="button button-primary chatbot-send" data-chat-send type="button">Send</button>
          </div>
          <div data-live-status aria-live="polite"></div>
        </div>
        <footer class="chatbot-footer">
          <button type="button" data-chat-clear>Clear conversation</button>
          <a href="privacy.html">Privacy Policy</a>
        </footer>
      `;

      document.body.appendChild(launcher);
      document.body.appendChild(panel);

      if (window.innerWidth <= 560) {
        panel.classList.add("compact-sheet");
      }

      return {
        launcher,
        panel,
        messages: panel.querySelector("[data-chat-messages]"),
        input: panel.querySelector("[data-chat-input]"),
        send: panel.querySelector("[data-chat-send]"),
        status: panel.querySelector("[data-live-status]"),
        quickActions: panel.querySelector("[data-quick-actions]"),
        close: panel.querySelector("[data-chat-close]"),
        minimize: panel.querySelector("[data-chat-minimize]"),
        restart: panel.querySelector("[data-chat-restart]"),
        clear: panel.querySelector("[data-chat-clear]")
      };
    }

    function safeText(value) {
      return String(value || "").replace(/[\u0000-\u001F\u007F]/g, " ").trim();
    }

    function addMessage(ui, role, text) {
      const row = document.createElement("div");
      row.className = `chat-row ${role}`;

      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.textContent = safeText(text);

      row.appendChild(bubble);
      ui.messages.appendChild(row);
      ui.messages.scrollTop = ui.messages.scrollHeight;

      storeSession(ui);
    }

    function addTyping(ui) {
      const row = document.createElement("div");
      row.className = "chat-row bot";
      row.setAttribute("data-typing", "true");

      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.innerHTML = '<span class="typing" aria-label="Assistant typing"><span></span><span></span><span></span></span>';
      row.appendChild(bubble);
      ui.messages.appendChild(row);
      ui.messages.scrollTop = ui.messages.scrollHeight;
    }

    function removeTyping(ui) {
      const typing = ui.messages.querySelector("[data-typing='true']");
      if (typing) {
        typing.remove();
      }
    }

    function setStatus(ui, text) {
      ui.status.textContent = safeText(text);
    }

    function setQuickActions(ui, actions) {
      ui.quickActions.textContent = "";
      actions.forEach((label) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.setAttribute("data-action", label);
        ui.quickActions.appendChild(button);
      });
    }

    function openChat(ui, source = "manual") {
      state.open = true;
      ui.panel.hidden = false;
      ui.input.focus();
      config.analytics.track("chatbot_opened", { source });
      localStorage.setItem(config.STORAGE_KEYS.panelOpen, "yes");
      localStorage.setItem(config.STORAGE_KEYS.dismissed, "no");
      localStorage.setItem(config.STORAGE_KEYS.launcherPulseSeen, "yes");
      ui.launcher.classList.remove("pulse");
    }

    function closeChat(ui) {
      state.open = false;
      ui.panel.hidden = true;
      localStorage.setItem(config.STORAGE_KEYS.panelOpen, "no");
      localStorage.setItem(config.STORAGE_KEYS.dismissed, "yes");
      ui.launcher.focus();
    }

    function restartConversation(ui) {
      state.flow = null;
      state.flowStep = 0;
      state.recommendationAnswers = {};
      state.leadAnswers = {};
      state.waiting = false;
      ui.messages.textContent = "";
      welcome(ui, false);
    }

    function clearConversation(ui) {
      sessionStorage.removeItem(config.STORAGE_KEYS.session);
      restartConversation(ui);
    }

    function welcome(ui, isAutoGreeting) {
      const greeting = "Welcome to LZ Solutions.\n\nI am LZ Assistant. I can help with services, pricing, portfolio, solutions store, automation, consultations and support options.\n\nWhat would you like help with?";
      addMessage(ui, "bot", greeting);
      setQuickActions(ui, knowledge.quickActions);
      if (isAutoGreeting) {
        config.analytics.track("chatbot_auto_greeting_displayed", { page });
      }
    }

    function parseUserName(value) {
      const clean = safeText(value);
      if (!clean || clean.length < 2) {
        return "";
      }
      const names = clean.split(" ");
      return names[0].charAt(0).toUpperCase() + names[0].slice(1);
    }

    function isFormFocused() {
      const active = document.activeElement;
      if (!active) {
        return false;
      }
      if (!(active instanceof HTMLElement)) {
        return false;
      }
      return ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName) || active.isContentEditable;
    }

    function navigateAction(label) {
      const actions = {
        "View Pricing": () => {
          goToSection("pricing-preview");
          return "I have taken you to pricing. I can also break down Starter, Advanced, or Premium in detail.";
        },
        "View Website Packages": () => {
          goToSection("pricing-preview");
          return "I have taken you to website packages. Ask me for Starter, Advanced, or Premium details when you are ready.";
        },
        "Visit Solutions Store": () => {
          if (page === "index.html") {
            goToSection("store-preview");
            return "I have taken you to the Solutions Store preview. You can open the full page for kits and bundles.";
          }
          window.location.href = "solutions-store.html";
          return "Opening the Solutions Store page now.";
        },
        "View Our Work": () => {
          goToSection("portfolio-preview");
          return "I have taken you to portfolio work. Let me know if you want a similar setup for your business.";
        },
        "LZ ClientFlow": () => {
          if (page === "index.html") {
            goToSection("clientflow");
            return "I have taken you to LZ ClientFlow. This platform is coming soon and will include clients, projects, invoices and deadlines management.";
          }
          window.location.href = "client-portal.html";
          return "Opening the Client Portal preview now.";
        },
        "Project Enquiry Page": () => {
          window.location.href = "project-enquiry.html";
          return "Opening the Project Enquiry page now.";
        },
        "View Portfolio": () => {
          goToSection("portfolio-preview");
          return "I have taken you to portfolio work. Let me know if you want a similar setup for your business.";
        },
        "Explore Our Services": () => {
          goToSection("services-preview");
          return "I have taken you to services. Tell me your goals and I can suggest the closest fit.";
        },
        "Explore Services": () => {
          goToSection("services-preview");
          return "I have taken you to services. Tell me your goals and I can suggest the closest fit.";
        },
        "Book a Consultation": () => {
          goToSection("contact-preview");
          config.analytics.track("chatbot_consultation_selected", { source: "quick-action" });
          return "I have taken you to the consultation section. You can also ask me to start an enquiry here in chat.";
        },
        "Start Your Project": () => {
          startLeadFlow();
          return leadQuestions[0].question;
        },
        "Find the Right Package": () => {
          startRecommendationFlow();
          return recommendationQuestions[0].question;
        },
        "Recommend a Package": () => {
          startRecommendationFlow();
          return recommendationQuestions[0].question;
        },
        "Contact on WhatsApp": () => {
          openExternal(knowledge.business.whatsapp, "chatbot_whatsapp_selected");
          return "Opening WhatsApp now. You can message Lwandile directly on 069 516 5196.";
        },
        "Speak to Lwandile": () => {
          openExternal(knowledge.business.whatsapp, "chatbot_consultation_selected");
          return "Opening WhatsApp now so you can speak with Lwandile directly.";
        },
        "Send an Email": () => {
          window.location.href = `mailto:${knowledge.business.email}`;
          return "Opening your email draft now.";
        },
        "LinkedIn": () => {
          openExternal(knowledge.business.linkedin);
          return "Opening LinkedIn now.";
        },
        "GitHub": () => {
          openExternal(knowledge.business.github);
          return "Opening GitHub now.";
        },
        "Start Lead Capture": () => {
          startLeadFlow();
          return leadQuestions[0].question;
        }
      };

      if (actions[label]) {
        const reply = actions[label]();
        config.analytics.track("chatbot_quick_action_selected", { label });
        return reply || "Done.";
      }

      return "";
    }

    function openExternal(url, analyticsEvent) {
      if (analyticsEvent) {
        config.analytics.track(analyticsEvent, { url });
      }
      window.open(url, "_blank", "noopener,noreferrer");
    }

    function goToSection(sectionId) {
      if (page === "index.html") {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
      }
      window.location.href = `index.html#${sectionId}`;
    }

    function pricingReply(type) {
      const pricing = knowledge.pricing;
      if (type === "pricing-starter") {
        return intentEngine.formatPriceBlock(pricing.starter);
      }
      if (type === "pricing-advanced") {
        return intentEngine.formatPriceBlock(pricing.advanced);
      }
      if (type === "pricing-premium") {
        const block = intentEngine.formatPriceBlock(pricing.premium);
        return `${block}\n\n${pricing.premium.statement}`;
      }
      if (type === "pricing-maintenance") {
        return `${pricing.maintenance.title}\n${pricing.maintenance.price}\n\nIncludes:\n${pricing.maintenance.includes.map((item) => `- ${item}`).join("\n")}`;
      }
      if (type === "pricing-deposit") {
        return pricing.deposit;
      }
      return intentEngine.pricingOverview();
    }

    function startRecommendationFlow() {
      state.flow = "recommendation";
      state.flowStep = 0;
      state.recommendationAnswers = {};
    }

    function handleRecommendation(ui, userInput) {
      const stepDef = recommendationQuestions[state.flowStep];
      if (stepDef) {
        state.recommendationAnswers[stepDef.key] = userInput;
      }

      state.flowStep += 1;
      const next = recommendationQuestions[state.flowStep];
      if (next) {
        return next.question;
      }

      const result = intentEngine.recommendPackage(state.recommendationAnswers);
      state.flow = null;
      state.flowStep = 0;
      config.analytics.track("chatbot_package_recommendation_completed", { package: result.package });
      return result.explanation;
    }

    function startLeadFlow() {
      state.flow = "lead";
      state.flowStep = 0;
      state.leadAnswers = {};
    }

    function validateLeadField(field, value) {
      const clean = safeText(value);
      if (!clean) {
        return "Please provide a value so I can continue.";
      }
      if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(clean)) {
        return "Please enter a valid email address.";
      }
      if (field.type === "phone" && clean.replace(/\D/g, "").length < 9) {
        return "Please enter a valid phone number with at least 9 digits.";
      }
      return "";
    }

    function leadHash(data) {
      return [
        data.fullName,
        data.businessName,
        data.email,
        data.phone,
        data.service,
        data.description,
        data.preferredContact
      ]
        .map((v) => safeText(v).toLowerCase())
        .join("|");
    }

    async function submitLead(ui) {
      const payload = {
        fullName: state.leadAnswers.fullName,
        businessName: state.leadAnswers.businessName,
        email: state.leadAnswers.email,
        phone: state.leadAnswers.phone,
        service: state.leadAnswers.service,
        message: state.leadAnswers.description,
        preferredContactMethod: state.leadAnswers.preferredContact,
        source: window.location.href,
        timestamp: new Date().toISOString()
      };

      const hash = leadHash(payload);
      const now = Date.now();
      if (state.leadLastHash === hash && now - state.leadLastSubmittedAt < 5 * 60 * 1000) {
        return "It looks like this enquiry was already submitted recently. If you need to update details, please edit your message and try again.";
      }

      state.leadLastHash = hash;
      state.leadLastSubmittedAt = now;

      setStatus(ui, "Submitting enquiry...");
      try {
        if (config.CHATBOT_WEBHOOK_URL) {
          const response = await fetch(config.CHATBOT_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error("Webhook failed");
          }
        }

        config.analytics.track("chatbot_enquiry_success", { hasWebhook: Boolean(config.CHATBOT_WEBHOOK_URL) });
        if (!config.CHATBOT_WEBHOOK_URL) {
          return "Thank you. Your enquiry has been captured successfully. Lwandile will follow up using your preferred contact method. You can also use WhatsApp now for faster confirmation: https://wa.me/27695165196";
        }
        return "Thank you. Your enquiry has been captured successfully. Lwandile will follow up using your preferred contact method.";
      } catch (_error) {
        config.analytics.track("chatbot_enquiry_failed", { hasWebhook: Boolean(config.CHATBOT_WEBHOOK_URL) });
        return "Your enquiry could not be submitted right now. You can continue via WhatsApp here: https://wa.me/27695165196 or use the contact form on this website.";
      } finally {
        setStatus(ui, "");
      }
    }

    async function handleLead(ui, userInput) {
      const stepDef = leadQuestions[state.flowStep];
      if (!stepDef) {
        state.flow = null;
        return knowledge.fallback;
      }

      const validation = validateLeadField(stepDef, userInput);
      if (validation) {
        return validation;
      }

      state.leadAnswers[stepDef.key] = safeText(userInput);
      if (stepDef.key === "fullName") {
        state.userName = parseUserName(userInput);
      }

      state.flowStep += 1;

      if (state.flowStep === leadQuestions.length) {
        const notice = "By submitting your details, you agree that LZ Solutions may use them to respond to your enquiry. Please review our Privacy Policy for more information.";
        addMessage(ui, "bot", notice);
        const result = await submitLead(ui);
        state.flow = null;
        state.flowStep = 0;
        state.leadAnswers = {};
        return result;
      }

      return leadQuestions[state.flowStep].question;
    }

    async function getBotResponse(ui, userInput) {
      const cleanInput = safeText(userInput);
      if (!cleanInput) {
        return "Please type your message so I can help you.";
      }

      const actionReply = navigateAction(cleanInput);
      if (actionReply) {
        return actionReply;
      }

      if (state.flow === "recommendation") {
        return handleRecommendation(ui, cleanInput);
      }

      if (state.flow === "lead") {
        return handleLead(ui, cleanInput);
      }

      const intent = intentEngine.detectIntent(cleanInput);

      if (intent.type === "greeting") {
        const prefix = state.userName ? `Hi ${state.userName}. ` : "";
        return `${prefix}How can I help you today? You can ask about pricing, services, automation, timelines, or contact options.`;
      }

      if (intent.type === "pricing-overview" || intent.type === "pricing-starter" || intent.type === "pricing-advanced" || intent.type === "pricing-premium" || intent.type === "pricing-maintenance" || intent.type === "pricing-deposit") {
        return pricingReply(intent.type);
      }

      if (intent.type === "start-recommendation") {
        startRecommendationFlow();
        return recommendationQuestions[0].question;
      }

      if (intent.type === "start-lead") {
        startLeadFlow();
        if (!config.CHATBOT_WEBHOOK_URL) {
          return "Lead submission webhook is not connected yet, so external submission is currently disabled. I can still guide you through details and you can continue with the website contact form or WhatsApp.\n\n" + leadQuestions[0].question;
        }
        return leadQuestions[0].question;
      }

      if (intent.type === "knowledge") {
        return intent.payload;
      }

      // Future AI integration hook: call your own secure server endpoint here.
      // Never expose API keys in browser JavaScript.
      if (config.OPENAI_ENABLED && config.OPENAI_SERVER_ENDPOINT) {
        return knowledge.fallback;
      }

      return knowledge.fallback;
    }

    function saveMessages(ui) {
      const records = [];
      ui.messages.querySelectorAll(".chat-row").forEach((row) => {
        if (row.getAttribute("data-typing") === "true") {
          return;
        }
        const bubble = row.querySelector(".chat-bubble");
        if (!bubble) {
          return;
        }
        records.push({
          role: row.classList.contains("user") ? "user" : "bot",
          text: bubble.textContent || ""
        });
      });
      sessionStorage.setItem(config.STORAGE_KEYS.session, JSON.stringify(records));
    }

    function storeSession(ui) {
      saveMessages(ui);
    }

    function restoreSession(ui) {
      const raw = sessionStorage.getItem(config.STORAGE_KEYS.session);
      if (!raw) {
        welcome(ui, false);
        return;
      }

      try {
        const records = JSON.parse(raw);
        if (!Array.isArray(records) || !records.length) {
          welcome(ui, false);
          return;
        }
        records.forEach((record) => {
          if (record && (record.role === "user" || record.role === "bot")) {
            addMessage(ui, record.role, record.text || "");
          }
        });
      } catch (_error) {
        welcome(ui, false);
      }
    }

    function registerAutoOpen(ui) {
      if (page !== "index.html") {
        return;
      }

      if (localStorage.getItem(config.STORAGE_KEYS.autoOpened) === "yes") {
        return;
      }

      const maybeOpen = (source) => {
        if (localStorage.getItem(config.STORAGE_KEYS.autoOpened) === "yes") {
          return;
        }
        if (state.open || isFormFocused()) {
          return;
        }
        openChat(ui, source);
        localStorage.setItem(config.STORAGE_KEYS.autoOpened, "yes");
        if (ui.messages.children.length === 0) {
          welcome(ui, true);
        }
      };

      const onScroll = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total <= 0) {
          return;
        }
        const ratio = window.scrollY / total;
        if (ratio >= 0.3 && ratio <= 0.95) {
          window.removeEventListener("scroll", onScroll);
          maybeOpen("scroll");
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });

      const markInteraction = () => {
        state.interactionSeen = true;
      };

      window.addEventListener("click", markInteraction, { passive: true });
      window.addEventListener("keydown", markInteraction);

      window.setTimeout(() => {
        if (state.interactionSeen) {
          maybeOpen("timer");
        }
      }, 12000);
    }

    function bind(ui) {
      setQuickActions(ui, [
        "Find the Right Package",
        "Explore Our Services",
        "Visit Solutions Store",
        "View Our Work",
        "LZ ClientFlow",
        "Project Enquiry Page",
        "Start Your Project",
        "Speak to Lwandile"
      ]);

      ui.launcher.addEventListener("click", () => {
        if (state.open) {
          closeChat(ui);
          return;
        }

        openChat(ui);
      });

      ui.send.addEventListener("click", async () => {
        if (state.waiting) {
          return;
        }

        const message = safeText(ui.input.value);
        if (!message) {
          setStatus(ui, "Please type a message before sending.");
          return;
        }

        state.waiting = true;
        setStatus(ui, "");
        ui.input.value = "";
        addMessage(ui, "user", message);
        addTyping(ui);

        const botReply = await getBotResponse(ui, message);
        window.setTimeout(() => {
          removeTyping(ui);
          addMessage(ui, "bot", botReply);
          state.waiting = false;
        }, 360);
      });

      ui.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          ui.send.click();
        }
      });

      ui.quickActions.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement) || target.tagName !== "BUTTON") {
          return;
        }
        const action = target.getAttribute("data-action") || "";
        ui.input.value = action;
        ui.send.click();
      });

      ui.close.addEventListener("click", () => closeChat(ui));
      ui.minimize.addEventListener("click", () => closeChat(ui));
      ui.restart.addEventListener("click", () => restartConversation(ui));
      ui.clear.addEventListener("click", () => clearConversation(ui));

      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && state.open) {
          closeChat(ui);
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth <= 560) {
          ui.panel.classList.add("compact-sheet");
        } else {
          ui.panel.classList.remove("compact-sheet");
        }
      });
    }

    function init() {
      const ui = createUi();
      bind(ui);
      restoreSession(ui);

      if (localStorage.getItem(config.STORAGE_KEYS.launcherPulseSeen) !== "yes") {
        ui.launcher.classList.add("pulse");
      }

      if (localStorage.getItem(config.STORAGE_KEYS.panelOpen) === "yes" && window.innerWidth > 900) {
        openChat(ui, "restore");
      } else if (window.innerWidth <= 900) {
        localStorage.setItem(config.STORAGE_KEYS.panelOpen, "no");
      }

      registerAutoOpen(ui);
    }

    document.addEventListener("DOMContentLoaded", init);
  } catch (_error) {
    // Keep main site stable if chatbot fails.
  }
})();
