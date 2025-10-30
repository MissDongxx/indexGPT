import { boundary } from "@shopify/shopify-app-react-router/server";
import prisma from "../db.server";

// 处理店铺数据删除请求（GDPR）
export const action = async ({ request }) => {
  try {
    const body = await request.text();
    const webhookData = JSON.parse(body);

    console.log("Processing shop data redaction request:", webhookData);

    const shopDomain = webhookData.shop_domain;

    if (!shopDomain) {
      return new Response(JSON.stringify({
        success: false,
        message: "Missing shop_domain in webhook data"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 删除店铺相关数据
    const shop = await prisma.shop.findUnique({
      where: { shopDomain: shopDomain }
    });

    if (shop) {
      // 删除提交日志
      await prisma.submissionLog.deleteMany({
        where: { shopId: shop.id }
      });

      // 删除设置
      await prisma.setting.deleteMany({
        where: { shopId: shop.id }
      });

      // 删除店铺记录
      await prisma.shop.delete({
        where: { id: shop.id }
      });

      console.log(`Successfully redacted data for shop: ${shopDomain}`);
    } else {
      console.log(`Shop not found for redaction: ${shopDomain}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Shop data redaction processed successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing shop redact webhook:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Error processing shop redact webhook",
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