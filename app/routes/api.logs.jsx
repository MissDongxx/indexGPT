import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// 获取提交日志的API端点
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  try {
    // 获取店铺信息
    const shop = await prisma.shop.findUnique({
      where: { shopDomain: session.shop }
    });

    if (!shop) {
      return new Response(JSON.stringify({
        success: false,
        message: "Shop not found"
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 获取最近的提交日志（默认最近10条）
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = parseInt(url.searchParams.get('offset')) || 0;

    const logs = await prisma.submissionLog.findMany({
      where: {
        shopId: shop.id
      },
      orderBy: {
        timestamp: 'desc'
      },
      skip: offset,
      take: limit
    });

    // 获取总日志数
    const totalLogs = await prisma.submissionLog.count({
      where: {
        shopId: shop.id
      }
    });

    return new Response(JSON.stringify({
      success: true,
      logs: logs,
      total: totalLogs,
      limit: limit,
      offset: offset
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to fetch logs",
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