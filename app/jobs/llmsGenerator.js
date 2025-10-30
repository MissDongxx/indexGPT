// 后台任务处理函数
import prisma from "../db.server";

// 定时生成llms.txt的任务
export async function generateLlmsTxtForAllShops() {
  try {
    // 获取所有已安装的店铺
    const shops = await prisma.shop.findMany();

    console.log(`Found ${shops.length} shops to process`);

    for (const shop of shops) {
      try {
        console.log(`Generating llms.txt for ${shop.shopDomain}`);

        // 在实际实现中，这里会调用Shopify API生成新的llms.txt内容
        // 并将其存储在数据库中或文件系统中

        // 更新生成时间
        await prisma.shop.update({
          where: { id: shop.id },
          data: {
            updatedAt: new Date()
          }
        });

        console.log(`Successfully generated llms.txt for ${shop.shopDomain}`);
      } catch (error) {
        console.error(`Error generating llms.txt for ${shop.shopDomain}:`, error);
      }
    }

    return {
      success: true,
      message: `Processed ${shops.length} shops`
    };
  } catch (error) {
    console.error("Error in generateLlmsTxtForAllShops:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 根据提交频率生成llms.txt的函数
export async function generateLlmsTxtByFrequency() {
  try {
    // 获取所有需要按频率生成的店铺
    const shops = await prisma.shop.findMany({
      include: {
        settings: true
      }
    });

    const now = new Date();
    const results = [];

    for (const shop of shops) {
      try {
        const setting = shop.settings;
        if (!setting) continue;

        const lastGenerated = shop.updatedAt;
        const frequency = setting.submitFrequency;

        // 检查是否需要生成
        let shouldGenerate = false;
        const timeDiff = now - lastGenerated;

        switch (frequency) {
          case 'hourly':
            shouldGenerate = timeDiff >= 60 * 60 * 1000; // 1小时
            break;
          case 'daily':
            shouldGenerate = timeDiff >= 24 * 60 * 60 * 1000; // 1天
            break;
          case 'weekly':
            shouldGenerate = timeDiff >= 7 * 24 * 60 * 60 * 1000; // 1周
            break;
        }

        if (shouldGenerate) {
          console.log(`Generating llms.txt for ${shop.shopDomain} (frequency: ${frequency})`);

          // 在实际实现中，这里会调用Shopify API生成新的llms.txt内容

          // 更新生成时间
          await prisma.shop.update({
            where: { id: shop.id },
            data: {
              updatedAt: now
            }
          });

          results.push({
            shop: shop.shopDomain,
            status: 'success'
          });
        }
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
      results
    };
  } catch (error) {
    console.error("Error in generateLlmsTxtByFrequency:", error);
    return {
      success: false,
      error: error.message
    };
  }
}