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
    <s-page heading="Welcome to IndexGPT!">
      <s-section>
        <s-paragraph>
          Congratulations! Your store has been successfully connected to IndexGPT.
          We'll now automatically generate AI-indexable content (llms.txt) for your store
          and submit it to search engines to improve your AI discoverability.
        </s-paragraph>
      </s-section>

      <s-section heading="What's next?">
        <s-paragraph>
          <s-list>
            <s-list-item>Generate llms.txt file with your store content</s-list-item>
            <s-list-item>Submit to IndexNow API for better search visibility</s-list-item>
            <s-list-item>Track submission status in the dashboard</s-list-item>
          </s-list>
        </s-paragraph>
      </s-section>

      <s-section>
        <s-button slot="primary-action" onClick={handleContinue}>
          Continue to Dashboard
        </s-button>
      </s-section>
    </s-page>
  );
}