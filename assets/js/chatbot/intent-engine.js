(() => {
  const kb = () => window.LZChatbotKnowledge;

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function containsAny(text, candidates) {
    return candidates.some((candidate) => text.includes(candidate));
  }

  function formatPriceBlock(packageData) {
    const list = packageData.includes.map((item) => `- ${item}`).join("\n");
    return `${packageData.title}\n${packageData.price}\n\nSuitable for:\n${packageData.suitable}\n\nIncludes:\n${list}`;
  }

  function detectIntent(message) {
    const input = normalize(message);
    const data = kb();

    if (!input) {
      return { type: "none" };
    }

    if (containsAny(input, ["recommend package", "recommend a package", "which package", "best package", "what package", "package recommendation"])) {
      return { type: "start-recommendation" };
    }

    if (containsAny(input, ["start project", "enquiry", "quote", "contact me", "get in touch", "lead", "send my details"])) {
      return { type: "start-lead" };
    }

    if (containsAny(input, ["price", "pricing", "cost", "package", "starter", "advanced", "premium"])) {
      if (containsAny(input, ["starter"])) {
        return { type: "pricing-starter" };
      }
      if (containsAny(input, ["advanced"])) {
        return { type: "pricing-advanced" };
      }
      if (containsAny(input, ["premium", "custom"])) {
        return { type: "pricing-premium" };
      }
      if (containsAny(input, ["maintenance"])) {
        return { type: "pricing-maintenance" };
      }
      if (containsAny(input, ["deposit", "payment"])) {
        return { type: "pricing-deposit" };
      }
      return { type: "pricing-overview" };
    }

    for (const intent of data.intentReplies) {
      if (containsAny(input, intent.patterns)) {
        return { type: "knowledge", payload: intent.response };
      }
    }

    if (containsAny(input, ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"])) {
      return { type: "greeting" };
    }

    return { type: "fallback" };
  }

  function pricingOverview() {
    const data = kb();
    return [
      `${data.pricing.starter.title}: ${data.pricing.starter.price}`,
      `${data.pricing.advanced.title}: ${data.pricing.advanced.price}`,
      `${data.pricing.premium.title}: ${data.pricing.premium.price}`,
      `${data.pricing.maintenance.title}: ${data.pricing.maintenance.price}`,
      "",
      data.pricing.premium.statement,
      "",
      data.pricing.deposit
    ].join("\n");
  }

  function recommendPackage(answers) {
    const all = normalize(Object.values(answers).join(" "));
    const commerce = normalize(answers.commerce || "");
    const automation = normalize(answers.automation || "");
    const pages = normalize(answers.pages || "");

    const noShop = containsAny(commerce, ["no shop", "no online shop", "no ecommerce", "no e commerce", "no online payments", "no payments"]);
    const noAutomation = containsAny(automation, ["no automation", "without automation", "dont need automation", "do not need automation", "no integrations", "no integration"]);
    const noBookings = containsAny(commerce, ["no booking", "no bookings", "no enquiry", "no appointment"]);

    const hasShop = !noShop && containsAny(commerce, ["shop", "ecommerce", "e commerce", "payments", "online payments", "catalogue", "products"]);
    const hasAutomation = !noAutomation && containsAny(automation, ["automation", "integration", "webhook", "n8n", "google sheets", "api"]);
    const hasBookings = !noBookings && containsAny(commerce, ["booking", "bookings", "enquiry", "appointment", "medical", "accommodation", "student", "tutor"]);
    const hasLargeScope = containsAny(pages, ["10", "11", "12", "many", "large", "advanced", "complex", "custom", "more than 8", "8+"]);

    if (hasShop || hasAutomation || hasLargeScope) {
      return {
        package: "Premium",
        explanation: "Based on what you've described, the Premium Digital Solutions Package appears to be the closest fit because your scope includes advanced functionality, integrations or automation needs. A consultation would confirm the final scope and quotation."
      };
    }

    if (hasBookings || containsAny(all, ["existing", "already have", "more pages", "6", "7", "8", "9"])) {
      return {
        package: "Advanced",
        explanation: "Based on what you've described, the Advanced Business Package appears to be the closest fit because you need added functionality beyond a basic site. A consultation would confirm the final scope and quotation."
      };
    }

    if (containsAny(all, ["simple", "new", "small", "basic", "startup", "tutor", "personal brand"])) {
      return {
        package: "Starter",
        explanation: "Based on what you've described, the Starter Website Package appears to be the closest fit for a straightforward, professional online presence. A consultation would confirm the final scope and quotation."
      };
    }

    return {
      package: "Custom quotation",
      explanation: "Based on what you've described, this may need a custom quotation because the scope is not fully defined yet. A consultation would confirm the final scope and quotation."
    };
  }

  window.LZChatbotIntent = {
    detectIntent,
    pricingOverview,
    formatPriceBlock,
    recommendPackage
  };
})();
