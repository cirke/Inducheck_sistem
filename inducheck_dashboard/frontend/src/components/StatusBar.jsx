import { formatNumber, formatPercentage, getCurrentTime } from '../utils/formatters';
import './StatusBar.css';

function StatusBar({ summary }) {
  if (!summary) {
    return <div className="status-bar">Loading...</div>;
  }

  const {
    total_running,
    total_stopped,
    total_warning,
    total_offline,
    avg_oee,
    total_parts_today
  } = summary;

  return (
    <div className="status-bar">
      <div className="status-bar-left">
        <h1 className="dashboard-title">🏭 InduCheck Live Monitoring</h1>
      </div>

      <div className="status-bar-center">
        <div className="status-item running">
          <span className="status-emoji">🟢</span>
          <span className="status-count">{total_running}</span>
          <span className="status-label">Running</span>
        </div>

        <div className="status-item stopped">
          <span className="status-emoji">🔴</span>
          <span className="status-count">{total_stopped}</span>
          <span className="status-label">Stopped</span>
        </div>

        <div className="status-item warning">
          <span className="status-emoji">🟡</span>
          <span className="status-count">{total_warning}</span>
          <span className="status-label">Warnings</span>
        </div>

        <div className="status-item offline">
          <span className="status-emoji">⚪</span>
          <span className="status-count">{total_offline}</span>
          <span className="status-label">Offline</span>
        </div>
      </div>

      <div className="status-bar-right">
        <div className="summary-item">
          <span className="summary-label">Total Today:</span>
          <span className="summary-value">{formatNumber(total_parts_today)} parts</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Avg OEE:</span>
          <span className="summary-value">{formatPercentage(avg_oee)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Last update:</span>
          <span className="summary-value">{getCurrentTime()}</span>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
