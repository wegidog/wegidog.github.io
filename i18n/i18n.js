class I18nManager {
  constructor() {
    this.currentLang = "en";
    this.translations = {
      en: {},
      zh: {}
    };
  }

  async loadTranslations() {
    const enTranslationsPromise = fetch("en.json").then(response => response.json());
    const zhTranslationsPromise = fetch("zh.json").then(response => response.json());
    const [enTranslations, zhTranslations] = await Promise.all([enTranslationsPromise, zhTranslationsPromise]);
    this.translations.en = enTranslations;
    this.translations.zh = zhTranslations;
  }

  saveTranslation(key, value) {
    const keys = key.split('.');
    let obj = this.translations[this.currentLang];
    for (const k of keys.slice(0, -1)) {
      obj = obj[k];
    }
    obj[keys.slice(-1)] = value;
    localStorage.setItem("translations", JSON.stringify(this.translations));
  }

  getCurrentTranslations() {
    return this.translations[this.currentLang];
  }

  getTranslation(key) {
    const keys = key.split('.');
    let obj = this.translations[this.currentLang];
    for (const k of keys) {
      obj = obj[k];
    }
    return obj;
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
i18nManager.init();

async init() {
    await this.loadTranslations();
    this.renderTranslations();
    document.getElementById("en-link").addEventListener("click", () => {
      this.setCurrentLang("en");
    });
    document.getElementById("zh-link").addEventListener("click", () => {
      this.setCurrentLang("zh");
    });
    document.getElementById("export-en-button").addEventListener("click", () => {
      this.exportTranslations("en");
    });
    document.getElementById("export-zh-button").addEventListener("click", () => {
      this.exportTranslations("zh");
    });
  }

  async loadTranslations() {
    const enTranslationsPromise = fetch("en.json").then(response => response.json());
    const zhTranslationsPromise = fetch("zh.json").then(response => response.json());
    const [enTranslations, zhTranslations] = await Promise.all([enTranslationsPromise, zhTranslationsPromise]);
    this.translations.en = enTranslations;
    this.translations.zh = zhTranslations;
  }

  saveTranslation(key, value) {
    const keys = key.split('.');
    let obj = this.translations[this.currentLang];
    for (const k of keys.slice(0, -1)) {
      obj = obj[k];
    }
    obj[keys.slice(-1)] = value;
    localStorage.setItem("translations", JSON.stringify(this.translations));
  }

  getCurrentTranslations() {
    return this.translations[this.currentLang];
  }

  getTranslation(key) {
    const keys = key.split('.');
    let obj = this.translations[this.currentLang];
    for (const k of keys) {
      obj = obj[k];
    }
    return obj;
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
      const subKeys = Object.keys(value);
      if (subKeys.length > 0) {
        const subTranslationsContainer = document.createElement("div");
        subTranslationsContainer.classList.add("sub-translations");
        translation.appendChild(subTranslationsContainer);
        for (const subKey of subKeys) {
          const subTranslation = document.createElement("div");
          subTranslation.classList.add("translation");
          const subKeyElement = document.createElement("p");
          subKeyElement.classList.add("key");
          subKeyElement.textContent = subKey;
          subTranslation.appendChild(subKeyElement);
          const subValueElement = document.createElement("textarea");
          subValueElement.classList.add("value");
          subValueElement.textContent = value[subKey];
          subValueElement.addEventListener("change", () => this.saveTranslation(`${key}.${subKey}`, subValueElement.value));
          subTranslation.appendChild(subValueElement);
          subTranslationsContainer.appendChild(subTranslation);
        }
      }
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

const i18nManager = new I18nManager();
i18nManager.init();
