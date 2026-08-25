import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  English: {
    home: "Home",
    pipeline: "Application Pipeline",
    help: "Help/FAQs",
    notifications: "Notifications",
    searchPlaceholder: "Search cases by Customer Name, File No, Bank, City...",
    clear: "Clear All",
    signedInAs: "Signed in as",
    logout: "Log out",
    devBy: "Dev by",
    allCaughtUp: "All caught up!",
    noNotifications: "You have no new notifications right now.",
    fieldOfficerSubmission: "Field Officer Submission",
    view: "View",
    hardRefresh: "Hard Refresh Page & Clear Cache",
  },
  Hindi: {
    home: "मुख्य पृष्ठ",
    pipeline: "आवेदन पाइपलाइन",
    help: "सहायता / एफएक्यू",
    notifications: "सूचनाएं",
    searchPlaceholder: "ग्राहक का नाम, फ़ाइल नंबर, बैंक, शहर खोजें...",
    clear: "सभी हटाएं",
    signedInAs: "साइन इन रूप:",
    logout: "लॉग आउट",
    devBy: "डेवलपर:",
    allCaughtUp: "सब अद्यतित है!",
    noNotifications: "आपके पास अभी कोई नई सूचनाएं नहीं हैं।",
    fieldOfficerSubmission: "फील्ड अधिकारी सबमिशन",
    view: "देखें",
    hardRefresh: "पृष्ठ रिफ्रेश करें",
  },
  Hinglish: {
    home: "Home Page",
    pipeline: "App Pipeline",
    help: "Help & FAQs",
    notifications: "Subhi Notifications",
    searchPlaceholder: "Customer Name, File No, Bank, City search karein...",
    clear: "Clear All",
    signedInAs: "Signed in as",
    logout: "Log Out",
    devBy: "Developer",
    allCaughtUp: "Sab updated hai!",
    noNotifications: "Abhi koi new notification nahi hai.",
    fieldOfficerSubmission: "Field Officer Data Submitted",
    view: "Dekhein",
    hardRefresh: "Hard Refresh",
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("app_lang") || "English";
  });

  useEffect(() => {
    localStorage.setItem("app_lang", lang);

    // Apply Google Translate Widget auto-trigger for full page DOM translation if Hindi is chosen
    if (lang === "Hindi") {
      triggerGoogleTranslate("hi");
    } else if (lang === "English") {
      triggerGoogleTranslate("en");
    }
  }, [lang]);

  const triggerGoogleTranslate = (langCode) => {
    try {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event("change"));
      }
    } catch (err) {
      console.log("Translation trigger note:", err);
    }
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations["English"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
