# Success Criteria & Testing - InduCheck Dashboard

## ✅ Definition of Done

Dashboard je **uspješno implementiran** kada ispunjava sve sljedeće kriterije:

---

## 🎯 Functional Requirements

### **1. Backend API Functionality**

#### ✅ Endpoint Works
```bash
# Test command
curl http://localhost:5000/api/dashboard/live | jq

# Expected output: JSON sa 50 mašina
```

**Success Criteria:**
- [ ] Endpoint vraća HTTP 200 status
- [ ] JSON response sadrži sve potrebne fields
- [ ] `machines` array ima 50 elemenata
- [ ] `summary` object postoji sa svim metrikama
- [ ] `production_trend` array ima 6 elementa (zadnjih 6 sati)
- [ ] `alerts` array sadrži mašine sa problemima

#### ✅ Status Calculation Logic
- [ ] `running` status se correctly dodjeljuje kada OEE ≥ 75% i last_detection < 5min
- [ ] `stopped` status kada last_detection ≥ 5min
- [ ] `warning` status kada OEE < 75% ali mašina radi
- [ ] `offline` status kada last_detection ≥ 2min

#### ✅ CORS Configuration
- [ ] Frontend može fetch-ovati podatke bez CORS error-a
- [ ] Browser console nema CORS-related warnings

---

### **2. Frontend Visual Functionality**

#### ✅ Grid Layout
- [ ] Prikazuje tačno 50 kartica
- [ ] Layout je 10 kolona × 5 redova
- [ ] Kartice su ravnomjerno raspoređene (gap: 15px)
- [ ] Sve kartice stanu na ekran bez scroll-a

#### ✅ Color Coding
- [ ] Zelene kartice za `status: "running"`
- [ ] Crvene kartice za `status: "stopped"`
- [ ] Žute kartice za `status: "warning"`
- [ ] Sive kartice za `status: "offline"`
- [ ] Border-left boja match-uje status

#### ✅ Blink Animation
- [ ] Crvene kartice (stopped) blink-uju
- [ ] Blink rate je 500ms (2 puta u sekundi)
- [ ] Ostale kartice NE blink-uju
- [ ] Animacija nije previše agresivna

#### ✅ Machine Card Content
- [ ] Machine ID se prikazuje (npr. "M-01")
- [ ] Product ID se prikazuje
- [ ] Count today je formatiran sa zarezom (1,247)
- [ ] Cycle time se prikazuje sa decimalama (4.2s)
- [ ] OEE se prikazuje sa % znakom
- [ ] Status emoji je vidljiv (🟢🔴🟡⚪)

#### ✅ Status Bar
- [ ] Total running count je tačan
- [ ] Total stopped count je tačan
- [ ] Total warning count je tačan
- [ ] Total offline count je tačan
- [ ] Average OEE je kalkuliran correctly
- [ ] Total parts today je suma svih mašina

#### ✅ Production Chart
- [ ] Chart.js line chart se renderuje
- [ ] Prikazuje zadnjih 6 sati podataka
- [ ] X-axis pokazuje vrijeme (HH:MM format)
- [ ] Y-axis pokazuje broj proizvoda
- [ ] Chart legend je vidljiv
- [ ] Chart title je prisutan

---

### **3. Real-Time Updates**

#### ✅ Auto-Refresh Functionality
- [ ] Dashboard se automatski refresh-uje svakih 5 sekundi
- [ ] Nema flickering-a tokom refresh-a
- [ ] Loading state se ne prikazuje nakon initialno load-a (smooth transition)
- [ ] Old data se zamjenjuje sa novom bez "jump"-a

#### ✅ Performance
- [ ] Initial load < 2 sekunde
- [ ] Refresh time < 500ms
- [ ] Nema memory leak-a (testiraj 1 sat continuous running)
- [ ] CPU usage < 10% u idle state

---

## 🖥️ TV Display Requirements

### **Visual Readability**

#### ✅ Font Size & Legibility
**Test:** Stani 3 metra od TV-a

- [ ] Machine ID (npr. "M-01") je čitljiv
- [ ] Count number (npr. "1,247") je čitljiv
- [ ] Status emoji (🟢🔴) je vidljiv
- [ ] Cycle time (npr. "4.2s") je čitljiv

#### ✅ Color Contrast
- [ ] Zelena vs. bijeli background ima dovoljan contrast
- [ ] Crvena kartica se odmah primjećuje
- [ ] Žuta nije previše blago (mora se vidjeti razlika od zelene)
- [ ] Siva offline kartica je jasno izbljeđena

#### ✅ Layout Fit
- [ ] Sve kartice stanu na ekran (1920×1080)
- [ ] Nema horizontal scroll-a
- [ ] Nema vertical scroll-a
- [ ] Chart ispod grid-a je vidljiv

---

## 🧪 Testing Checklist

### **Unit Tests (Optional ali preporučeno)**

**Backend:**
```python
# Test status calculation
def test_status_running():
    machine = {
        'oee': 87,
        'last_detection': datetime.utcnow().isoformat() + 'Z'
    }
    assert calculate_status(machine) == 'running'

def test_status_stopped():
    machine = {
        'oee': 45,
        'last_detection': (datetime.utcnow() - timedelta(minutes=10)).isoformat() + 'Z'
    }
    assert calculate_status(machine) == 'stopped'
```

**Frontend:**
```javascript
// Test color utility
import { getStatusColor } from './utils/colorUtils';

test('returns green for running status', () => {
  expect(getStatusColor('running')).toBe('#22c55e');
});

test('returns red for stopped status', () => {
  expect(getStatusColor('stopped')).toBe('#ef4444');
});
```

---

### **Integration Tests**

#### ✅ Backend ↔ Frontend Integration
1. **Start backend:** `python app.py`
2. **Start frontend:** `npm start`
3. **Open browser:** `http://localhost:3000`
4. **Verify:**
   - [ ] Dashboard loads without errors
   - [ ] Kartice se prikazuju
   - [ ] Data match-uje backend response
   - [ ] Auto-refresh radi (wait 5s, check network tab)

#### ✅ Error Handling
**Test:** Stop backend server dok frontend radi

- [ ] Frontend prikazuje error message
- [ ] Dashboard pokušava retry (ne crash-uje)
- [ ] Kada se backend vrati online, dashboard se recovery-uje

---

### **Browser Compatibility**

Test u sljedećim browser-ima:

- [ ] **Chrome/Edge** (primary) - Latest version
- [ ] **Firefox** - Latest version
- [ ] **Safari** - Latest version (ako koristiš Mac laptop)

**Expected:** Sve radi identično u svakom browser-u.

---

### **TV Display Test**

#### ✅ Setup
1. Konektuj laptop na TV preko HDMI
2. Set resolution na 1920×1080
3. Open Chrome u kiosk mode:
   ```bash
   chrome --kiosk --app=http://localhost:3000
   ```

#### ✅ Visual Inspection
- [ ] Cijeli dashboard stane na ekran (no scroll)
- [ ] Tekst je čitljiv sa 3-5 metara
- [ ] Boje su dovoljno živopisne (vibrant)
- [ ] Blink animacija je vidljiva ali nije iritantna
- [ ] Chart se pravilno renderuje

#### ✅ Long-Running Test
**Run dashboard 24 sata:**
- [ ] Nema crash-a
- [ ] Nema memory leak-a (check Task Manager)
- [ ] Auto-refresh i dalje radi nakon 24h
- [ ] Blink animacija nije "stuck"

---

## 📋 Pre-Deployment Checklist

### **Code Quality**

- [ ] **No console errors** u browser console-u
- [ ] **No warnings** u terminal-u (backend ili frontend)
- [ ] **Dummy data generator works** (ako nema PostgreSQL)
- [ ] **README.md postoji** sa setup instrukcijama
- [ ] **Environment variables documented** (.env.example fajlovi)

### **Documentation**

- [ ] **Setup instrukcije** su jasne i kompletne
- [ ] **Dependencies listed** (requirements.txt, package.json)
- [ ] **API endpoint documented** (u README.md ili komentarima)
- [ ] **Troubleshooting sekcija** u README.md

### **Security**

- [ ] **No hardcoded secrets** u kodu
- [ ] **CORS properly configured** (samo whitelisted origins)
- [ ] **Input validation** na backend-u (prevent injection)

---

## 🎯 Acceptance Test Scenarios

### **Scenario 1: Normal Operation**

**Setup:** Svih 50 mašina radi normalno (status: running)

**Expected:**
- [ ] Sve kartice su zelene
- [ ] Nema blink-ovanja
- [ ] Summary bar pokazuje: 🟢 50 Running
- [ ] Production chart pokazuje steady trend

---

### **Scenario 2: Zastoj na Jednoj Mašini**

**Setup:** M-03 je stopped (downtime: 47min), ostale running

**Expected:**
- [ ] M-03 kartica je crvena i BLINKA
- [ ] Summary bar pokazuje: 🟢 49 Running | 🔴 1 Stopped
- [ ] Alert array sadrži M-03
- [ ] Production chart pokazuje pad u zadnjih sat (ako je M-03 bio produktivan)

---

### **Scenario 3: Multiple Problemi**

**Setup:**
- M-03 stopped (47min)
- M-07 stopped (12min)
- M-11 warning (OEE 67%)
- M-15 offline

**Expected:**
- [ ] 2 crvene kartice (M-03, M-07) - obje blink-uju
- [ ] 1 žuta kartica (M-11)
- [ ] 1 siva kartica (M-15) - opacity 0.7
- [ ] Summary: 🟢 46 | 🔴 2 | 🟡 1 | ⚪ 1
- [ ] Alerts array ima 3 elementa (stopped + warning, ali ne offline)

---

### **Scenario 4: Backend Offline**

**Setup:** Stop backend server

**Expected:**
- [ ] Frontend prikazuje error banner
- [ ] Dashboard pokušava retry svakih 5s
- [ ] Nema crash-a
- [ ] Kada se backend vrati, automatski se recovery-uje

---

## 📊 Performance Benchmarks

### **Backend Response Time**

```bash
# Test sa Apache Bench
ab -n 100 -c 10 http://localhost:5000/api/dashboard/live
```

**Target:**
- [ ] Average response time < 100ms
- [ ] 99th percentile < 200ms
- [ ] No failed requests (0%)

### **Frontend Render Time**

**Target:**
- [ ] Initial render (First Contentful Paint) < 1s
- [ ] Grid render (50 kartice) < 500ms
- [ ] Chart render < 300ms
- [ ] Auto-refresh update < 200ms

### **Memory Usage**

**Target:**
- [ ] Backend: < 100MB RAM
- [ ] Frontend (Chrome tab): < 150MB RAM
- [ ] No memory leak after 24h (max +50MB growth)

---

## ✅ Final Sign-Off

Dashboard je **production-ready** kada:

1. ✅ Svi functional requirements su ispunjeni
2. ✅ Visual readability test passed (3m distance na TV-u)
3. ✅ Auto-refresh radi bez greške 24h
4. ✅ Integration test passed (backend + frontend)
5. ✅ README.md postoji sa jasnim setup instrukcijama
6. ✅ Nema console errors ili warnings
7. ✅ Performance benchmarks su met

---

## 🐛 Known Issues / Future Improvements

_(Claude Code bi trebao napraviti fajl `KNOWN_ISSUES.md` ako postoje ograničenja)_

**Example:**
- ⚠️ Dummy data se generira random - nema perzistencije između refresh-a
- ⚠️ Audio alert nije implementiran (opciona feature)
- ⚠️ WebSocket real-time nije implementiran (koristi HTTP polling)

---

**Verzija:** 1.0
**Status:** Testing framework ready
