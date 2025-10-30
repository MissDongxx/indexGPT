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
    <s-page heading="Submission Logs">
      <s-section>
        <s-inline-stack align="space-between">
          <s-text as="h3">IndexNow Submission History</s-text>
          <s-button onClick={refreshLogs} variant="secondary">
            Refresh
          </s-button>
        </s-inline-stack>
      </s-section>

      {loading ? (
        <s-section>
          <s-spinner size="large" />
          <s-text>Loading logs...</s-text>
        </s-section>
      ) : (
        <s-section>
          {logs.length === 0 ? (
            <s-text>No submission logs found.</s-text>
          ) : (
            <s-table>
              <s-table-head>
                <s-table-row>
                  <s-table-header-cell>Timestamp</s-table-header-cell>
                  <s-table-header-cell>Status</s-table-header-cell>
                  <s-table-header-cell>URL Count</s-table-header-cell>
                  <s-table-header-cell>Response Code</s-table-header-cell>
                  <s-table-header-cell>Message</s-table-header-cell>
                </s-table-row>
              </s-table-head>
              <s-table-body>
                {logs.map((log) => (
                  <s-table-row key={log.id}>
                    <s-table-cell>
                      {new Date(log.timestamp).toLocaleString()}
                    </s-table-cell>
                    <s-table-cell>
                      <s-badge tone={getStatusColor(log.status)}>
                        {log.status}
                      </s-badge>
                    </s-table-cell>
                    <s-table-cell>{log.urlCount}</s-table-cell>
                    <s-table-cell>{log.responseCode || 'N/A'}</s-table-cell>
                    <s-table-cell>
                      {log.message || 'No message'}
                    </s-table-cell>
                  </s-table-row>
                ))}
              </s-table-body>
            </s-table>
          )}

          {/* 分页控件 */}
          {logs.length > 0 && (
            <s-section>
              <s-inline-stack align="center" gap="base">
                <s-button
                  onClick={handlePrevious}
                  disabled={pagination.offset === 0}
                  variant="secondary"
                >
                  Previous
                </s-button>
                <s-text>
                  {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
                </s-text>
                <s-button
                  onClick={handleNext}
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                  variant="secondary"
                >
                  Next
                </s-button>
              </s-inline-stack>
            </s-section>
          )}
        </s-section>
      )}

      <s-section>
        <s-button
          onClick={submitToIndexNow}
          loading={fetcher.state === "submitting"}
        >
          Submit to IndexNow Now
        </s-button>
      </s-section>
    </s-page>
  );
}