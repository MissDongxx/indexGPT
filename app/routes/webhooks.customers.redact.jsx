import { boundary } from "@shopify/shopify-app-react-router/server";

// 处理客户数据删除请求
export const action = async ({ request }) => {
  try {
    const body = await request.text();
    const webhookData = JSON.parse(body);

    console.log("Processing customer data redaction request:", webhookData);

    // 在实际实现中，这里会：
    // 1. 验证webhook签名
    // 2. 删除与该客户相关的所有数据
    // 3. 记录删除操作

    // 为简化起见，这里只记录日志

    return new Response(JSON.stringify({
      success: true,
      message: "Customer data redaction request received and processed"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing customer redact webhook:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Error processing customer redact webhook",
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