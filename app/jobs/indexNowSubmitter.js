// IndexNow自动提交任务
import prisma from "../db.server";

// 自动提交URL到IndexNow的任务
export async function autoSubmitToIndexNow() {
  try {
    // 获取所有已安装且启用了自动提交的店铺
    const shops = await prisma.shop.findMany({
      include: {
        settings: true
      }
    });

    console.log(`Found ${shops.length} shops to process for IndexNow submission`);

    const results = [];

    for (const shop of shops) {
      try {
        // 检查是否启用了自动提交
        if (!process.env.AUTO_SUBMIT_URLS || process.env.AUTO_SUBMIT_URLS !== 'true') {
          console.log(`Auto submission disabled for ${shop.shopDomain}`);
          continue;
        }

        const setting = shop.settings;
        if (!setting) {
          console.log(`No settings found for ${shop.shopDomain}`);
          continue;
        }

        console.log(`Processing IndexNow submission for ${shop.shopDomain}`);

        // 在实际实现中，这里会:
        // 1. 生成或获取最新的URL列表
        // 2. 获取IndexNow API Key
        // 3. 提交到IndexNow API
        // 4. 记录提交日志

        // 模拟提交过程
        const host = shop.shopDomain.replace('https://', '');
        const urlList = [
          `https://${host}/products/example-product-1`,
          `https://${host}/products/example-product-2`,
          `https://${host}/collections/all`
        ];

        // 检查每日提交限制 (10,000 URLs)
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
          console.log(`Daily limit reached for ${shop.shopDomain}`);
          results.push({
            shop: shop.shopDomain,
            status: 'skipped',
            reason: 'Daily limit reached'
          });
          continue;
        }

        // 模拟API调用成功
        const success = Math.random() > 0.2; // 80% 成功率

        // 记录提交日志
        await prisma.submissionLog.create({
          data: {
            shopId: shop.id,
            status: success ? "success" : "failed",
            urlCount: urlList.length,
            responseCode: success ? 200 : 500,
            message: success ? "Successfully submitted to IndexNow" : "Failed to submit to IndexNow"
          }
        });

        results.push({
          shop: shop.shopDomain,
          status: success ? 'success' : 'failed'
        });

        console.log(`Completed IndexNow submission for ${shop.shopDomain}`);
      } catch (error) {
        console.error(`Error processing shop ${shop.shopDomain}:`, error);
        results.push({
          shop: shop.shopDomain,
          status: 'error',
          error: error.message
        });
      }
    }

    return {
      success: true,
      message: `Processed ${shops.length} shops`,
      results
    };
  } catch (error) {
    console.error("Error in autoSubmitToIndexNow:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 失败重试机制
export async function retryFailedSubmissions() {
  try {
    // 获取最近24小时内失败的提交记录
    const failedLogs = await prisma.submissionLog.findMany({
      where: {
        status: "failed",
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      include: {
        shop: true
      }
    });

    console.log(`Found ${failedLogs.length} failed submissions to retry`);

    const results = [];

    for (const log of failedLogs) {
      try {
        // 检查重试次数
        const retryCount = await prisma.submissionLog.count({
          where: {
            shopId: log.shopId,
            message: {
              contains: log.message
            },
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        });

        // 最多重试3次
        if (retryCount >= 3) {
          console.log(`Max retries reached for shop ${log.shop.shopDomain}`);
          results.push({
            shop: log.shop.shopDomain,
            status: 'skipped',
            reason: 'Max retries reached'
          });
          continue;
        }

        // 在实际实现中，这里会重新提交URL到IndexNow
        console.log(`Retrying submission for ${log.shop.shopDomain}`);

        // 模拟重试成功
        const success = Math.random() > 0.5; // 50% 重试成功率

        // 记录重试日志
        await prisma.submissionLog.create({
          data: {
            shopId: log.shopId,
            status: success ? "success" : "failed",
            urlCount: log.urlCount,
            responseCode: success ? 200 : 500,
            message: success ?
              "Successfully resubmitted to IndexNow" :
              `Retry failed: ${log.message}`
          }
        });

        results.push({
          shop: log.shop.shopDomain,
          status: success ? 'success' : 'failed',
          retry: retryCount + 1
        });
      } catch (error) {
        console.error(`Error retrying submission for log ${log.id}:`, error);
        results.push({
          shop: log.shop.shopDomain,
          status: 'error',
          error: error.message
        });
      }
    }

    return {
      success: true,
      message: `Processed ${failedLogs.length} failed submissions`,
      results
    };
  } catch (error) {
    console.error("Error in retryFailedSubmissions:", error);
    return {
      success: false,
      error: error.message
    };
  }
}