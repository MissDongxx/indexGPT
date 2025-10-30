import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// 生成IndexNow API Key的函数
function generateIndexNowKey() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// 验证IndexNow API Key的函数
function validateApiKey(key) {
  return /^[a-zA-Z0-9]{32,64}$/.test(key);
}

// 提交URL到IndexNow的函数
async function submitToIndexNow(host, key, urlList) {
  try {
    // 如果URL数量超过10000，分批提交
    const batchSize = 10000;
    const results = [];

    for (let i = 0; i < urlList.length; i += batchSize) {
      const batch = urlList.slice(i, i + batchSize);

      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          host: host,
          key: key,
          urlList: batch
        })
      });

      const result = {
        batch: i / batchSize + 1,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      };

      if (response.ok) {
        result.message = "Successfully submitted to IndexNow";
      } else {
        const errorText = await response.text();
        result.error = errorText;
        result.message = `Failed to submit to IndexNow: ${response.status} ${errorText}`;
      }

      results.push(result);
    }

    return {
      success: true,
      batches: results
    };
  } catch (error) {
    console.error("Error submitting to IndexNow:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 手动触发IndexNow提交的API端点
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const actionType = formData.get('action') || 'submit';

  try {
    // 获取店铺信息
    const shop = await prisma.shop.findUnique({
      where: { shopDomain: session.shop },
      include: { settings: true }
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

    // 处理不同的操作类型
    switch (actionType) {
      case 'generate_key':
        // 生成新的IndexNow API Key
        const newKey = generateIndexNowKey();

        // 在实际实现中，这里应该安全地存储API Key
        // 为简化起见，我们只返回而不存储

        return new Response(JSON.stringify({
          success: true,
          message: "API Key generated successfully",
          key: newKey
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });

      case 'submit':
      default:
        // 提交URL到IndexNow
        const host = session.shop.replace('https://', '');

        // 在实际实现中，这里应该从安全存储中获取API Key
        // 为简化起见，我们生成一个临时Key
        const apiKey = generateIndexNowKey();

        // 获取要提交的URL列表
        // 在实际实现中，这里应该从llms.txt或其他来源获取URL列表
        const urlList = [
          `https://${host}/products/example-product-1`,
          `https://${host}/products/example-product-2`,
          `https://${host}/collections/all`,
          `https://${host}/pages/about-us`
        ];

        // 检查每日提交限制
        const today = new Date().toDateString();
        const todayLogs = await prisma.submissionLog.count({
          where: {
            shopId: shop.id,
            timestamp: {
              gte: new Date(today)
            }
          }
        });

        if (todayLogs >= 10000) {
          return new Response(JSON.stringify({
            success: false,
            message: "Daily submission limit reached (10,000 URLs)"
          }), {
            status: 429,
            headers: { "Content-Type": "application/json" }
          });
        }

        // 提交到IndexNow
        const submitResult = await submitToIndexNow(host, apiKey, urlList);

        // 记录提交日志
        await prisma.submissionLog.create({
          data: {
            shopId: shop.id,
            status: submitResult.success ? "success" : "failed",
            urlCount: urlList.length,
            responseCode: submitResult.success ? 200 : 500,
            message: submitResult.success ? "Successfully submitted to IndexNow" : submitResult.error
          }
        });

        if (submitResult.success) {
          return new Response(JSON.stringify({
            success: true,
            message: "Successfully submitted to IndexNow",
            batches: submitResult.batches
          }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          return new Response(JSON.stringify({
            success: false,
            message: "Failed to submit to IndexNow",
            error: submitResult.error
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
    }
  } catch (error) {
    console.error("Error in IndexNow submit:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Internal server error",
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