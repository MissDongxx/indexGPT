import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  // 检查是否是新安装的店铺
  const shop = await prisma.shop.findUnique({
    where: { shopDomain: session.shop },
    include: { settings: true }
  });

  // 获取语言设置
  const language = shop?.settings?.language || "en-US";

  // eslint-disable-next-line no-undef
  return {
    apiKey: process.env.SHOPIFY_API_KEY || "",
    isNewInstallation: !shop?.settings,
    language
  };
};

export default function App() {
  const { apiKey, isNewInstallation, language } = useLoaderData();

  // 如果是新安装，重定向到欢迎页面
  if (isNewInstallation) {
    window.location.href = "/welcome";
    return null;
  }

  return (
    <AppProvider embedded apiKey={apiKey}>
      <s-app-nav>
        <s-link href="/app">Dashboard</s-link>
        <s-link href="/app/settings">Settings</s-link>
        <s-link href="/app/logs">Submission Logs</s-link>
      </s-app-nav>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
