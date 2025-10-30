import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

// 获取设置的API端点
export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  try {
    // 获取店铺信息和设置
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

    return new Response(JSON.stringify({
      success: true,
      settings: shop.settings || {
        language: "en-US",
        submitFrequency: "daily",
        includePaths: ["/products/", "/collections/"]
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to fetch settings",
      error: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// 更新设置的API端点
export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

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

    // 解析设置数据
    const settingsData = {};
    for (const [key, value] of formData.entries()) {
      if (key === 'includePaths') {
        try {
          settingsData[key] = JSON.parse(value);
        } catch (e) {
          settingsData[key] = value.split(',').map(path => path.trim());
        }
      } else {
        settingsData[key] = value;
      }
    }

    // 更新或创建设置
    let settings;
    const existingSettings = await prisma.setting.findUnique({
      where: { shopId: shop.id }
    });

    if (existingSettings) {
      settings = await prisma.setting.update({
        where: { shopId: shop.id },
        data: settingsData
      });
    } else {
      settings = await prisma.setting.create({
        data: {
          ...settingsData,
          shopId: shop.id
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Settings updated successfully",
      settings
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to update settings",
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