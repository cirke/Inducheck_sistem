# API Specification - InduCheck Dashboard

## 🔌 Backend API Endpoints

### **Base URL**
```
Development: http://localhost:5000
Production:  http://192.168.1.100:5000
```

---

## Endpoint: GET /api/dashboard/live

### **Description**
Vraća real-time status svih mašina, summary statistike, production trend i aktive alerte.

### **Method**
```
GET /api/dashboard/live
```

### **Authentication**
None (public endpoint za MVP)

### **Request Headers**
```
Content-Type: application/json
```

### **Request Parameters**
None

### **Response Status Codes**

| Code | Description |
|------|-------------|
| 200  | Success - Vraća JSON data |
| 500  | Internal Server Error |

---

### **Response Schema**

```json
{
  "machines": [Machine],
  "summary": Summary,
  "production_trend": [TrendPoint],
  "alerts": [Alert]
}
```

#### **Machine Object**
```json
{
  "machine_id": "M-01",
  "status": "running",
  "product_id": "PROD-A",
  "count_today": 1247,
  "cycle_time_s": 4.2,
  "oee": 87,
  "shift": 2,
  "operator_name": "Marko Marković",
  "last_detection": "2025-11-18T14:35:08Z",
  "downtime_minutes": 0
}
```

**Field Descriptions:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `machine_id` | string | Jedinstveni ID mašine | `"M-01"` |
| `status` | enum | Status mašine: `running`, `stopped`, `warning`, `offline` | `"running"` |
| `product_id` | string | ID proizvoda koji se trenutno pravi | `"PROD-A"` |
| `count_today` | integer | Broj proizvoda napravljenih danas | `1247` |
| `cycle_time_s` | float | Trenutno cycle time u sekundama | `4.2` |
| `oee` | integer | Overall Equipment Effectiveness (%) | `87` |
| `shift` | integer | Smjena: 1 (08-16h), 2 (16-00h), 3 (00-08h) | `2` |
| `operator_name` | string | Ime operatera | `"Marko Marković"` |
| `last_detection` | string | ISO 8601 timestamp zadnje detekcije (UTC) | `"2025-11-18T14:35:08Z"` |
| `downtime_minutes` | integer | Koliko dugo je mašina u zastoju (0 ako radi) | `0` ili `47` |

#### **Summary Object**
```json
{
  "total_running": 48,
  "total_stopped": 2,
  "total_offline": 0,
  "total_warning": 3,
  "avg_oee": 82.3,
  "total_parts_today": 47532
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `total_running` | integer | Broj mašina sa statusom `running` |
| `total_stopped` | integer | Broj mašina sa statusom `stopped` |
| `total_offline` | integer | Broj mašina sa statusom `offline` |
| `total_warning` | integer | Broj mašina sa statusom `warning` |
| `avg_oee` | float | Prosječan OEE svih mašina (%) |
| `total_parts_today` | integer | Ukupan broj proizvoda svih mašina danas |

#### **TrendPoint Object**
```json
{
  "hour": "09:00",
  "count": 4523
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `hour` | string | Vrijeme (format: `HH:MM`) |
| `count` | integer | Broj proizvoda u tom satu |

**Napomena:** Trend array sadrži podatke za zadnjih 6 sati.

#### **Alert Object**
```json
{
  "machine_id": "M-03",
  "type": "downtime",
  "duration_minutes": 47,
  "started_at": "2025-11-18T13:48:30Z"
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `machine_id` | string | ID mašine sa problemom |
| `type` | enum | Tip alerta: `downtime`, `performance`, `offline` |
| `duration_minutes` | integer | Koliko dugo traje problem |
| `started_at` | string | ISO 8601 timestamp kada je problem počeo |

---

### **Full Response Example**

```json
{
  "machines": [
    {
      "machine_id": "M-01",
      "status": "running",
      "product_id": "PROD-A",
      "count_today": 1247,
      "cycle_time_s": 4.2,
      "oee": 87,
      "shift": 2,
      "operator_name": "Marko Marković",
      "last_detection": "2025-11-18T14:35:08Z",
      "downtime_minutes": 0
    },
    {
      "machine_id": "M-02",
      "status": "running",
      "product_id": "PROD-B",
      "count_today": 892,
      "cycle_time_s": 5.1,
      "oee": 82,
      "shift": 2,
      "operator_name": "Ana Anić",
      "last_detection": "2025-11-18T14:35:11Z",
      "downtime_minutes": 0
    },
    {
      "machine_id": "M-03",
      "status": "stopped",
      "product_id": "PROD-A",
      "count_today": 534,
      "cycle_time_s": 0,
      "oee": 45,
      "shift": 2,
      "operator_name": "Petar Petrović",
      "last_detection": "2025-11-18T13:48:23Z",
      "downtime_minutes": 47
    },
    {
      "machine_id": "M-04",
      "status": "warning",
      "product_id": "PROD-C",
      "count_today": 654,
      "cycle_time_s": 7.3,
      "oee": 67,
      "shift": 2,
      "operator_name": "Ivana Ivanović",
      "last_detection": "2025-11-18T14:35:05Z",
      "downtime_minutes": 0
    }
    // ... 46 more machines
  ],
  "summary": {
    "total_running": 46,
    "total_stopped": 2,
    "total_offline": 0,
    "total_warning": 2,
    "avg_oee": 82.3,
    "total_parts_today": 47532
  },
  "production_trend": [
    { "hour": "09:00", "count": 4523 },
    { "hour": "10:00", "count": 5234 },
    { "hour": "11:00", "count": 6012 },
    { "hour": "12:00", "count": 5789 },
    { "hour": "13:00", "count": 4321 },
    { "hour": "14:00", "count": 6543 }
  ],
  "alerts": [
    {
      "machine_id": "M-03",
      "type": "downtime",
      "duration_minutes": 47,
      "started_at": "2025-11-18T13:48:30Z"
    },
    {
      "machine_id": "M-04",
      "type": "performance",
      "duration_minutes": 23,
      "started_at": "2025-11-18T14:12:00Z"
    }
  ]
}
```

---

## Status Calculation Rules

### **Status: `running`**
**Uslovi:**
- Last detection < 5 minuta ago
- OEE ≥ 75%
- Cycle time je unutar normalnih granica

**Visual:**
- 🟢 Zelena boja
- Background: Light green tint
- No blinking

### **Status: `stopped`**
**Uslovi:**
- Last detection ≥ 5 minuta ago
- Mašina je online (šalje heartbeat) ali nema detekcija

**Visual:**
- 🔴 Crvena boja
- Background: Light red tint
- **BLINK animacija** (pulsira svakih 500ms)

### **Status: `warning`**
**Uslovi:**
- Last detection < 5 minuta ago (radi)
- ALI: OEE < 75% ili cycle time > target × 1.2

**Visual:**
- 🟡 Žuta boja
- Background: Light yellow tint
- No blinking (static)

### **Status: `offline`**
**Uslovi:**
- Last detection ≥ 2 minuta ago
- Nema heartbeat sa ESP32 uređaja

**Visual:**
- ⚪ Siva boja
- Background: Light gray tint
- Opacity: 0.7 (izbljeđeno)

---

## Backend Implementation Pseudocode

```python
# api/dashboard.py

from flask import jsonify
from datetime import datetime, timedelta
from services.dummy_data import generate_dummy_machines

@app.route('/api/dashboard/live', methods=['GET'])
def get_dashboard_live():
    # 1. Get machine data (iz PostgreSQL ili dummy data)
    machines = generate_dummy_machines(50)

    # 2. Calculate summary
    summary = {
        'total_running': len([m for m in machines if m['status'] == 'running']),
        'total_stopped': len([m for m in machines if m['status'] == 'stopped']),
        'total_offline': len([m for m in machines if m['status'] == 'offline']),
        'total_warning': len([m for m in machines if m['status'] == 'warning']),
        'avg_oee': round(sum(m['oee'] for m in machines) / len(machines), 1),
        'total_parts_today': sum(m['count_today'] for m in machines)
    }

    # 3. Generate production trend (dummy za sada)
    trend = [
        {'hour': f'{h:02d}:00', 'count': random.randint(4000, 7000)}
        for h in range(9, 15)
    ]

    # 4. Collect alerts
    alerts = [
        {
            'machine_id': m['machine_id'],
            'type': 'downtime' if m['status'] == 'stopped' else 'performance',
            'duration_minutes': m['downtime_minutes'],
            'started_at': m['last_detection']
        }
        for m in machines
        if m['status'] in ['stopped', 'warning']
    ]

    return jsonify({
        'machines': machines,
        'summary': summary,
        'production_trend': trend,
        'alerts': alerts
    })
```

---

## Frontend API Client

```javascript
// src/services/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function fetchDashboardData() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/dashboard/live`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
}
```

**Usage u komponenti:**
```jsx
// App.jsx
import { useEffect, useState } from 'react';
import { fetchDashboardData } from './services/api';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardData();
      setData(data);
    };

    loadData(); // Initial load
    const interval = setInterval(loadData, 5000); // Refresh svaki 5s

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <StatusBar summary={data.summary} />
      <MachineGrid machines={data.machines} />
      <ProductionChart trend={data.production_trend} />
    </div>
  );
}
```

---

## Error Handling

### **Backend Error Responses**

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "Failed to query database",
  "timestamp": "2025-11-18T14:35:08Z"
}
```

### **Frontend Error Handling**

```javascript
try {
  const data = await fetchDashboardData();
  setData(data);
  setError(null);
} catch (error) {
  setError('Failed to load dashboard data. Retrying...');
  console.error(error);
}
```

**Display Error in UI:**
```jsx
{error && (
  <div className="error-banner">
    ⚠️ {error}
  </div>
)}
```

---

## CORS Configuration

**Backend (Flask):**
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])  # React dev server
```

**Development `.env`:**
```
FLASK_ENV=development
CORS_ORIGINS=http://localhost:3000
```

**Production `.env`:**
```
FLASK_ENV=production
CORS_ORIGINS=http://192.168.1.100:3000
```

---

**Verzija:** 1.0
**Status:** Ready for implementation
