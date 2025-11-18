# 🏭 InduCheck Live Dashboard

Real-time industrial monitoring dashboard for tracking 50 production machines on a TV screen.

## 📖 Overview

InduCheck is a live monitoring system that displays the real-time status of 50 industrial machines in a factory. The dashboard shows:

- **Machine Status**: Visual color-coded cards (Green=Running, Red=Stopped, Yellow=Warning, Gray=Offline)
- **Production Metrics**: Count today, cycle time, OEE percentage
- **Trend Analysis**: Production chart showing last 6 hours
- **Alert System**: Blinking animations for stopped machines

## 🎯 Key Features

✅ **Real-time Updates** - Auto-refresh every 5 seconds
✅ **50 Machine Grid** - 10 columns × 5 rows layout
✅ **Color-Coded Status** - Instant visual feedback
✅ **Blink Alerts** - Stopped machines blink red
✅ **Production Chart** - Chart.js trend visualization
✅ **TV Optimized** - Designed for 1920×1080 displays
✅ **No Database Required** - Works with dummy data for testing

## 🛠️ Technology Stack

**Backend:**

- Python 3.8+
- Flask 3.0
- Flask-CORS

**Frontend:**

- React 18
- Vite 5
- Chart.js 4

## 🚀 Quick Start

### 1. Clone Repository

```bash
cd inducheck_dashboard
```

### 2. Start Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
```

Backend will start at: **http://localhost:5000**

### 3. Start Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start at: **http://localhost:3000**

### 4. Open Dashboard

Open browser and navigate to: **http://localhost:3000**

You should see 50 machine cards with color-coded statuses!

## 📊 API Endpoints

**Backend API:**

- `GET /api/dashboard/live` - Returns all machine data
- `GET /health` - Health check

**Example Request:**

```bash
curl http://localhost:5000/api/dashboard/live | python -m json.tool
```

## 🎨 Visual Design

### Status Colors

| Status    | Color           | Background  | Animation |
| --------- | --------------- | ----------- | --------- |
| Running   | 🟢 Green        | Light green | None      |
| Stopped   | 🔴 Red          | Light red   | **BLINK** |
| Warning   | 🟡 Yellow       | Light yellow| None      |
| Offline   | ⚪ Gray         | Light gray  | None      |

### Layout Structure

```
┌────────────────────────────────────────────────┐
│  STATUS BAR (Summary)                          │
├────────────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ... (10 columns)        │
│  │M-01│ │M-02│ │M-03│                          │
│  └────┘ └────┘ └────┘                          │
│  ┌────┐ ┌────┐ ┌────┐                          │
│  │M-11│ │M-12│ │M-13│                          │
│  └────┘ └────┘ └────┘                          │
│  ... (5 rows total = 50 machines)              │
├────────────────────────────────────────────────┤
│  PRODUCTION CHART (Last 6 hours)               │
└────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
inducheck_dashboard/
│
├── backend/                    # Python Flask API
│   ├── app.py                 # Main server
│   ├── config.py              # Configuration
│   ├── api/
│   │   └── dashboard.py       # API endpoints
│   ├── services/
│   │   └── dummy_data.py      # Data generator
│   ├── requirements.txt
│   └── README.md
│
├── frontend/                   # React dashboard
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
└── README.md                   # This file
```

## 🖥️ TV Display Setup

### Full-Screen Mode (Chrome Kiosk)

**Windows:**

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:3000
```

**Linux:**

```bash
google-chrome --kiosk --app=http://192.168.1.100:3000
```

### Auto-Start on Boot (Linux)

Create systemd service:

```bash
sudo nano /etc/systemd/system/inducheck-dashboard.service
```

Add:

```ini
[Unit]
Description=InduCheck Dashboard
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/inducheck_dashboard/frontend
ExecStart=/usr/bin/npm run dev

[Install]
WantedBy=multi-user.target
```

Enable:

```bash
sudo systemctl enable inducheck-dashboard
sudo systemctl start inducheck-dashboard
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
FLASK_ENV=development
HOST=0.0.0.0
PORT=5000
CORS_ORIGINS=http://localhost:3000
```

### Frontend Configuration

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

## 🧪 Testing

### Backend Test

```bash
# Health check
curl http://localhost:5000/health

# Get dashboard data
curl http://localhost:5000/api/dashboard/live | python -m json.tool
```

### Frontend Test

1. Open http://localhost:3000
2. Verify 50 cards appear
3. Check color coding
4. Verify stopped machines blink
5. Wait 5 seconds - verify auto-refresh works

## 📝 Troubleshooting

### Backend Issues

**Port already in use:**

```bash
# Change port in backend/.env
PORT=5001
```

**CORS errors:**

- Add frontend URL to `CORS_ORIGINS` in `.env`

### Frontend Issues

**Cannot connect to backend:**

- Verify backend is running: `curl http://localhost:5000/health`
- Check `VITE_API_URL` in `frontend/.env`

**Blink animation not working:**

- Check browser console (F12) for errors
- Verify CSS is loaded

## 📚 Documentation

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Specification](../02_API_SPECIFICATION.md)
- [UI Design](../03_UI_DESIGN.md)

## 🤝 Contributing

1. Read project documentation
2. Create feature branch
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License - InduCheck Team

## 🎉 Success Criteria

Dashboard is production-ready when:

- ✅ 50 machines display in 10×5 grid
- ✅ Color coding works correctly
- ✅ Stopped machines blink
- ✅ Auto-refresh works every 5 seconds
- ✅ Production chart displays
- ✅ No console errors
- ✅ Readable from 3 meters on TV

## 📞 Support

For issues or questions, check:

- Backend logs in terminal
- Frontend browser console (F12)
- README files in backend/ and frontend/

---

**Version:** 1.0
**Date:** November 18, 2025
**Status:** Production Ready
