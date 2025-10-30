import { useEffect, useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Settings() {
  const [settings, setSettings] = useState({
    language: "en-US",
    submitFrequency: "daily",
    includePaths: ["/products/", "/collections/"]
  });
  const [loading, setLoading] = useState(true);

  const fetcher = useFetcher();
  const shopify = useAppBridge();

  // 获取当前设置
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.settings);
      } else {
        shopify.toast.show("Failed to fetch settings: " + data.message, { isError: true });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      shopify.toast.show("Error fetching settings", { isError: true });
    } finally {
      setLoading(false);
    }
  };

  // 保存设置
  const saveSettings = (newSettings) => {
    const formData = new FormData();
    Object.keys(newSettings).forEach(key => {
      if (key === 'includePaths') {
        formData.append(key, JSON.stringify(newSettings[key]));
      } else {
        formData.append(key, newSettings[key]);
      }
    });

    fetcher.submit(formData, { method: 'post', action: '/api/settings' });
  };

  // 处理保存结果
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        shopify.toast.show("Settings saved successfully");
        setSettings(fetcher.data.settings);
      } else {
        shopify.toast.show(fetcher.data.message || "Failed to save settings", { isError: true });
      }
    }
  }, [fetcher.data]);

  // 初始加载设置
  useEffect(() => {
    fetchSettings();
  }, []);

  // 处理表单变化
  const handleLanguageChange = (value) => {
    setSettings(prev => ({ ...prev, language: value }));
  };

  const handleFrequencyChange = (value) => {
    setSettings(prev => ({ ...prev, submitFrequency: value }));
  };

  const handlePathsChange = (value) => {
    const paths = value.split('\n').filter(path => path.trim() !== '');
    setSettings(prev => ({ ...prev, includePaths: paths }));
  };

  // 保存设置
  const handleSave = () => {
    saveSettings(settings);
  };

  return (
    <s-page heading="Settings">
      {loading ? (
        <s-section>
          <s-spinner size="large" />
          <s-text>Loading settings...</s-text>
        </s-section>
      ) : (
        <s-section>
          <s-form>
            <s-block-stack gap="large">
              {/* 语言设置 */}
              <s-box background="surface" padding="base" border-radius="base">
                <s-block-stack gap="base">
                  <s-text as="h3">Language</s-text>
                  <s-select
                    label="Interface Language"
                    options={[
                      { label: "English", value: "en-US" },
                      { label: "中文", value: "zh-CN" }
                    ]}
                    value={settings.language}
                    onChange={handleLanguageChange}
                  >
                  </s-select>
                </s-block-stack>
              </s-box>

              {/* 提交频率设置 */}
              <s-box background="surface" padding="base" border-radius="base">
                <s-block-stack gap="base">
                  <s-text as="h3">Submission Frequency</s-text>
                  <s-select
                    label="How often should we submit to IndexNow?"
                    options={[
                      { label: "Hourly", value: "hourly" },
                      { label: "Daily", value: "daily" },
                      { label: "Weekly", value: "weekly" }
                    ]}
                    value={settings.submitFrequency}
                    onChange={handleFrequencyChange}
                  >
                  </s-select>
                </s-block-stack>
              </s-box>

              {/* 包含路径设置 */}
              <s-box background="surface" padding="base" border-radius="base">
                <s-block-stack gap="base">
                  <s-text as="h3">Include Paths</s-text>
                  <s-text-field
                    label="Paths to include in llms.txt (one per line)"
                    multiline={5}
                    value={settings.includePaths.join('\n')}
                    onChange={handlePathsChange}
                  >
                  </s-text-field>
                  <s-text as="p" variant="bodySm" tone="subdued">
                    Specify which paths should be included in the llms.txt file.
                    Each path should be on a separate line.
                  </s-text>
                </s-block-stack>
              </s-box>

              {/* 保存按钮 */}
              <s-button
                slot="primary-action"
                onClick={handleSave}
                loading={fetcher.state === "submitting"}
              >
                Save Settings
              </s-button>
            </s-block-stack>
          </s-form>
        </s-section>
      )}
    </s-page>
  );
}