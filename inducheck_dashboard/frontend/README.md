# InduCheck Dashboard - Frontend

Real-time monitoring dashboard built with React + Vite for displaying 50 industrial machines on a TV screen.

## 📋 Features

- **Real-time Updates**: Auto-refresh every 5 seconds
- **Grid Layout**: 10×5 grid displaying 50 machines
- **Color Coding**: Status-based colors (Green, Red, Yellow, Gray)
- **Blink Animation**: Stopped machines blink for attention
- **Production Chart**: Chart.js trend visualization
- **Summary Bar**: At-a-glance statistics
- **TV Optimized**: Designed for 1920×1080 Full HD displays

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running on port 5000

### Installation

```bash
# Install dependencies
npm install
```

### Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

### Run Development Server

```bash
npm run dev
```

Dashboard will open at: **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Build output will be in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Components

### MachineCard

Displays individual machine status with:

- Machine ID (M-01 to M-50)
- Status emoji (🟢🔴🟡⚪)
- Product ID
- Count today (formatted)
- Cycle time or downtime
- OEE percentage

### MachineGrid

10×5 grid layout containing all 50 machine cards.

### StatusBar

Top summary bar showing:

- Running machines count
- Stopped machines count
- Warning machines count
- Offline machines count
- Total parts today
- Average OEE
- Last update time

### ProductionChart

Chart.js line chart displaying production trend for the last 6 hours.

## 🎭 Styling

### Color Coding

| Status    | Border Color | Background | Emoji |
| --------- | ------------ | ---------- | ----- |
| `running` | #22c55e      | #f0fdf4    | 🟢    |
| `stopped` | #ef4444      | #fef2f2    | 🔴    |
| `warning` | #f59e0b      | #fffbeb    | 🟡    |
| `offline` | #9ca3af      | #f9fafb    | ⚪    |

### Blink Animation

**ONLY** stopped (red) machines blink at 500ms intervals.

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── MachineCard.jsx
│   │   ├── MachineCard.css
│   │   ├── MachineGrid.jsx
│   │   ├── MachineGrid.css
│   │   ├── StatusBar.jsx
│   │   ├── StatusBar.css
│   │   ├── ProductionChart.jsx
│   │   └── ProductionChart.css
│   ├── hooks/
│   │   └── useDashboardData.js
│   ├── utils/
│   │   ├── colorUtils.js
│   │   └── formatters.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## 🖥️ TV Display Setup

### Kiosk Mode (Chrome)

**Windows:**

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:3000
```

**Linux:**

```bash
google-chrome --kiosk --app=http://192.168.1.100:3000
```

**Mac:**

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --app=http://localhost:3000
```

### Disable Screensaver (Linux)

```bash
xset s off
xset -dpms
```

## 🔧 Development

### Changing API URL

Edit `.env`:

```env
VITE_API_URL=http://192.168.1.100:5000
```

### Adjusting Auto-Refresh Interval

Edit `src/hooks/useDashboardData.js`:

```javascript
const REFRESH_INTERVAL = 10000; // Change to 10 seconds
```

### Grid Layout Customization

Edit `src/components/MachineGrid.css`:

```css
.machine-grid {
  grid-template-columns: repeat(8, 1fr); /* Change to 8 columns */
}
```

## 🐛 Troubleshooting

**Dashboard doesn't load:**

- Check backend is running: `curl http://localhost:5000/health`
- Check `VITE_API_URL` in `.env`
- Check browser console (F12) for errors

**CORS Error:**

- Backend must have `CORS_ORIGINS` configured
- Check backend logs for CORS errors

**Blinking too fast/slow:**

- Edit `src/components/MachineCard.css`
- Change `blink-fast` animation duration (currently 500ms)

**Cards not fitting on screen:**

- Adjust gap in `MachineGrid.css`
- Reduce font sizes in component CSS files

## 📝 License

MIT License - InduCheck Team
