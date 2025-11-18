import { getStatusEmoji, shouldBlink } from '../utils/colorUtils';
import { formatNumber, formatCycleTime, formatDuration } from '../utils/formatters';
import './MachineCard.css';

function MachineCard({ machine }) {
  const {
    machine_id,
    status,
    product_id,
    count_today,
    cycle_time_s,
    oee,
    downtime_minutes
  } = machine;

  const cardClassName = `machine-card ${status} ${shouldBlink(status) ? 'blink' : ''}`;

  return (
    <div className={cardClassName}>
      <div className="card-header">
        <span className="status-emoji">{getStatusEmoji(status)}</span>
        <span className="machine-id">{machine_id}</span>
      </div>

      <div className="card-body">
        <p className="product-id">Prod: {product_id}</p>
        <p className="count">
          Count: <strong>{formatNumber(count_today)}</strong>
        </p>

        {status === 'stopped' ? (
          <p className="cycle-time stopped-text">
            ⏸️ ZASTOJ {formatDuration(downtime_minutes)}
          </p>
        ) : status === 'offline' ? (
          <p className="cycle-time offline-text">
            🔌 OFFLINE
          </p>
        ) : (
          <p className="cycle-time">
            ⚡ {formatCycleTime(cycle_time_s)}
          </p>
        )}

        <div className={`oee-badge ${oee >= 85 ? 'good' : oee >= 75 ? 'medium' : 'poor'}`}>
          OEE: {oee}%
        </div>
      </div>
    </div>
  );
}

export default MachineCard;
