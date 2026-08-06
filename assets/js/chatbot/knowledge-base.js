(() => {
  const business = {
    name: "LZ Solutions",
    founder: "Lwandile Zengethwa",
    tagline: "Your Vision. Our Solution.",
    phone: "069 516 5196",
    whatsapp: "https://wa.me/27695165196",
    email: "lwandilezengethwa772@gmail.com",
    linkedin: "https://www.linkedin.com/in/lwandile-zengethwa",
    github: "https://github.com/lwandilelwara21-beep",
    locationLine: "LZ Solutions is based across East London and Cape Town and works remotely with businesses throughout South Africa.",
    locations: [
      "East London, Eastern Cape (Primary location)",
      "Cape Town, Western Cape (Secondary location)"
    ],
    businessHours: "Monday to Friday, 08:00 to 17:00"
  };

  const pricing = {
    starter: {
      title: "Starter Website Package",
      price: "R3 500",
      suitable: "Small businesses, tutors, personal brands, and simple service businesses.",
      includes: [
        "Responsive website",
        "Professional custom design",
        "Up to 5 core sections or pages",
        "Contact form",
        "WhatsApp integration",
        "Social media links",
        "Basic SEO setup",
        "Mobile optimisation",
        "Deployment",
        "Basic domain connection support"
      ]
    },
    advanced: {
      title: "Advanced Business Package",
      price: "R4 500",
      suitable: "Established businesses, professional practices, and businesses requiring additional functionality.",
      includes: [
        "Everything in Starter",
        "More pages or sections",
        "Lead-capture forms",
        "Booking or enquiry functionality",
        "Google Maps integration where appropriate",
        "Google Search Console setup",
        "Sitemap and robots.txt",
        "Google indexing support",
        "Basic automation",
        "Improved SEO structure",
        "Domain and DNS configuration"
      ]
    },
    premium: {
      title: "Premium Digital Solutions Package",
      price: "From R6 000",
      suitable: "Businesses needing advanced digital functionality, e-commerce, advanced bookings, automation, and multiple integrations.",
      includes: [
        "Everything in Advanced",
        "E-commerce or product catalogue functionality",
        "Advanced booking systems",
        "n8n automation",
        "Google Sheets automation",
        "Chatbot or advanced WhatsApp integration",
        "Analytics setup",
        "Advanced enquiry systems",
        "Custom integrations",
        "Priority project support"
      ],
      statement: "Premium projects start from R6 000. The final quotation depends on the number of pages, products, booking requirements, integrations, automation and custom functionality."
    },
    maintenance: {
      title: "Maintenance",
      price: "R500 per month (optional)",
      includes: [
        "Website updates",
        "Minor content changes",
        "Technical support",
        "Monitoring",
        "Basic backups",
        "Link checks",
        "Basic SEO maintenance"
      ]
    },
    deposit: "A 50% deposit is required before work begins. The remaining 50% is payable upon completion and approval, before final handover."
  };

  const fallback = "That requirement may need a custom assessment. Lwandile can discuss it with you directly and confirm the best solution. Would you like to use WhatsApp or send an enquiry?";

  const quickActions = [
    "View Website Packages",
    "Visit Solutions Store",
    "Recommend a Package",
    "Explore Services",
    "View Portfolio",
    "LZ ClientFlow",
    "Project Enquiry Page",
    "Book a Consultation",
    "Contact on WhatsApp"
  ];

  const intentReplies = [
    {
      id: "services-web",
      patterns: ["website", "web development", "landing page", "redesign", "online shop", "e-commerce", "ecommerce", "booking system", "medical", "tutor", "student", "accommodation", "contact form", "whatsapp integration", "chatbot integration", "software", "dashboard", "crm", "internal tools"],
      response: "LZ Solutions builds professional business websites, landing pages, redesigns, e-commerce solutions, booking or enquiry systems (including medical, tutor/student and accommodation enquiries), contact forms, WhatsApp integration and chatbot integrations where needed."
    },
    {
      id: "services-seo",
      patterns: ["seo", "search engine", "google search console", "sitemap", "robots", "indexing", "google index", "https"],
      response: "SEO setup includes technical foundations such as metadata, sitemap.xml, robots.txt, Google Search Console setup and indexing support. HTTPS is also part of launch best practices when the hosting setup supports SSL certificates."
    },
    {
      id: "services-automation",
      patterns: ["automation", "n8n", "webhook", "google sheets", "lead capture", "workflow", "ai automation"],
      response: "Automation services include n8n workflows, webhook-driven flows, Google Sheets automation and lead-capture process automation to reduce manual admin work."
    },
    {
      id: "solutions-store",
      patterns: ["solutions store", "store", "bundle", "business launch kit", "student productivity kit", "digital downloads"],
      response: "The Solutions Store is a curated collection of products and services, not a checkout shop. You can request a quote or order via WhatsApp for guided support and tailored implementation."
    },
    {
      id: "clientflow",
      patterns: ["clientflow", "lz clientflow", "client portal", "portal", "invoices", "project tracking"],
      response: "LZ ClientFlow and the Client Portal are coming soon. They are designed to help businesses manage clients, projects, invoices, payments, approvals and deadlines in one premium environment."
    },
    {
      id: "domains",
      patterns: ["domain", "dns", "hosting", "github pages", "deploy", "deployment"],
      response: "LZ Solutions can assist with domain setup, DNS configuration, hosting setup and deployment, including GitHub Pages where suitable for the project."
    },
    {
      id: "timeline",
      patterns: ["timeline", "how long", "duration", "when completed"],
      response: "Most website projects are completed in roughly 1 to 3 weeks depending on scope, functionality and content readiness. Complex builds may require a custom timeline after consultation."
    },
    {
      id: "payment",
      patterns: ["deposit", "payment", "final payment", "how do i pay"],
      response: pricing.deposit
    },
    {
      id: "location",
      patterns: ["location", "where are you", "east london", "cape town", "remote", "business hours", "hours"],
      response: `${business.locationLine} Business hours: ${business.businessHours}.`
    },
    {
      id: "portfolio",
      patterns: ["portfolio", "projects", "work examples", "n zengethwa", "nt numerics", "zim wellness"],
      response: "Portfolio projects include N Zengethwa & Associates, NT Numerics, Forever Living Landing Page, and Zim Wellness. I can open the portfolio section or page for you."
    },
    {
      id: "contact",
      patterns: ["consultation", "contact", "phone", "email", "linkedin", "github", "whatsapp", "support"],
      response: `You can contact ${business.name} on ${business.phone}, email ${business.email}, WhatsApp via ${business.whatsapp}, LinkedIn at ${business.linkedin}, or GitHub at ${business.github}.`
    },
    {
      id: "maintenance",
      patterns: ["maintenance", "updates", "support"],
      response: `Maintenance is optional at ${pricing.maintenance.price} and includes website updates, minor content changes, technical support, monitoring, basic backups, link checks and basic SEO maintenance.`
    }
  ];

  window.LZChatbotKnowledge = {
    business,
    pricing,
    fallback,
    quickActions,
    intentReplies
  };
})();
