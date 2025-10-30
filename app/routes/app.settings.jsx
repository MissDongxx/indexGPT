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
    &lt;s-page heading="Settings"&gt;
      {loading ? (
        &lt;s-section&gt;
          &lt;s-spinner size="large" /&gt;
          &lt;s-text&gt;Loading settings...&lt;/s-text&gt;
        &lt;/s-section&gt;
      ) : (
        &lt;s-section&gt;
          &lt;s-form&gt;
            &lt;s-block-stack gap="large"&gt;
              {/* 语言设置 */}
              &lt;s-box background="surface" padding="base" border-radius="base"&gt;
                &lt;s-block-stack gap="base"&gt;
                  &lt;s-text as="h3"&gt;Language&lt;/s-text&gt;
                  &lt;s-select
                    label="Interface Language"
                    options={[
                      { label: "English", value: "en-US" },
                      { label: "中文", value: "zh-CN" }
                    ]}
                    value={settings.language}
                    onChange={handleLanguageChange}
                  &gt;
                  &lt;/s-select&gt;
                &lt;/s-block-stack&gt;
              &lt;/s-box&gt;

              {/* 提交频率设置 */}
              &lt;s-box background="surface" padding="base" border-radius="base"&gt;
                &lt;s-block-stack gap="base"&gt;
                  &lt;s-text as="h3"&gt;Submission Frequency&lt;/s-text&gt;
                  &lt;s-select
                    label="How often should we submit to IndexNow?"
                    options={[
                      { label: "Hourly", value: "hourly" },
                      { label: "Daily", value: "daily" },
                      { label: "Weekly", value: "weekly" }
                    ]}
                    value={settings.submitFrequency}
                    onChange={handleFrequencyChange}
                  &gt;
                  &lt;/s-select&gt;
                &lt;/s-block-stack&gt;
              &lt;/s-box&gt;

              {/* 包含路径设置 */}
              &lt;s-box background="surface" padding="base" border-radius="base"&gt;
                &lt;s-block-stack gap="base"&gt;
                  &lt;s-text as="h3"&gt;Include Paths&lt;/s-text&gt;
                  &lt;s-text-field
                    label="Paths to include in llms.txt (one per line)"
                    multiline={5}
                    value={settings.includePaths.join('\n')}
                    onChange={handlePathsChange}
                  &gt;
                  &lt;/s-text-field&gt;
                  &lt;s-text as="p" variant="bodySm" tone="subdued"&gt;
                    Specify which paths should be included in the llms.txt file.
                    Each path should be on a separate line.
                  &lt;/s-text&gt;
                &lt;/s-block-stack&gt;
              &lt;/s-box&gt;

              {/* 保存按钮 */}
              &lt;s-button
                slot="primary-action"
                onClick={handleSave}
                loading={fetcher.state === "submitting"}
              &gt;
                Save Settings
              &lt;/s-button&gt;
            &lt;/s-block-stack&gt;
          &lt;/s-form&gt;
        &lt;/s-section&gt;
      )}
    &lt;/s-page&gt;
  );
}