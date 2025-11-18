import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ProductionChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ProductionChart({ trend }) {
  if (!trend || trend.length === 0) {
    return (
      <div className="production-chart-container">
        <div className="no-chart-data">No production trend data available</div>
      </div>
    );
  }

  const chartData = {
    labels: trend.map(t => t.hour),
    datasets: [
      {
        label: 'Parts Produced',
        data: trend.map(t => t.count),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 14, weight: '600' },
          color: '#1f2937',
          padding: 15
        }
      },
      title: {
        display: true,
        text: '📊 Production Trend (Last 6 Hours)',
        font: { size: 18, weight: 'bold' },
        color: '#1f2937',
        padding: { top: 10, bottom: 15 }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            return `Parts: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },
          color: '#6b7280',
          callback: function(value) {
            return value.toLocaleString();
          }
        },
        grid: {
          color: '#e5e7eb',
          drawBorder: false
        }
      },
      x: {
        ticks: {
          font: { size: 12 },
          color: '#6b7280'
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="production-chart-container">
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default ProductionChart;
