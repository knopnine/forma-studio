# Technical Documentation: Forma Architecture

This document provides a comprehensive technical overview of the architecture, algorithms, domain models, and design decisions behind **Forma**.

---

## System Architecture Overview

Forma uses a **Clean Domain Architecture** separating pure business logic, user interface components, and hardware/storage adapters.

```
+-------------------------------------------------------------+
|                       React 19 UI Layer                     |
|  (Navigation, HomeDashboard, DailyWizard, ActiveTracker)   |
+------------------------------+------------------------------+
                               |
+------------------------------v------------------------------+
|                    FitnessContext & State                    |
|    (Profile, Equipment, Active Workout, PRs, Floating Timer) |
+--------------+-------------------------------+--------------+
               |                               |
+--------------v--------------+ +--------------v--------------+
|     Core Domain Engine      | |      Platform Adapters      |
|  - Dataset & Search Engine  | |  - Web Audio Synthesizer    |
|  - Strict Equipment Rules   | |  - Storage Service          |
|  - Plan & Overload Formula  | |  - Capacitor Native Bridge  |
|  - Universal I18n Engine    | |                             |
+-----------------------------+ +-----------------------------+
```

---

## 1. Domain Models (`src/core/types.ts`)

- **`EquipmentConfig`**:
  - Free Weights & Calisthenics: `hasBodyweight`, `hasDumbbells`, `hasBarbell`, `hasKettlebell`, `hasPullUpBar`, `hasDipStation`, `hasResistanceBands`.
  - Elevation & Core: `hasBench`, `hasBoxOrChair`, `hasStabilityBall`, `hasBosuBall`, `hasMedicineBall`, `hasAbWheel`, `hasFoamRoller`, `hasJumpRope`.
  - Gym Machines: `hasCableMachine`, `hasSmithMachine`, `hasLeverageMachine`.
  - Improvised: `dumbbellWeightsKg: number[]`, `improvisedTools: ImprovisedTool[]`.
- **`ImprovisedTool`**: Everyday objects mapped to standard equipment types (`mapsToStandard: StandardEquipmentType[]`).
- **`EnrichedExercise`**: Extends raw dataset entries with calculated `difficulty`, `equipmentCategory`, and `isCalisthenicSkill`.
- **`WorkoutPlan`**: Structure containing target muscle focus, estimated duration, energy level, and an ordered list of `PlannedExercise` items with role designations (`warmup`, `compound_primary`, `accessory`, `burnout_finisher`).

---

## 2. Multi-Gear & Auxiliary Equipment Detection Algorithm (`src/core/equipmentRules.ts`)

### Problem
Raw exercise datasets frequently store only a single primary tool tag (e.g. `"dumbbell"`), omitting secondary tools mentioned in exercise titles (such as *"Dumbbell Preacher Curl Over Exercise Ball"* or *"Bench Pull-Ups"*).

### Solution
`getExerciseRequiredEquipment(exercise)` implements semantic compound extraction:
1. **Primary Tag Normalization**: Maps raw strings (`body weight`, `dumbbell`, `barbell`, `cable`, etc.) to `StandardEquipmentType`.
2. **Semantic Title & Step Parsing**:
   - Searches for `stability ball`, `exercise ball`, `swiss ball` -> `stability_ball`.
   - Searches for `bench`, `incline`, `decline`, `preacher` -> `bench`.
   - Searches for `pull-up`, `chin-up`, `muscle-up`, `hanging` -> `pull_up_bar`.
   - Searches for `parallel bar`, `chest dip`, `dip station` -> `dip_station`.
   - Searches for `bosu`, `medicine ball`, `wheel roller`, `foam roll`, etc.
3. **Strict Evaluation**: `isExerciseCompatibleWithEquipment(exercise, config)` returns `true` **only** if every single item in the required set is satisfied by the user's active gear.

---

## 3. Intelligent Plan Generator (`src/core/planGenerator.ts`)

1. **Muscle Target Mapping**: Maps user-selected focus (`full_body`, `push`, `pull`, `legs`, `core`, `cardio_hiit`) to anatomical categories (`chest`, `back`, `upper legs`, etc.) and prime movers (`pectorals`, `lats`, `quads`, `delts`, `abs`).
2. **Strict Pool Filtering**: Filters all 1,324 exercises against the user's equipment and experience level.
3. **Target Diversity**: Ensures distinct muscle targets within the workout to prevent redundant fatigue.
4. **Role Assignment & Progressive Overload**:
   - **Set 1**: Warmup / mobility preparation.
   - **Sets 2-3**: Compound primary movements.
   - **Sets 4-5**: Accessory isolation movements.
   - **Final Set**: High-rep burnout finisher (if energy level is standard/high).

---

## 4. Multi-Pass Bilingual Translation Engine (`src/core/indonesianTranslations.ts` & `src/core/i18n.ts`)

To provide a natural Indonesian translation without API latency or network dependencies, a 2-pass deterministic translation engine was built:
- **Pass 1 (Sentence-Level Semantic Regex)**: Matches full English coaching phrases and transforms them into standard Indonesian exercise cues.
- **Pass 2 (Token & Clause Substitution)**: Translates body parts, action verbs, equipment terms, tempo modifiers, and breathing patterns.

---

## 5. Visualizer & UI Rendering

- **Seamless GIF Canvas**: Animated exercise GIFs with `#ffffff` backgrounds are rendered in pure `#ffffff` containers (`ExerciseVisualizer.tsx`), eliminating gray box borders.
- **Portal Modals**: Dialogs and popups use `createPortal(..., document.body)` with pure opacity fade-in, avoiding CSS transform block clipping traps.
- **Hardware Synthesizer**: Rest timer beeps and completion fanfares are generated directly using the browser's `AudioContext` without external MP3 asset downloads.

---

## 6. Testing & Quality Assurance

Automated test scripts in `scratch/` verify the engine:
- `test_strict_equipment.cjs`: Asserts multi-gear extraction on compound exercises.
- `test_kettlebell_isolation.cjs`: Asserts strict isolation between dumbbells and kettlebells.
- `test_dataset_equipment_mapping.cjs`: Asserts all 1,324 movements are correctly indexed into categories (47 pull-up bar movements, 306 bodyweight, 260 dumbbells, 179 barbells, etc.).
- `test_translations_sample.cjs`: Asserts natural Indonesian coaching sentence output.