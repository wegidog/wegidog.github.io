class I18nManager {
  constructor() {
    this.currentLang = "en";
    this.translations = {};
    this.loadTranslations();
  }

  loadTranslations() {
    const enTranslationsPromise = fetch("en-US.json").then(response => response.json());
    const zhTranslationsPromise = fetch("zh-TW.json").then(response => response.json());
    Promise.all([enTranslationsPromise, zhTranslationsPromise]).then(([enTranslations, zhTranslations]) => {
      this.translations.en = enTranslations;
      this.translations.zh = zhTranslations;
      this.renderTranslations();
    });
  }

  saveTranslation(key, value) {
    this.translations[this.currentLang][key] = value;
    localStorage.setItem("translations", JSON.stringify(this.translations));
  }

  getCurrentTranslations() {
    const translationsString = localStorage.getItem("translations");
    const translations = JSON.parse(translationsString) || {};
    return translations[this.currentLang] || {};
  }

  getTranslation(key) {
    const translation = this.getCurrentTranslations()[key];
    return typeof translation === "undefined" ? "" : translation;
  }

  setCurrentLang(lang) {
    this.currentLang = lang;
    this.renderTranslations();
  }

  renderTranslations() {
    const container = document.getElementById("translations-container");
    container.innerHTML = "";
    const translations = this.getCurrentTranslations();
    for (const [key, value] of Object.entries(translations)) {
      const translation = document.createElement("div");
      translation.classList.add("translation");
      const keyElement = document.createElement("p");
      keyElement.classList.add("key");
      keyElement.textContent = key;
      translation.appendChild(keyElement);
      const valueElement = document.createElement("textarea");
      valueElement.classList.add("value");
      valueElement.textContent = value;
      valueElement.addEventListener("change", () => this.saveTranslation(key, valueElement.value));
      translation.appendChild(valueElement);
      container.appendChild(translation);
    }
  }

  exportTranslations(lang) {
    const translations = this.translations[lang];
    const blob = new Blob([JSON.stringify(translations, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `i18n-${lang}.json`;
    a.click();
  }
}

const i18nManager = new I18nManager();

document.getElementById("en-link").addEventListener("click", () => {
  i18nManager.setCurrentLang("en");
});

document.getElementById("zh-link").addEventListener("click", () => {
  i18nManager.setCurrentLang("zh");
});

document.getElementById("export-en-button").addEventListener("click", () => {
  i18nManager.exportTranslations("en");
});

document.getElementById("export-zh-button").addEventListener("click", () => {
  i18nManager.exportTranslations("zh");
});
