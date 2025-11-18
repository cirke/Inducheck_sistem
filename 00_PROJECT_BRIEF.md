# InduCheck Live Dashboard - Project Brief

## 📋 Šta Radimo?

Razvijamo **Live Monitoring Dashboard** - real-time web aplikaciju za praćenje 50 industrijskih mašina na TV ekranu.

---

## 🎯 Zašto?

**Problem:**
- Postoji 50 proizvodnih mašina u fabrici
- Svaka mašina ima ESP32 uređaj koji prikuplja podatke (broj proizvoda, cycle time, zastoji)
- Podaci se šalju na centralni server
- **NEDOSTAJE:** Vizuelni prikaz za managere koji žele vidjeti šta se dešava u realnom vremenu

**Rješenje:**
- Dashboard na TV ekranu u kancelariji/proizvodnoj hali
- Real-time prikaz statusa svih mašina
- Color-coded indikatori (zeleno = radi, crveno = zastoj)
- Instant notifikacije kada nešto ne štima

---

## 🏆 Glavni Cilj

**VIZUALNI MONITORING SISTEM** koji omogućava menadžerima da na prvi pogled vide:
- Koje mašine rade (🟢)
- Koje su stale (🔴)
- Koliko proizvoda je napravljeno danas
- Da li postoje problemi koji zahtijevaju intervenciju

---

## 👥 Ko Koristi Dashboard?

1. **Production Managers** - prate ukupnu produktivnost
2. **Shift Supervisors** - vide koje mašine trebaju pažnju
3. **Maintenance Team** - vide kada dođe do zastoja
4. **Top Management** - imaju "big picture" view produkcije

**Napomena:** Operateri na mašinama NE koriste dashboard - oni rade sa ESP32 uređajem direktno.

---

## 📺 Gdje Se Prikazuje?

**Primary Display:**
- TV ekran (32-55") u kancelariji
- Rezolucija: 1920×1080 (Full HD)
- Radi 24/7 non-stop
- Kiosk mode (full-screen, bez browser chrome-a)

**Secondary Access:**
- Laptop/desktop browser za detaljniji pregled
- Tablet za mobilni pristup (opciono kasnije)

---

## ⚡ Ključne Funkcionalnosti (Must-Have)

### 1. **Grid View - 50 Kartica**
```
┌─────────────────────────────────────────────────┐
│  🟢 M-01   🟢 M-02   🔴 M-03   🟡 M-04  ...     │
│  Prod-A    Prod-B    ZASTOJ!   SLOW             │
│  1,247     892       47min     423              │
│  ⚡ 4.2s   ⚡ 5.1s   ⏸️ STOP   ⚠️ 8.1s          │
└─────────────────────────────────────────────────┘
```

- 10 kolona × 5 redova = 50 mašina
- Svaka kartica prikazuje: Machine ID, Product, Count, Status
- Color coding prema statusu

### 2. **Real-Time Updates**
- Auto-refresh svakih 5-10 sekundi
- Nove detekcije se odmah prikazuju
- Status se automatski ažurira

### 3. **Color-Coded Status**
- 🟢 **Zelena** - Radi normalno (cycle time OK, proizvodi se)
- 🔴 **Crvena** - Zastoj > 5min (BLINKA za upozorenje!)
- 🟡 **Žuta** - Warning (radi sporo, OEE < 75%)
- ⚪ **Siva** - Offline (uređaj nije dostupan)

### 4. **Production Trend Chart**
```
📊 Proizvodnja (zadnjih 6 sati)
│     ╭───╮       ╭───╮
│ ╭───╯   │   ╭───╯   │
│ │       ╰───╯       ╰───
└─┴───┴───┴───┴───┴───┴───
 09  10  11  12  13  14  15
```
- Line chart (Chart.js)
- Prikazuje ukupan broj proizvoda po satu
- Trend za zadnjih 6-24 sata

### 5. **Alert System**
- Visual alert: Crvena kartica BLINKA kada je zastoj
- Audio alert: Beep zvuk kada zastoj > 15min (opciono)
- Browser notification za kritične probleme

### 6. **Summary Bar**
```
🟢 48 Running  |  🔴 2 Stopped  |  🟡 3 Warnings  |  ⚪ 0 Offline
Total Today: 47,532 parts  |  Avg OEE: 82.3%
```

---

## 📦 Šta Treba Isporučiti?

### **Backend API Server**
- Python Flask/FastAPI server
- REST API endpoint: `GET /api/dashboard/live`
- Vraća JSON sa statusom svih 50 mašina
- Query PostgreSQL bazu ili koristi dummy data za testiranje

### **Frontend Web App**
- React 18 aplikacija
- Responsive design za 1920×1080 TV
- Chart.js integration za grafove
- Auto-refresh logika (polling ili WebSocket)
- Blink animacija za crvene kartice

### **Deployment Ready**
- `README.md` sa setup instrukcijama
- `requirements.txt` (Python dependencies)
- `package.json` (React dependencies)
- `.env.example` fajlovi
- Dummy data generator za testiranje

---

## ✅ Success Criteria - Kako Znamo Da Je Gotovo?

Dashboard je **uspješan** ako:

1. ✅ **Vizuelno funkcionalan**
   - Prikazuje 50 kartica u grid layout-u
   - Boje se automatski mijenjaju prema statusu
   - Crvene kartice blink-uju
   - Tekst je čitljiv sa 3 metra udaljenosti (TV ekran)

2. ✅ **Real-time updates**
   - Podaci se refresh-uju svakih 5 sekundi
   - Novi status se odmah prikazuje
   - Chart se automatski ažurira

3. ✅ **Tehničko funkcionalan**
   - Backend server vraća ispravan JSON
   - Frontend uspješno konzumira API
   - Nema error-a u browser console-u
   - Može se pokrenuti sa `npm start` i `python app.py`

4. ✅ **Production ready**
   - Kiosk mode radi (full-screen)
   - Dashboard radi 24/7 bez crash-a
   - Memory leaks su prevenirani (auto-refresh cijele stranice svakih 24h)

---

## 📊 Trenutno Stanje Projekta

**Što već postoji:**
- ✅ ESP32 firmware (prikuplja podatke sa senzora)
- ✅ CSV logging na SD karticu
- ✅ Backend specifikacija (API format je definisan)
- ✅ Kompletna dokumentacija
- ❌ **Backend server nije implementiran** (treba kreirati)
- ❌ **Dashboard frontend nije implementiran** (treba kreirati)

**Što Claude Code treba kreirati:**
- ✅ Backend Flask/FastAPI server
- ✅ Frontend React aplikacija
- ✅ Integration između backend-a i frontend-a
- ✅ Dummy data generator za testiranje

---

## 🔗 Veza Sa Postojećim Sistemom

```
┌─────────────┐
│  ESP32 #1   │───┐
│  ESP32 #2   │───┤
│  ESP32 #3   │───┤
│    ...      │   ├──► [PostgreSQL Database]
│  ESP32 #49  │───┤              │
│  ESP32 #50  │───┘              │
└─────────────┘                  │
                                 ↓
                         [Backend Server]
                         /api/dashboard/live
                                 │
                                 ↓
                         [Dashboard Frontend]
                         prikazano na TV-u
```

**Flow podataka:**
1. ESP32 detektuje proizvod → piše u CSV
2. ESP32 šalje podatke serveru → upisuje u PostgreSQL
3. Backend `/api/dashboard/live` query-uje bazu
4. Frontend fetch-uje podatke svakih 5s
5. Dashboard prikazuje nove podatke na TV-u

---

## 🎨 Design Philosophy

**Prioriteti:**
1. **Čitljivost** - Mora se vidjeti sa 3-5 metara udaljenosti
2. **Jednostavnost** - Nema nepotrebnih informacija, samo essentials
3. **Instant feedback** - Color coding mora biti očigledan
4. **Reliability** - Dashboard mora raditi 24/7 bez crash-a

**Ne treba:**
- ❌ Login sistem (dashboard je read-only, javno dostupan u kancelariji)
- ❌ Edit funkcionalnost (samo prikaz, ne kontrola)
- ❌ Mobile responsiveness (optimizovano samo za TV)
- ❌ Dark mode (TV je u osvijetljenoj hali)

---

## 📅 Timeline Očekivanja

**Development faze:**
1. **Backend MVP** - 1-2 sata (dummy data)
2. **Frontend MVP** - 2-3 sata (grid + color coding)
3. **Chart integration** - 1 sat
4. **Polish & testing** - 1 sat
**Total:** ~5-7 sati za funkcionalan dashboard

**Deployment:**
- Setup na laptop-u: 30 minuta
- Kiosk mode konfiguracija: 15 minuta
- TV povezivanje: 15 minuta

---

## 🚀 Next Steps

Nakon čitanja ovog brief-a, pročitaj sljedeće dokumente:

1. **`01_TECHNICAL_REQUIREMENTS.md`** - Tehnički detalji (stack, dependencies)
2. **`02_API_SPECIFICATION.md`** - Backend API format
3. **`03_UI_DESIGN.md`** - Frontend komponente i layout
4. **`04_SUCCESS_CRITERIA.md`** - Testiranje i validacija
5. **`CLAUDE_CODE_PROMPT.md`** - Finalni prompt za development

---

**Verzija:** 1.0
**Datum:** 18. Novembar 2025
**Autor:** InduCheck Team
**Status:** Ready for development
