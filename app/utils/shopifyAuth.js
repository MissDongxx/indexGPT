// Shopify认证工具函数
import { decryptData } from "./security";

// 解密店铺的access token
export async function getDecryptedAccessToken(shopId) {
  // 注意：这个函数需要在实际实现中从数据库获取加密的access token
  // 并使用解密函数解密后返回

  // 在实际实现中，这里会：
  // 1. 从数据库获取shop记录
  // 2. 解密access token
  // 3. 返回解密后的token

  // 为简化起见，这里返回null，实际使用时需要实现具体逻辑
  return null;
}

// 验证店铺权限
export async function verifyShopPermissions(shopDomain, accessToken) {
  try {
    // 调用Shopify API验证权限
    const response = await fetch(`https://${shopDomain}/admin/api/2025-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken
      }
    });

    return response.ok;
  } catch (error) {
    console.error("Error verifying shop permissions:", error);
    return false;
  }
}

// 获取店铺信息
export async function getShopInfo(shopDomain, accessToken) {
  try {
    const response = await fetch(`https://${shopDomain}/admin/api/2025-10/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': accessToken
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data.shop;
    }

    return null;
  } catch (error) {
    console.error("Error getting shop info:", error);
    return null;
  }
}

// 创建安全的Shopify API客户端
export function createShopifyClient(shopDomain, accessToken) {
  return {
    async graphql(query, variables = {}) {
      const response = await fetch(`https://${shopDomain}/admin/api/2025-10/graphql.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      return response;
    },

    async rest(method, endpoint, data = null) {
      const response = await fetch(`https://${shopDomain}/admin/api/2025-10${endpoint}`, {
        method,
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : null
      });

      return response;
    }
  };
}