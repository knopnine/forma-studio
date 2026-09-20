# Forma Studio — Manual Test Suite: Same-Device Session & Mobile Mode Persistence

This document provides a structured protocol to verify that an athlete's workout progress, equipment configuration, active training session, and historical analytics persist and synchronize reliably on the **same browser and device without requiring an account or login screen**.

---

## Environment Setup for Testing Mobile Mode

You can test mobile mode directly on a desktop browser using Chrome/Edge DevTools:
1. Open http://localhost:5173 (or your Vercel deployment URL).
2. Press `F12` or `Ctrl + Shift + I` to open DevTools.
3. Press `Ctrl + Shift + M` to toggle **Device Toolbar**.
4. Select a mobile preset: **iPhone 14 Pro** (`393 × 852`) or **Pixel 7** (`412 × 915`).
5. Ensure touch simulation is active (cursor appears as a circle).

---

## Test Cases Matrix

| Test ID | Test Scenario | Critical Target | Expected Result |
|---|---|---|---|
| **TC-01** | Profile & Equipment Configuration Persistence | Same-device storage | Settings and custom household tools survive reload |
| **TC-02** | Active Workout Crash & Reload Recovery (Mobile Mode) | In-progress session | Logged sets survive browser reload / mobile tab suspension |
| **TC-03** | Rest Timer Background Precision (Mobile Mode) | Wall-clock timer | Timer does not freeze or drift when switching apps/tabs |
| **TC-04** | Workout Completion & Analytics Persistence | Storage & Heatmap | Completed workouts and PRs persist across browser restarts |
| **TC-05** | Mobile Viewport Dock & Touch Ergonomics | Mobile Layout & Accessibility | Controls meet $\ge 40\text{px}$ targets without dock overlap |
| **TC-06** | Optional Phase 1 Anonymous Cloud Sync | Supabase RLS | Seamless background sync under anonymous `auth.uid()` |

---

### TC-01: Profile & Equipment Configuration Persistence (No Login)

#### Objective
Verify that standard gear selections, language preference, and custom improvised household tools persist across page reloads on the same browser/device without logging in.

#### Execution Steps
1. Navigate to the **Gear (Peralatan)** tab from the navigation bar or mobile bottom dock.
2. Toggle off **Barbell** and toggle on **Dumbbells**, **Pull-Up Bar**, and **Stability Ball**.
3. Click **+ Add Custom Tool**:
   * Tool Name: `Loaded Backpack`
   * Description: `Books and water bottles`
   * Estimated Load: `12` kg
   * Click **Save Tool**.
4. Switch language by clicking the **🇬🇧 EN / 🇮🇩 ID** button in the header.
5. **Simulate Browser Restart**: Hard-refresh the page (`Ctrl + F5` or close and reopen the tab).
6. Return to the **Gear** tab.

#### Acceptance Criteria
* [x] The language remains in the selected mode (Indonesian or English).
* [x] Dumbbells, Pull-Up Bar, and Stability Ball remain toggled ON; Barbell remains OFF.
* [x] The custom `Loaded Backpack (12 kg)` tool is still present and enabled in the Improvised Tools list.
* [x] In DevTools > Application > Local Storage, `forma_user_profile_v1` contains the exact updated JSON.

---

### TC-02: Active Workout Crash & Reload Recovery (Mobile Mode)

#### Objective
Verify that if a mobile user accidentally refreshes the browser, closes the tab, or the mobile OS briefly unloads the browser tab from memory mid-workout, completed sets and timer progress are completely preserved.

#### Execution Steps
1. Set DevTools to **Mobile Mode** (`Pixel 7` or `iPhone 14`).
2. Navigate to **Daily Plan (Rencana Harian)**.
3. Select **High Intensity (⚡)**, **30 Mins**, **Push Focus**, and click **Generate Workout Plan**.
4. Click **Start Active Workout**.
5. On the first exercise:
   * Record `12` reps and `15` kg.
   * Tap the **Done (✓)** checkmark to complete Set 1.
   * Verify the floating rest timer appears at the bottom.
6. On the second exercise:
   * Type `10` reps and `20` kg for Set 1 (do not complete yet).
7. **Simulate Tab Crash / Mobile Suspension**:
   * Refresh the page (`F5` or reload button) while the active workout is underway.
8. Inspect the screen after reload.

#### Acceptance Criteria
* [x] The application immediately restores the active workout session.
* [x] Exercise 1, Set 1 remains checked as **Completed** with `12 reps` and `15 kg`.
* [x] Exercise 2, Set 1 preserves the typed values (`10 reps` and `20 kg`).
* [x] The active session is tracked in `localStorage` under `forma_active_workout_session_v1`.

---

### TC-03: Rest Timer Background Precision (Mobile Mode)

#### Objective
Verify that the floating rest timer does not pause, throttle, or drift when the mobile screen locks or when the athlete switches to another browser tab (e.g. to change music).

#### Execution Steps
1. In an active session, complete a set to trigger the 60-second floating rest timer.
2. Note the remaining time (e.g., `0:52`).
3. **Simulate Backgrounding**:
   * Switch to a different browser tab or minimize the browser window for exactly **20 seconds**.
4. Switch back to the Forma Studio tab.

#### Acceptance Criteria
* [x] The rest timer displays approximately `0:32` (or the exact wall-clock elapsed time).
* [x] The timer did **not** pause or freeze at `0:52`.
* [x] If the timer expires while backgrounded, returning to the tab shows the completed state with victory audio/vibration rather than being stuck mid-countdown.

---

### TC-04: Workout Completion & Analytics Persistence (No Login)

#### Objective
Verify that finishing a workout permanently logs the session into the local analytics database, updates the 28-day consistency heatmap, updates personal records, and persists across full browser restarts.

#### Execution Steps
1. In the active session from TC-02, mark all remaining sets as completed.
2. Enter optional notes: `Felt strong on weighted dips`.
3. Click **Finish Workout**.
4. Verify the victory fanfare sound and confetti animation play.
5. You should automatically be navigated to the **Analytics (Statistik)** view.
6. Verify:
   * The **28-Day Consistency Heatmap** highlights today's date with a flame icon.
   * **Total Tonnage Lifted** and **Total Repetitions** reflect the completed workout numbers.
   * The **Personal Records (PRs)** section displays new milestones for the logged exercises.
7. Close the browser entirely, open a new browser window, and navigate back to http://localhost:5173.
8. Click **Analytics**.

#### Acceptance Criteria
* [x] All stats, heatmap activity, and PR milestones remain completely intact.
* [x] The active workout state in `forma_active_workout_session_v1` was automatically cleared so a new session can be started.
* [x] In DevTools > Application > Local Storage, `forma_workout_history_v1` contains the newly completed log entry.

---

### TC-05: Mobile Viewport Dock & Touch Ergonomics

#### Objective
Verify that in mobile viewports (`360px` to `430px`), navigation, modals, and the floating rest timer operate smoothly without visual clipping or touch obstruction.

#### Execution Steps
1. In Mobile Mode (`390 × 844`), navigate across all views:
   * **Home**, **Daily Plan**, **Weekly Splits**, **Movement Library**, **Gear**, **Analytics**.
2. Trigger the floating rest timer.
3. Observe the bottom of the screen.
4. Click any exercise card to open the **Exercise Detail Modal**.
5. Tap outside the modal card (on the backdrop) or tap the close icon.

#### Acceptance Criteria
* [x] The mobile bottom dock remains fixed at the bottom with clear icons and labels.
* [x] The floating rest timer sits comfortably above the bottom dock (`bottom-20 md:bottom-6`) without overlapping dock buttons.
* [x] All buttons (set checkmarks, rest timer `+30s`, pause/play, dismiss) have a minimum touch target of $\ge 36\text{px}$ to $44\text{px}$.
* [x] Modals dismiss cleanly when tapping the backdrop or clicking the `X` button.
* [x] No horizontal scrolling occurs on mobile screens.

---

### TC-06: Optional Phase 1 Anonymous Cloud Sync (When Supabase Configured)

#### Objective
Verify that when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided in `.env.local`, the hybrid adapter quietly provisions an anonymous session and mirrors data to Supabase in the background.

#### Execution Steps
1. Create `.env.local` with your valid Supabase project credentials.
2. In the Supabase Dashboard, ensure **Anonymous Sign-In** is enabled under **Authentication > Providers > Anonymous**.
3. Run the schema script from [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor.
4. Start the dev server: `npm run dev`.
5. Open the app, change your athlete name in Gear to `Cloud Athlete`, and complete 1 quick workout.
6. Open your Supabase Dashboard > Table Editor > `workout_logs` and `user_profiles`.

#### Acceptance Criteria
* [x] An anonymous user record appears in Supabase **Authentication > Users** with provider `anonymous`.
* [x] The `user_profiles` table contains a row with `name: "Cloud Athlete"` matching the anonymous `auth.uid()`.
* [x] The `workout_logs` table contains the completed workout with JSON set data.
* [x] The user was **never** prompted with a login or signup screen.
