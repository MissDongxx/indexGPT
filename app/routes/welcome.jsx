import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // 验证管理员权限
  await authenticate.admin(request);

  return null;
};

export default function Welcome() {
  const navigate = useNavigate();
  const { host } = useAppBridge();

  // 安装成功后显示欢迎信息
  useEffect(() => {
    // 可以在这里添加任何安装后的初始化逻辑
  }, []);

  const handleContinue = () => {
    // 导航到主应用页面
    navigate("/app");
  };

  return (
    &lt;s-page heading="Welcome to IndexGPT!"&gt;
      &lt;s-section&gt;
        &lt;s-paragraph&gt;
          Congratulations! Your store has been successfully connected to IndexGPT.
          We'll now automatically generate AI-indexable content (llms.txt) for your store
          and submit it to search engines to improve your AI discoverability.
        &lt;/s-paragraph&gt;
      &lt;/s-section&gt;

      &lt;s-section heading="What's next?"&gt;
        &lt;s-paragraph&gt;
          &lt;s-list&gt;
            &lt;s-list-item&gt;Generate llms.txt file with your store content&lt;/s-list-item&gt;
            &lt;s-list-item&gt;Submit to IndexNow API for better search visibility&lt;/s-list-item&gt;
            &lt;s-list-item&gt;Track submission status in the dashboard&lt;/s-list-item&gt;
          &lt;/s-list&gt;
        &lt;/s-paragraph&gt;
      &lt;/s-section&gt;

      &lt;s-section&gt;
        &lt;s-button slot="primary-action" onClick={handleContinue}&gt;
          Continue to Dashboard
        &lt;/s-button&gt;
      &lt;/s-section&gt;
    &lt;/s-page&gt;
  );
}