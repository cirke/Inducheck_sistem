import { useDashboardData } from './hooks/useDashboardData';
import StatusBar from './components/StatusBar';
import MachineGrid from './components/MachineGrid';
import ProductionChart from './components/ProductionChart';
import './App.css';

function App() {
  const { data, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-screen">
          <div className="error-icon">⚠️</div>
          <h2>Failed to load dashboard</h2>
          <p>{error}</p>
          <p className="error-hint">Make sure the backend server is running on port 5000</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app">
        <div className="error-screen">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <StatusBar summary={data.summary} />
      <MachineGrid machines={data.machines} />
      <ProductionChart trend={data.production_trend} />
    </div>
  );
}

export default App;
