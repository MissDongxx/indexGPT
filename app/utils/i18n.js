// 多语言支持工具
import enTranslations from "../i18n/en.json";
import zhTranslations from "../i18n/zh.json";

const translations = {
  "en-US": enTranslations,
  "zh-CN": zhTranslations
};

// 获取翻译文本
export function t(key, language = "en-US") {
  const keys = key.split(".");
  let translation = translations[language] || translations["en-US"];

  for (const k of keys) {
    if (translation && translation[k] !== undefined) {
      translation = translation[k];
    } else {
      // 如果找不到翻译，返回键名
      return key;
    }
  }

  return translation;
}

// 获取支持的语言列表
export function getSupportedLanguages() {
  return Object.keys(translations);
}

// 根据语言代码获取语言名称
export function getLanguageName(languageCode) {
  const languageNames = {
    "en-US": "English",
    "zh-CN": "中文"
  };

  return languageNames[languageCode] || languageCode;
}

// 检测浏览器语言
export function detectBrowserLanguage() {
  const browserLanguage = navigator.language || navigator.userLanguage;

  // 匹配支持的语言
  if (translations[browserLanguage]) {
    return browserLanguage;
  }

  // 尝试匹配语言前缀
  const languagePrefix = browserLanguage.split('-')[0];
  for (const langCode in translations) {
    if (langCode.startsWith(languagePrefix)) {
      return langCode;
    }
  }

  // 默认返回英语
  return "en-US";
}

// 格式化翻译文本（支持变量替换）
export function tf(key, params = {}, language = "en-US") {
  let translation = t(key, language);

  // 替换参数
  for (const param in params) {
    translation = translation.replace(`{${param}}`, params[param]);
  }

  return translation;
}