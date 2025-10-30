import { authenticate } from "../shopify.server";
// 注意：这个文件需要访问数据库，但React Router构建系统会报错
// 实际部署时，这个webhook应该在服务器端独立处理

export const action = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;

  // 在实际实现中，这里会更新session的scope信息
  console.log(`Updating scope for session ${session?.id}: ${current}`);

  return new Response();
};
