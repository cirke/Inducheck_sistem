# UI Design Specification - InduCheck Dashboard

## 🎨 Visual Design System

### **Color Palette**

#### Status Colors
```css
--color-running: #22c55e;   /* Zelena */
--color-stopped: #ef4444;   /* Crvena */
--color-warning: #f59e0b;   /* Žuta */
--color-offline: #9ca3af;   /* Siva */

--color-bg-running: #f0fdf4;   /* Light green */
--color-bg-stopped: #fef2f2;   /* Light red */
--color-bg-warning: #fffbeb;   /* Light yellow */
--color-bg-offline: #f9fafb;   /* Light gray */
```

#### UI Colors
```css
--color-background: #ffffff;
--color-text-primary: #1f2937;
--color-text-secondary: #6b7280;
--color-border: #e5e7eb;
--color-shadow: rgba(0, 0, 0, 0.1);
```

### **Typography**

```css
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-size-base: 0.9rem;    /* Machine card text */
--font-size-large: 1.2rem;   /* Machine ID */
--font-size-xlarge: 1.8rem;  /* Status bar */
--font-weight-normal: 400;
--font-weight-bold: 600;
```

**Zašto Inter font?**
- Odlična čitljivost na ekranu
- Free & open source
- Dobro renderovanje na low-DPI ekranima

---

## 📐 Layout Structure

### **Full Screen Layout (1920×1080)**

```
┌─────────────────────────────────────────────────────────────┐
│  STATUS BAR (height: 80px)                                  │  ← 8vh
│  🟢 48 Running  |  🔴 2 Stopped  |  🟡 3 Warnings           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MACHINE GRID (height: ~650px)                              │  ← 62vh
│                                                              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ... (10 columns)      │
│  │M-01│ │M-02│ │M-03│ │M-04│ │M-05│                        │
│  └────┘ └────┘ └────┘ └────┘ └────┘                        │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                        │
│  │M-11│ │M-12│ │M-13│ │M-14│ │M-15│                        │
│  └────┘ └────┘ └────┘ └────┘ └────┘                        │
│  ... (5 rows total = 50 machines)                           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  PRODUCTION CHART (height: ~300px)                          │  ← 30vh
│  [Chart.js Line Chart]                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Component Specifications

### **1. StatusBar Component**

**File:** `src/components/StatusBar.jsx`

**Props:**
```jsx
<StatusBar summary={{
  total_running: 48,
  total_stopped: 2,
  total_offline: 0,
  total_warning: 3,
  avg_oee: 82.3,
  total_parts_today: 47532
}} />
```

**Visual Design:**
```
┌──────────────────────────────────────────────────────────────┐
│  InduCheck Live Monitoring                Last update: 14:35 │
├──────────────────────────────────────────────────────────────┤
│  🟢 48 Running  │  🔴 2 Stopped  │  🟡 3 Warnings  │  ⚪ 0 Offline
│                                                               │
│  Total Today: 47,532 parts  │  Average OEE: 82.3%           │
└──────────────────────────────────────────────────────────────┘
```

**CSS:**
```css
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.status-emoji {
  font-size: 1.5rem;
}
```

---

### **2. MachineCard Component**

**File:** `src/components/MachineCard.jsx`

**Props:**
```jsx
<MachineCard machine={{
  machine_id: "M-01",
  status: "running",
  product_id: "PROD-A",
  count_today: 1247,
  cycle_time_s: 4.2,
  oee: 87,
  downtime_minutes: 0
}} />
```

**Visual States:**

#### Running (Zelena)
```
┌──────────────────┐
│ 🟢 M-01         │  ← Green border-left (6px)
│ ──────────────── │
│ Prod: PROD-A    │
│ Count: 1,247    │  ← Formatted number
│ ⚡ 4.2s         │  ← Cycle time
│ OEE: 87%        │  ← Green text if >85%
└──────────────────┘
```

#### Stopped (Crvena - BLINKA!)
```
┌──────────────────┐
│ 🔴 M-03         │  ← Red border, BLINK animation
│ ──────────────── │
│ Prod: PROD-A    │
│ Count: 534      │
│ ⏸️ ZASTOJ 47min│  ← Downtime duration
│ OEE: 45%        │  ← Red text
└──────────────────┘
```

#### Warning (Žuta)
```
┌──────────────────┐
│ 🟡 M-04         │  ← Yellow border
│ ──────────────── │
│ Prod: PROD-C    │
│ Count: 654      │
│ ⚠️ SLOW 7.3s   │  ← Slower than target
│ OEE: 67%        │  ← Yellow/orange text
└──────────────────┘
```

#### Offline (Siva)
```
┌──────────────────┐
│ ⚪ M-15         │  ← Gray border, 70% opacity
│ ──────────────── │
│ OFFLINE         │
│ No data         │
│ since 13:22     │
│                 │
└──────────────────┘
```

**CSS:**
```css
.machine-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  border-left: 6px solid;
  box-shadow: 0 2px 4px var(--color-shadow);
  transition: all 0.3s ease;
  font-size: 0.85rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.machine-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Status-specific styling */
.machine-card.running {
  border-color: var(--color-running);
  background: var(--color-bg-running);
}

.machine-card.stopped {
  border-color: var(--color-stopped);
  background: var(--color-bg-stopped);
  animation: blink-fast 500ms infinite;
}

.machine-card.warning {
  border-color: var(--color-warning);
  background: var(--color-bg-warning);
}

.machine-card.offline {
  border-color: var(--color-offline);
  background: var(--color-bg-offline);
  opacity: 0.7;
}

/* Blink animation */
@keyframes blink-fast {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Card header */
.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-emoji {
  font-size: 1.5rem;
}

.machine-id {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

/* Card body */
.card-body {
  flex: 1;
}

.card-body p {
  margin: 4px 0;
  color: var(--color-text-secondary);
}

.count {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

/* OEE badge */
.oee-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8rem;
}

.oee-badge.good {
  background: #dcfce7;
  color: #166534;
}

.oee-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.oee-badge.poor {
  background: #fee2e2;
  color: #991b1b;
}
```

---

### **3. MachineGrid Component**

**File:** `src/components/MachineGrid.jsx`

**Props:**
```jsx
<MachineGrid machines={[...50 machine objects]} />
```

**Layout:**
```css
.machine-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);  /* 10 columns */
  grid-template-rows: repeat(5, 1fr);     /* 5 rows */
  gap: 15px;
  padding: 20px;
  height: 62vh;
  overflow: hidden;  /* Prevent scrolling on TV */
}

/* Responsive adjustments */
@media (max-width: 1600px) {
  .machine-grid {
    grid-template-columns: repeat(8, 1fr);  /* 8 columns */
    grid-template-rows: auto;                /* Auto rows */
  }
}

@media (min-width: 3840px) {
  /* 4K support */
  .machine-card {
    font-size: 1.4rem;
    padding: 20px;
  }
}
```

---

### **4. ProductionChart Component**

**File:** `src/components/ProductionChart.jsx`

**Props:**
```jsx
<ProductionChart trend={[
  { hour: "09:00", count: 4523 },
  { hour: "10:00", count: 5234 },
  ...
]} />
```

**Chart.js Configuration:**
```javascript
const chartConfig = {
  type: 'line',
  data: {
    labels: trend.map(t => t.hour),
    datasets: [{
      label: 'Parts Produced',
      data: trend.map(t => t.count),
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: { size: 16 },
          color: '#1f2937'
        }
      },
      title: {
        display: true,
        text: '📊 Production Trend (Last 6 Hours)',
        font: { size: 20, weight: 'bold' },
        color: '#1f2937'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 14 },
          color: '#6b7280'
        },
        grid: {
          color: '#e5e7eb'
        }
      },
      x: {
        ticks: {
          font: { size: 14 },
          color: '#6b7280'
        },
        grid: {
          display: false
        }
      }
    }
  }
};
```

**CSS:**
```css
.production-chart-container {
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 28vh;
}

.chart-wrapper {
  height: calc(100% - 40px);
}
```

---

## 🎭 Animations & Interactions

### **Blink Animation (Stopped Status)**
```css
@keyframes blink-fast {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 rgba(239, 68, 68, 0);
  }
  50% {
    opacity: 0.4;
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
  }
}

.machine-card.stopped {
  animation: blink-fast 500ms infinite;
}
```

### **Hover Effect**
```css
.machine-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.machine-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 10;
}
```

### **Auto-Refresh Pulse (Optional)**
```css
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.refreshing {
  animation: pulse 1s ease-in-out;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Full HD TV (Primary) */
@media (min-width: 1920px) {
  .machine-grid {
    grid-template-columns: repeat(10, 1fr);
  }
  .machine-card {
    font-size: 0.9rem;
  }
}

/* HD TV / Large Monitor */
@media (min-width: 1280px) and (max-width: 1919px) {
  .machine-grid {
    grid-template-columns: repeat(8, 1fr);
  }
  .machine-card {
    font-size: 0.85rem;
  }
}

/* 4K TV (hvis koristiš) */
@media (min-width: 3840px) {
  .machine-grid {
    grid-template-columns: repeat(10, 1fr);
  }
  .machine-card {
    font-size: 1.6rem;
    padding: 25px;
  }
  .status-bar {
    font-size: 2.2rem;
  }
}
```

---

## 🔤 Number Formatting

```javascript
// utils/formatters.js

export function formatNumber(num) {
  return num.toLocaleString('en-US');
}

// Usage: 1247 → "1,247"

export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}min`;
}

// Usage: 47 → "47min", 127 → "2h 7min"

export function formatCycleTime(seconds) {
  if (seconds === 0) return 'STOP';
  return `${seconds.toFixed(1)}s`;
}

// Usage: 4.234 → "4.2s"
```

---

## 🖼️ Icons & Emojis

**Status Emojis:**
```javascript
const STATUS_EMOJIS = {
  running: '🟢',
  stopped: '🔴',
  warning: '🟡',
  offline: '⚪'
};
```

**Icon Usage:**
- ⚡ - Cycle time (brzo)
- ⏸️ - Zastoj/pauza
- ⚠️ - Warning/upozorenje
- 📊 - Chart/statistika
- 🏭 - Factory/proizvodnja

---

## 🎨 Complete CSS File Structure

```css
/* src/index.css */

/* CSS Variables */
:root {
  /* Colors */
  --color-running: #22c55e;
  --color-stopped: #ef4444;
  --color-warning: #f59e0b;
  --color-offline: #9ca3af;

  --color-bg-running: #f0fdf4;
  --color-bg-stopped: #fef2f2;
  --color-bg-warning: #fffbeb;
  --color-bg-offline: #f9fafb;

  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 0.9rem;
}

/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background: #f3f4f6;
  color: #1f2937;
  overflow: hidden;  /* No scroll on TV */
}

/* App Container */
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

/* Component imports */
@import './components/StatusBar.css';
@import './components/MachineCard.css';
@import './components/MachineGrid.css';
@import './components/ProductionChart.css';
```

---

## 📸 Visual Mockup Checklist

Kada dashboard bude ready, provjer sljedeće:

- [ ] **Čitljivost:** Tekst se vidi sa 3 metra udaljenosti
- [ ] **Color contrast:** Boje su dovoljno različite (особito za color-blind osobe)
- [ ] **Blink nije previše agresivan:** 500ms je OK, brže bi bilo iritantno
- [ ] **Grid fit:** Svih 50 kartica stane na ekran bez scroll-a
- [ ] **Font size:** Nije premali ni preveliki
- [ ] **Chart visibility:** Graf je razumljiv sa distance

---

**Verzija:** 1.0
**Status:** Ready for implementation
