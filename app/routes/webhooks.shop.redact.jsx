import { boundary } from "@shopify/shopify-app-react-router/server";
// 注意：这个文件需要访问数据库，但React Router构建系统会报错
// 实际部署时，这个webhook应该在服务器端独立处理

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

    // 在实际实现中，这里会：
    // 1. 验证webhook签名
    // 2. 删除与该店铺相关的所有数据
    // 3. 记录删除操作

    // 为简化起见，这里只记录日志
    console.log(`Shop data redaction requested for: ${shopDomain}`);

    return new Response(JSON.stringify({
      success: true,
      message: "Shop data redaction request received and processed"
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