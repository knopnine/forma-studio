# Forma (Personal Home Fitness & Calisthenics App)

> **Adaptive Home Workout Companion** engineered with pure Bodyweight, Calisthenics, Dumbbells, Pull-Up Bars, and Improvised Household Tools. Features smart daily routine generation, 1,324 exercise technique guides, live set logging, audio/haptic timers, and bilingual support (English & Bahasa Indonesia).

Designed according to the **Monochromatic Clinical Blueprint** (`DESIGN.md`) with strict 24px/18px radii, `#f5f5f5` canvas, `#ffffff` paper cards, and high-contrast `#0a0a0a` typography.

---

## Key Highlights & Capabilities

- **1,324 Indexed Movements**: Sourced directly from [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) with full muscle target breakdowns, secondary muscles, and animated technique visualizers.
- **Smart Dynamic Routine Generator**:
  - Daily adaptive generator based on **Energy Level** (*High / Moderate / Recovery*), **Duration** (*15 / 30 / 45 / 60 mins*), and **Muscle Focus** (*Full Body, Push, Pull, Legs, Core, Cardio*).
  - Reroll individual exercises or adjust parameters on the fly.
- **Strict Auxiliary Gear Detection & Home Improvisation**:
  - Automatically identifies primary and secondary tools (e.g. *Stability Ball*, *Bench*, *Pull-Up Bar*, *Dip Station*).
  - Guarantees you are **never** prescribed exercises requiring tools you do not own.
  - Map everyday household items (chairs for dips, backpacks for weights, towels for floor sliders).
- **Live Workout Tracker & Floating Rest Timer**:
  - Set-by-set target vs. completed rep/weight logger.
  - Floating auto-countdown rest timer with 3-2-1 audio cues and fanfare completion.
- **Bilingual Experience (English & Bahasa Indonesia)**:
  - Instant one-click language toggle across the entire application interface.
  - Multi-pass natural translation engine for exercise technique steps.
- **Ready for Mobile Conversion (Capacitor Android)**:
  - Pre-configured with `@capacitor/core`, `@capacitor/android`, and responsive mobile viewport dock.

---

## Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript + Vite 6 |
| **Styling** | Tailwind CSS v4 (Design System Tokens in `index.css`) |
| **Icons** | Custom SVG Vector Icons (`src/components/Icons.tsx`) |
| **Audio & Haptics** | Web Audio API Synthesizer (`hapticAudioAdapter.ts`) |
| **Celebrations** | `canvas-confetti` |
| **Storage** | `localStorage` with clean JSON Export/Import backup |
| **Mobile Runtime** | Capacitor 7 (Android Bridge) |

---

## Quick Start & Local Development

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm**

### 2. Installation
```bash
cd "Personal Fitness App"
npm install
```

### 3. Running Development Server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### 4. Production Build
```bash
npm run build
npm run preview
```

---

## General User Guide (Panduan Pengguna)

### 1. Equipment & Household Setup (Peralatan)
- Navigate to the **Gear (Peralatan)** tab.
- Toggle the standard equipment you own (*Bodyweight, Dumbbells, Pull-Up Bar, Resistance Bands, Stability Ball, Benches*).
- **Add Improvised Household Tools**: Click **+ Add Custom Tool** to register everyday items (*Sturdy Dining Chair* for dips, *Loaded Backpack* for weighted squats, *Towel* for floor sliders).
- *The routine generator strictly uses only enabled equipment.*

### 2. Generating Daily Workouts (Rencana Harian)
- Click **Quick Start** or **Daily Plan**.
- Choose your **Energy Level**:
  - **Full Tank (High)**: Full volume, progressive load.
  - **Moderate (Standard)**: Balanced volume and working sets.
  - **Low (Recovery)**: Reduced sets, joint-friendly tempo and mobility.
- Select your target **Duration** (`15`, `30`, `45`, or `60` mins) and **Muscle Focus** (*Full Body, Push, Pull, Legs, Core, Cardio*).
- Click **Generate Workout Plan**. Inspect movements or **Reroll** as desired, then click **Start Active Workout**.

### 3. Active Session Tracking & Rest Timer (Pelacak Sesi)
- Record your completed reps and weight for each set.
- Check off sets with the **Done** checkmark to trigger sound cues and start the **Floating Rest Timer**.
- **In-Session Movement Swap**: Click the circular swap icon on any exercise card to replace a movement on the fly with a compatible alternative.
- Use the **Rest Timer** controls to pause, add +30s, or skip. Acoustic 3-2-1 cues prepare you for the next set.
- Click **Finish Workout** when done to save your history and celebrate with milestone fanfare!

### 4. Performance Analytics & Local Backups (Statistik & Cadangan)
- View total tonnage lifted, total reps, and your **28-Day Consistency Heatmap** in the **Analytics** tab.
- Automatically records Personal Records (PRs) for highest weight and reps.
- Use **Export JSON Backup** to download your private offline data, and **Import JSON Backup** to restore anytime.

### 5. App-Wide Language Switcher (Pilihan Bahasa)
- Click the **🇬🇧 EN / 🇮🇩 ID** button in the top navigation bar at any time to switch the entire application interface and exercise instructions.

---

## Converting to Android Mobile App (Capacitor)

1. **Build Web Production Assets**:
   ```bash
   npm run build
   ```

2. **Sync with Android Studio**:
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio & Build APK**:
   ```bash
   npx cap open android
   ```
   In Android Studio, click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## Acknowledgements & Credits

- **Exercise Dataset & Visual Media**: Based on the comprehensive open-source exercise library by **Hasan Yıldırım** ([`hasaneyldrm/exercises-dataset`](https://github.com/hasaneyldrm/exercises-dataset)).
- **Icons**: [Lucide React](https://lucide.dev)
- **UI Architecture**: Clinical Monochromatic Design System

---

## License

MIT License. Exercise media and data licensed under original dataset repository terms.