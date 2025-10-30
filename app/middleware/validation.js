// 输入验证中间件
import { sanitizeInput, validateJson } from "../utils/security";

// 验证和清理请求体
export async function validateRequestBody(request) {
  try {
    const contentType = request.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const body = await request.text();

      // 验证JSON格式
      if (!validateJson(body)) {
        return {
          valid: false,
          error: "Invalid JSON format"
        };
      }

      const data = JSON.parse(body);

      // 递归清理所有字符串字段
      const sanitizedData = sanitizeData(data);

      return {
        valid: true,
        data: sanitizedData
      };
    }

    return {
      valid: true,
      data: null
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

// 递归清理数据
function sanitizeData(data) {
  if (typeof data === 'string') {
    return sanitizeInput(data);
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeData(data[key]);
      }
    }
    return sanitized;
  }

  return data;
}

// 验证URL参数
export function validateUrlParams(params) {
  const errors = [];

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];

      // 检查是否包含潜在的恶意字符
      if (typeof value === 'string' && /[<>'"&]/.test(value)) {
        errors.push(`Invalid characters in parameter: ${key}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// 验证分页参数
export function validatePaginationParams(limit, offset) {
  const errors = [];

  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);

  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    errors.push("Limit must be between 1 and 100");
  }

  if (isNaN(offsetNum) || offsetNum < 0) {
    errors.push("Offset must be a non-negative number");
  }

  return {
    valid: errors.length === 0,
    limit: limitNum,
    offset: offsetNum,
    errors
  };
}

// 验证店铺域名
export function validateShopDomain(domain) {
  const shopifyDomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;

  if (!domain || typeof domain !== 'string') {
    return {
      valid: false,
      error: "Shop domain is required"
    };
  }

  if (!shopifyDomainRegex.test(domain)) {
    return {
      valid: false,
      error: "Invalid Shopify domain format"
    };
  }

  return {
    valid: true,
    domain
  };
}