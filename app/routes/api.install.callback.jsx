import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";
import { encryptData } from "../utils/security";

export const loader = async ({ request }) => {
  // 处理安装回调
  const { session } = await authenticate.admin(request);

  // 加密access token
  const encryptionKey = process.env.ENCRYPTION_KEY || "default_encryption_key";
  const encryptedAccessToken = encryptData(session.accessToken, encryptionKey);

  // 保存店铺信息到数据库
  const shopData = {
    shopDomain: session.shop,
    accessToken: encryptedAccessToken,
    locale: session.locale || "en-US"
  };

  try {
    // 检查店铺是否已存在
    const existingShop = await prisma.shop.findUnique({
      where: { shopDomain: session.shop }
    });

    if (existingShop) {
      // 更新现有店铺信息
      await prisma.shop.update({
        where: { id: existingShop.id },
        data: shopData
      });
    } else {
      // 创建新店铺记录
      await prisma.shop.create({
        data: shopData
      });

      // 为新店铺创建默认设置
      await prisma.setting.create({
        data: {
          shopId: (await prisma.shop.findUnique({ where: { shopDomain: session.shop } })).id,
          language: "en-US",
          submitFrequency: "daily",
          includePaths: ["/products/", "/collections/"]
        }
      });
    }

    // 返回成功响应
    return new Response(JSON.stringify({
      success: true,
      message: "Installation completed successfully",
      shop: session.shop
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error saving shop data:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to save shop data",
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};