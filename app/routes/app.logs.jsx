import { useEffect, useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    limit: 10,
    offset: 0,
    total: 0
  });

  const fetcher = useFetcher();
  const shopify = useAppBridge();

  // 获取日志数据
  const fetchLogs = async (limit = 10, offset = 0) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/logs?limit=${limit}&offset=${offset}`);
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs);
        setPagination({
          limit: data.limit,
          offset: data.offset,
          total: data.total
        });
      } else {
        shopify.toast.show("Failed to fetch logs: " + data.message, { isError: true });
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      shopify.toast.show("Error fetching logs", { isError: true });
    } finally {
      setLoading(false);
    }
  };

  // 刷新日志
  const refreshLogs = () => {
    fetchLogs(pagination.limit, pagination.offset);
  };

  // 提交到IndexNow
  const submitToIndexNow = () => {
    fetcher.submit({ action: 'submit' }, { method: 'post', action: '/api/indexnow/submit' });
  };

  // 处理提交结果
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        shopify.toast.show(fetcher.data.message);
        // 提交成功后刷新日志
        refreshLogs();
      } else {
        shopify.toast.show(fetcher.data.message || "Failed to submit", { isError: true });
      }
    }
  }, [fetcher.data]);

  // 初始加载日志
  useEffect(() => {
    fetchLogs();
  }, []);

  // 分页处理
  const handlePrevious = () => {
    const newOffset = Math.max(0, pagination.offset - pagination.limit);
    fetchLogs(pagination.limit, newOffset);
  };

  const handleNext = () => {
    const newOffset = pagination.offset + pagination.limit;
    if (newOffset < pagination.total) {
      fetchLogs(pagination.limit, newOffset);
    }
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'critical';
      default:
        return 'warning';
    }
  };

  return (
    &lt;s-page heading="Submission Logs"&gt;
      &lt;s-section&gt;
        &lt;s-inline-stack align="space-between"&gt;
          &lt;s-text as="h3"&gt;IndexNow Submission History&lt;/s-text&gt;
          &lt;s-button onClick={refreshLogs} variant="secondary"&gt;
            Refresh
          &lt;/s-button&gt;
        &lt;/s-inline-stack&gt;
      &lt;/s-section&gt;

      {loading ? (
        &lt;s-section&gt;
          &lt;s-spinner size="large" /&gt;
          &lt;s-text&gt;Loading logs...&lt;/s-text&gt;
        &lt;/s-section&gt;
      ) : (
        &lt;s-section&gt;
          {logs.length === 0 ? (
            &lt;s-text&gt;No submission logs found.&lt;/s-text&gt;
          ) : (
            &lt;s-table&gt;
              &lt;s-table-head&gt;
                &lt;s-table-row&gt;
                  &lt;s-table-header-cell&gt;Timestamp&lt;/s-table-header-cell&gt;
                  &lt;s-table-header-cell&gt;Status&lt;/s-table-header-cell&gt;
                  &lt;s-table-header-cell&gt;URL Count&lt;/s-table-header-cell&gt;
                  &lt;s-table-header-cell&gt;Response Code&lt;/s-table-header-cell&gt;
                  &lt;s-table-header-cell&gt;Message&lt;/s-table-header-cell&gt;
                &lt;/s-table-row&gt;
              &lt;/s-table-head&gt;
              &lt;s-table-body&gt;
                {logs.map((log) => (
                  &lt;s-table-row key={log.id}&gt;
                    &lt;s-table-cell&gt;
                      {new Date(log.timestamp).toLocaleString()}
                    &lt;/s-table-cell&gt;
                    &lt;s-table-cell&gt;
                      &lt;s-badge tone={getStatusColor(log.status)}&gt;
                        {log.status}
                      &lt;/s-badge&gt;
                    &lt;/s-table-cell&gt;
                    &lt;s-table-cell&gt;{log.urlCount}&lt;/s-table-cell&gt;
                    &lt;s-table-cell&gt;{log.responseCode || 'N/A'}&lt;/s-table-cell&gt;
                    &lt;s-table-cell&gt;
                      {log.message || 'No message'}
                    &lt;/s-table-cell&gt;
                  &lt;/s-table-row&gt;
                ))}
              &lt;/s-table-body&gt;
            &lt;/s-table&gt;
          )}

          {/* 分页控件 */}
          {logs.length > 0 && (
            &lt;s-section&gt;
              &lt;s-inline-stack align="center" gap="base"&gt;
                &lt;s-button
                  onClick={handlePrevious}
                  disabled={pagination.offset === 0}
                  variant="secondary"
                &gt;
                  Previous
                &lt;/s-button&gt;
                &lt;s-text&gt;
                  {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
                &lt;/s-text&gt;
                &lt;s-button
                  onClick={handleNext}
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                  variant="secondary"
                &gt;
                  Next
                &lt;/s-button&gt;
              &lt;/s-inline-stack&gt;
            &lt;/s-section&gt;
          )}
        &lt;/s-section&gt;
      )}

      &lt;s-section&gt;
        &lt;s-button
          onClick={submitToIndexNow}
          loading={fetcher.state === "submitting"}
        &gt;
          Submit to IndexNow Now
        &lt;/s-button&gt;
      &lt;/s-section&gt;
    &lt;/s-page&gt;
  );
}