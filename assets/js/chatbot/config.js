(() => {
  window.LZChatbotConfig = {
    CHATBOT_WEBHOOK_URL: "",
    OPENAI_SERVER_ENDPOINT: "",
    OPENAI_ENABLED: false,
    STORAGE_KEYS: {
      autoOpened: "lz_chat_auto_opened",
      launcherPulseSeen: "lz_chat_pulse_seen",
      panelOpen: "lz_chat_open",
      dismissed: "lz_chat_dismissed",
      session: "lz_chat_session"
    },
    analytics: {
      enabled: false,
      track(eventName, payload = {}) {
        if (window.LZChatbotConfig.analytics.enabled && typeof window.gtag === "function") {
          window.gtag("event", eventName, payload);
        }
      }
    }
  };
})();
