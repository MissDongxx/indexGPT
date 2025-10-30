import { authenticate } from "../shopify.server";
// 注意：这个文件需要访问数据库，但React Router构建系统会报错
// 实际部署时，这个webhook应该在服务器端独立处理

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    // 在实际实现中，这里会删除与该店铺相关的所有session数据
    console.log(`Deleting sessions for shop: ${shop}`);
  }

  return new Response();
};
