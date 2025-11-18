# Technical Requirements - InduCheck Dashboard

## 🛠️ Technology Stack

### **Backend**

**Framework:** Python Flask (preporučeno za jednostavnost)

**Alternative:** FastAPI (ako želiš async i automatski OpenAPI docs)

**Dependencies:**
```txt
flask==3.0.0
flask-cors==4.0.0
python-dotenv==1.0.0
psycopg2-binary==2.9.9    # PostgreSQL adapter
sqlalchemy==2.0.23        # ORM (opciono, možeš i raw SQL)
```

**Zašto Flask?**
- Jednostavan za setup (5 minuta)
- Lagan (nije overkill za jednostavan API)
- Odlična dokumentacija
- Može lako dodati WebSocket kasnije (flask-socketio)

---

### **Frontend**

**Framework:** React 18 + Vite

**UI Libraries:**
- **Chart.js** + react-chartjs-2 (za grafove)
- Plain CSS ili **Tailwind CSS** (za styling)

**Dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0"
  }
}
```

**Zašto Vite?**
- Brži build od Create React App
- Hot reload radi odlično
- Moderan tooling

---

### **Database**

**Primary:** PostgreSQL (za produkciju)

**Development/Testing:**
- In-memory dictionary (Python)
- JSON fajl
- SQLite (lagan file-based DB)

**Napomena:** Za MVP dashboard, možeš koristiti **dummy data** - ne treba odmah PostgreSQL!

---

## 📁 Folder Struktura

```
inducheck_dashboard/
│
├── backend/
│   ├── app.py                      # Main Flask app
│   ├── config.py                   # Environment config (.env loader)
│   ├── api/
│   │   ├── __init__.py
│   │   └── dashboard.py            # GET /api/dashboard/live endpoint
│   ├── services/
│   │   ├── __init__.py
│   │   ├── machine_status.py       # Status calculation logika
│   │   └── dummy_data.py           # Dummy data generator
│   ├── models/
│   │   ├── __init__.py
│   │   └── machine.py              # SQLAlchemy models (ako koristiš DB)
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── sounds/                 # MP3 fajlovi za alert (opciono)
│   ├── src/
│   │   ├── components/
│   │   │   ├── MachineCard.jsx           # Pojedinačna kartica
│   │   │   ├── MachineGrid.jsx           # Grid layout (10×5)
│   │   │   ├── StatusBar.jsx             # Top summary bar
│   │   │   ├── ProductionChart.jsx       # Chart.js line chart
│   │   │   └── AlertToast.jsx            # Alert notification (opciono)
│   │   ├── hooks/
│   │   │   └── useDashboardData.js       # Custom hook za polling
│   │   ├── utils/
│   │   │   ├── colorUtils.js             # Color coding funkcije
│   │   │   └── soundUtils.js             # Audio alert
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
│
├── README.md                       # Root setup instrukcije
└── docker-compose.yml              # Opciono (za laki deployment)
```

---

## 🔌 Backend Requirements

### **Endpoint Specification**

#### `GET /api/dashboard/live`

**Description:** Vraća real-time status svih mašina + summary + production trend

**Authentication:** None (public endpoint za MVP)

**Response Status Codes:**
- `200 OK` - Uspješan request
- `500 Internal Server Error` - Server greška

**Response Format:** JSON

**Response Schema:**
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
    }
  ],
  "summary": {
    "total_running": 48,
    "total_stopped": 2,
    "total_offline": 0,
    "total_warning": 3,
    "avg_oee": 82.3,
    "total_parts_today": 47532
  },
  "production_trend": [
    { "hour": "09:00", "count": 4523 },
    { "hour": "10:00", "count": 5234 }
  ],
  "alerts": [
    {
      "machine_id": "M-03",
      "type": "downtime",
      "duration_minutes": 47,
      "started_at": "2025-11-18T13:48:30Z"
    }
  ]
}
```

### **Status Calculation Logic**

```python
def calculate_status(machine):
    """
    Određuje status mašine na osnovu podataka
    """
    now = datetime.utcnow()
    last_detection = machine['last_detection']

    # Parse timestamp
    last_time = datetime.fromisoformat(last_detection.replace('Z', '+00:00'))
    time_since_last = (now - last_time).total_seconds()

    # Offline: nema podataka > 2 minuta
    if time_since_last > 120:
        return "offline"

    # Stopped: nema detekcija > 5 minuta
    if time_since_last > 300:
        return "stopped"

    # Warning: OEE < 75%
    if machine['oee'] < 75:
        return "warning"

    # Running: sve ok
    return "running"
```

### **Dummy Data Generator**

Za testiranje bez PostgreSQL-a:

```python
import random
from datetime import datetime, timedelta

def generate_dummy_machines(count=50):
    """Generira dummy podatke za testiranje"""
    machines = []
    statuses = ['running', 'running', 'running', 'running', 'stopped', 'warning']

    for i in range(1, count + 1):
        machine_id = f"M-{i:02d}"
        status = random.choice(statuses)

        # Generiši realne podatke zavisno od statusa
        if status == 'stopped':
            count_today = random.randint(200, 600)
            cycle_time_s = 0
            oee = random.randint(30, 50)
            downtime_minutes = random.randint(10, 60)
            last_detection = (datetime.utcnow() - timedelta(minutes=downtime_minutes)).isoformat() + 'Z'
        elif status == 'warning':
            count_today = random.randint(400, 800)
            cycle_time_s = random.uniform(6.0, 9.0)
            oee = random.randint(60, 74)
            downtime_minutes = 0
            last_detection = (datetime.utcnow() - timedelta(seconds=random.randint(5, 30))).isoformat() + 'Z'
        else:  # running
            count_today = random.randint(800, 1500)
            cycle_time_s = random.uniform(3.0, 5.5)
            oee = random.randint(75, 95)
            downtime_minutes = 0
            last_detection = (datetime.utcnow() - timedelta(seconds=random.randint(2, 15))).isoformat() + 'Z'

        machines.append({
            'machine_id': machine_id,
            'status': status,
            'product_id': random.choice(['PROD-A', 'PROD-B', 'PROD-C']),
            'count_today': count_today,
            'cycle_time_s': round(cycle_time_s, 1),
            'oee': oee,
            'shift': random.randint(1, 3),
            'operator_name': random.choice(['Marko Marković', 'Ana Anić', 'Petar Petrović']),
            'last_detection': last_detection,
            'downtime_minutes': downtime_minutes
        })

    return machines
```

---

## 🎨 Frontend Requirements

### **Component Breakdown**

#### **1. MachineCard.jsx**

**Props:**
```jsx
<MachineCard
  machine={{
    machine_id: "M-01",
    status: "running",
    product_id: "PROD-A",
    count_today: 1247,
    cycle_time_s: 4.2,
    oee: 87
  }}
/>
```

**Rendered Output:**
```
┌──────────────┐
│ 🟢 M-01     │  ← Status emoji
│ ──────────── │
│ Prod-A      │  ← Product ID
│ 1,247       │  ← Count today
│ ⚡ 4.2s     │  ← Cycle time
│ OEE: 87%    │  ← OEE metric
└──────────────┘
```

**CSS Requirements:**
- Border-left: 6px, color based on status
- Background: subtle color tint based on status
- Font-size: 0.9rem (readable from distance)
- Blink animation if `status === 'stopped'`

#### **2. MachineGrid.jsx**

**Layout:**
```css
.machine-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);  /* 10 columns */
  grid-template-rows: repeat(5, 1fr);     /* 5 rows */
  gap: 15px;
  padding: 20px;
  height: 65vh;
}
```

#### **3. StatusBar.jsx**

**Displayed Info:**
```
🟢 48 Running  |  🔴 2 Stopped  |  🟡 3 Warnings  |  ⚪ 0 Offline
Total Today: 47,532 parts  |  Avg OEE: 82.3%
```

#### **4. ProductionChart.jsx**

**Chart.js Configuration:**
```javascript
{
  type: 'line',
  data: {
    labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
    datasets: [{
      label: 'Parts Produced',
      data: [4523, 5234, 6012, 5789, 4321, 6543],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
}
```

### **Auto-Refresh Hook**

```jsx
// hooks/useDashboardData.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function useDashboardData(refreshInterval = 5000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/live');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchData(); // Initial load
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading };
}
```

### **Color Coding Utility**

```javascript
// utils/colorUtils.js
export function getStatusColor(status) {
  switch (status) {
    case 'running':  return '#22c55e';  // Zelena
    case 'stopped':  return '#ef4444';  // Crvena
    case 'warning':  return '#f59e0b';  // Žuta
    case 'offline':  return '#9ca3af';  // Siva
    default:         return '#6b7280';  // Default siva
  }
}

export function getStatusEmoji(status) {
  switch (status) {
    case 'running':  return '🟢';
    case 'stopped':  return '🔴';
    case 'warning':  return '🟡';
    case 'offline':  return '⚪';
    default:         return '⚫';
  }
}

export function shouldBlink(status) {
  return status === 'stopped';
}
```

---

## 🎭 CSS Animations

### **Blink Animation**

```css
@keyframes blink-fast {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.machine-card.stopped {
  animation: blink-fast 500ms infinite;
  border-color: #ef4444;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}
```

### **Responsive Grid (1920×1080)**

```css
.machine-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 15px;
  padding: 20px;
  height: 65vh;
}

/* 4K TV support */
@media (min-width: 3840px) {
  .machine-card {
    font-size: 1.6rem;
    padding: 25px;
  }
}
```

---

## 🔐 Security Requirements

**MVP (Minimum Viable Product):**
- ❌ No authentication needed (dashboard je read-only, u zatvorenom network-u)
- ✅ CORS enabled (za React development)
- ✅ Input validation (prevent injection)

**Production Later:**
- 🔒 JWT authentication za API
- 🔒 API key rotation
- 🔒 HTTPS (SSL certificate)

---

## 🧪 Testing Requirements

### **Backend Tests:**
```bash
# Test endpoint
curl http://localhost:5000/api/dashboard/live | jq

# Expected output: JSON sa 50 mašina
```

### **Frontend Tests:**
```bash
# Development server
npm start

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Integration Test:**
1. Pokreni backend: `python app.py`
2. Pokreni frontend: `npm start`
3. Otvori `http://localhost:3000`
4. Provjeri da li se kartice prikazuju
5. Provjeri da li se auto-refresh-uju (wait 5s)
6. Provjeri da li crvene kartice blink-uju

---

## 📦 Deliverables Checklist

### **Backend:**
- [ ] `app.py` - Flask server
- [ ] `api/dashboard.py` - GET endpoint
- [ ] `services/dummy_data.py` - Dummy data generator
- [ ] `requirements.txt`
- [ ] `.env.example`
- [ ] `README.md` sa setup instrukcijama

### **Frontend:**
- [ ] `MachineCard.jsx` komponenta
- [ ] `MachineGrid.jsx` komponenta
- [ ] `StatusBar.jsx` komponenta
- [ ] `ProductionChart.jsx` komponenta
- [ ] `useDashboardData.js` hook
- [ ] `colorUtils.js` utility
- [ ] `App.css` sa blink animacijom
- [ ] `package.json`
- [ ] `.env.example`
- [ ] `README.md`

---

## 🚀 Deployment Checklist

### **Development Setup:**
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend (novi terminal)
cd frontend
npm install
npm start
```

### **Production Deployment:**
```bash
# Backend (Gunicorn)
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Frontend (build + serve)
npm run build
npx serve -s dist -l 3000
```

### **Kiosk Mode (TV Display):**
```bash
# Windows Chrome
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://192.168.1.100:3000

# Linux
google-chrome --kiosk --app=http://192.168.1.100:3000

# Disable screensaver (Linux)
xset s off
xset -dpms
```

---

**Verzija:** 1.0
**Status:** Ready for implementation
