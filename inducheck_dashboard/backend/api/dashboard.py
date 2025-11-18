"""
Dashboard API endpoints
Provides real-time machine status data
"""

from flask import Blueprint, jsonify
import random
from services.dummy_data import generate_dummy_machines

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/dashboard/live', methods=['GET'])
def get_dashboard_live():
    """
    GET /api/dashboard/live

    Returns real-time status of all 50 machines + summary + trend + alerts

    Response format:
    {
        "machines": [Machine],      # 50 machine objects
        "summary": Summary,          # Aggregate statistics
        "production_trend": [TrendPoint],  # Last 6 hours
        "alerts": [Alert]            # Active problems
    }
    """
    try:
        # Generate dummy data for 50 machines
        machines = generate_dummy_machines(50)

        # Calculate summary statistics
        summary = {
            'total_running': len([m for m in machines if m['status'] == 'running']),
            'total_stopped': len([m for m in machines if m['status'] == 'stopped']),
            'total_offline': len([m for m in machines if m['status'] == 'offline']),
            'total_warning': len([m for m in machines if m['status'] == 'warning']),
            'avg_oee': round(sum(m['oee'] for m in machines) / len(machines), 1) if machines else 0,
            'total_parts_today': sum(m['count_today'] for m in machines)
        }

        # Generate production trend for last 6 hours (dummy data)
        current_hour = 14  # Simulate 14:00 (2 PM)
        trend = []
        for h in range(6):
            hour = current_hour - (5 - h)
            if hour < 0:
                hour += 24
            trend.append({
                'hour': f'{hour:02d}:00',
                'count': random.randint(4000, 7000)
            })

        # Collect alerts from machines with problems
        alerts = []
        for m in machines:
            if m['status'] in ['stopped', 'warning']:
                alert_type = 'downtime' if m['status'] == 'stopped' else 'performance'
                alerts.append({
                    'machine_id': m['machine_id'],
                    'type': alert_type,
                    'duration_minutes': m['downtime_minutes'],
                    'started_at': m['last_detection']
                })

        # Construct response
        response = {
            'machines': machines,
            'summary': summary,
            'production_trend': trend,
            'alerts': alerts
        }

        return jsonify(response), 200

    except Exception as e:
        # Error handling
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500
