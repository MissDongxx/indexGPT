// 安全工具函数
import crypto from "crypto";

// 加密敏感数据
export function encryptData(data, encryptionKey) {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(encryptionKey, 'GfG', 32);
    const iv = Buffer.alloc(16, 0); // 初始化向量

    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
  } catch (error) {
    console.error("Error encrypting data:", error);
    throw error;
  }
}

// 解密敏感数据
export function decryptData(encryptedData, encryptionKey) {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(encryptionKey, 'GfG', 32);
    const iv = Buffer.alloc(16, 0); // 初始化向量

    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error("Error decrypting data:", error);
    throw error;
  }
}

// 验证API Key格式
export function validateApiKey(key) {
  return /^[a-zA-Z0-9]{32,64}$/.test(key);
}

// 生成安全的API Key
export function generateSecureApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

// 验证URL是否安全
export function validateUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

// 验证店铺域名
export function validateShopDomain(domain) {
  const shopifyDomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
  return shopifyDomainRegex.test(domain);
}

// 清理输入数据防止XSS攻击
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// 验证JSON数据
export function validateJson(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    return false;
  }
}

// 生成CSRF令牌
export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}