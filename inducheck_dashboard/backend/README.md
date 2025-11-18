# InduCheck Dashboard - Backend API

Flask-based REST API server for real-time industrial machine monitoring.

## 📋 Features

- **REST API Endpoint**: `GET /api/dashboard/live`
- **Dummy Data Generator**: Simulates 50 industrial machines
- **CORS Enabled**: Configured for React frontend
- **Auto-refresh Support**: Optimized for 5-second polling
- **Status Calculation**: Automatic machine status determination

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip
- virtualenv (recommended)

### Installation

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create a `.env` file (or copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env`:

```env
FLASK_ENV=development
HOST=0.0.0.0
PORT=5000
CORS_ORIGINS=http://localhost:3000
```

### Run Server

```bash
# Activate virtual environment first!
source venv/bin/activate

# Start Flask server
python app.py
```

Server will start on: **http://localhost:5000**

## 📡 API Documentation

### GET /api/dashboard/live

Returns real-time status of all machines.

**Response:**

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
    // ... 49 more machines
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
    // ... 5 more hours
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

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy",
  "service": "InduCheck Dashboard API"
}
```

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test dashboard endpoint
curl http://localhost:5000/api/dashboard/live | python -m json.tool
```

## 📁 Project Structure

```
backend/
├── app.py                 # Main Flask application
├── config.py              # Configuration loader
├── api/
│   ├── __init__.py
│   └── dashboard.py       # Dashboard endpoints
├── services/
│   ├── __init__.py
│   └── dummy_data.py      # Dummy data generator
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🔧 Development

### Adding New Endpoints

1. Create new blueprint in `api/`
2. Register in `app.py`
3. Update documentation

### Connecting to PostgreSQL

Replace dummy data generator with database queries:

```python
# In api/dashboard.py
from models.machine import Machine

machines = Machine.query.all()
```

## 🐛 Troubleshooting

**CORS Error:**

- Check `CORS_ORIGINS` in `.env`
- Make sure frontend URL is whitelisted

**Port Already in Use:**

```bash
# Change PORT in .env
PORT=5001
```

**Module Not Found:**

```bash
# Make sure virtual environment is activated
source venv/bin/activate
pip install -r requirements.txt
```

## 📝 License

MIT License - InduCheck Team
