"""
Dummy data generator for testing dashboard without PostgreSQL
Generates realistic machine status data for 50 industrial machines
"""

import random
from datetime import datetime, timedelta


def generate_dummy_machines(count=50):
    """
    Generate dummy machine data for testing

    Args:
        count: Number of machines to generate (default: 50)

    Returns:
        List of machine dictionaries with realistic status data
    """
    machines = []

    # Status distribution: mostly running, some stopped, few warning/offline
    # This creates a realistic factory scenario
    statuses = ['running'] * 40 + ['stopped'] * 5 + ['warning'] * 4 + ['offline'] * 1
    random.shuffle(statuses)

    product_ids = ['PROD-A', 'PROD-B', 'PROD-C', 'PROD-D']
    operator_names = [
        'Marko Marković',
        'Ana Anić',
        'Petar Petrović',
        'Ivana Ivanović',
        'Jovan Jovanović',
        'Milica Milić'
    ]

    for i in range(1, count + 1):
        machine_id = f"M-{i:02d}"
        status = statuses[i - 1] if i <= len(statuses) else 'running'

        # Generate realistic data based on status
        if status == 'stopped':
            # Stopped machine: low count, no cycle time, low OEE, significant downtime
            count_today = random.randint(200, 600)
            cycle_time_s = 0
            oee = random.randint(30, 50)
            downtime_minutes = random.randint(10, 120)
            last_detection = (datetime.utcnow() - timedelta(minutes=downtime_minutes)).isoformat() + 'Z'

        elif status == 'warning':
            # Warning: decent count, slow cycle time, OEE < 75%
            count_today = random.randint(400, 800)
            cycle_time_s = random.uniform(6.0, 9.0)
            oee = random.randint(60, 74)
            downtime_minutes = random.randint(5, 20)
            last_detection = (datetime.utcnow() - timedelta(seconds=random.randint(10, 60))).isoformat() + 'Z'

        elif status == 'offline':
            # Offline: no recent data
            count_today = random.randint(0, 300)
            cycle_time_s = 0
            oee = 0
            downtime_minutes = random.randint(120, 300)
            last_detection = (datetime.utcnow() - timedelta(minutes=downtime_minutes)).isoformat() + 'Z'

        else:  # running
            # Running: high count, normal cycle time, good OEE
            count_today = random.randint(800, 1500)
            cycle_time_s = random.uniform(3.0, 5.5)
            oee = random.randint(75, 95)
            downtime_minutes = 0
            last_detection = (datetime.utcnow() - timedelta(seconds=random.randint(2, 30))).isoformat() + 'Z'

        machine = {
            'machine_id': machine_id,
            'status': status,
            'product_id': random.choice(product_ids),
            'count_today': count_today,
            'cycle_time_s': round(cycle_time_s, 1),
            'oee': oee,
            'shift': random.randint(1, 3),
            'operator_name': random.choice(operator_names),
            'last_detection': last_detection,
            'downtime_minutes': downtime_minutes
        }

        machines.append(machine)

    return machines


if __name__ == '__main__':
    # Test the generator
    machines = generate_dummy_machines(50)
    print(f"Generated {len(machines)} machines")
    print("\nSample machine:")
    import json
    print(json.dumps(machines[0], indent=2))

    # Show status distribution
    status_counts = {}
    for m in machines:
        status_counts[m['status']] = status_counts.get(m['status'], 0) + 1
    print(f"\nStatus distribution: {status_counts}")
