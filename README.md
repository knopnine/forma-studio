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