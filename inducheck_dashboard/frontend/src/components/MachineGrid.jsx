import MachineCard from './MachineCard';
import './MachineGrid.css';

function MachineGrid({ machines }) {
  if (!machines || machines.length === 0) {
    return <div className="no-data">No machine data available</div>;
  }

  return (
    <div className="machine-grid">
      {machines.map(machine => (
        <MachineCard key={machine.machine_id} machine={machine} />
      ))}
    </div>
  );
}

export default MachineGrid;
