const languageButton = document.getElementById("languageButton");
const languageMenu = document.getElementById("languageMenu");

if (languageButton && languageMenu) {
  languageButton.addEventListener("click", () => {
    languageMenu.classList.toggle("hidden");
  });

  document.addEventListener("click", (event) => {
    const clickedInside =
      languageButton.contains(event.target) || languageMenu.contains(event.target);

    if (!clickedInside) {
      languageMenu.classList.add("hidden");
    }
  });

  document.querySelectorAll(".language-menu button").forEach((button) => {
    button.addEventListener("click", async () => {
      const lang = button.dataset.lang;
      localStorage.setItem("topLanguage", lang);
      await loadLanguage(lang);
      languageMenu.classList.add("hidden");
    });
  });
}

async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);

    if (!response.ok) {
      throw new Error(`Could not load lang/${lang}.json`);
    }

    const translations = await response.json();

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    applyTranslations(translations);
  } catch (error) {
    console.error("Language loading error:", error);
  }
}

function applyTranslations(translations) {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const value = getNestedValue(translations, key);

    if (value !== undefined && value !== null) {
      element.textContent = value;
    }
  });
}

function getNestedValue(object, path) {
  return path.split(".").reduce((current, key) => current && current[key], object);
}

window.addEventListener("DOMContentLoaded", async () => {
  const savedLanguage = localStorage.getItem("topLanguage") || "en";
  await loadLanguage(savedLanguage);
});