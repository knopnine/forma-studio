export type Language = 'en' | 'id';

export interface Translations {
  nav_overview: string;
  nav_daily_plan: string;
  nav_splits: string;
  nav_library: string;
  nav_gear: string;
  nav_analytics: string;
  nav_quick_start: string;
  nav_resume_session: string;
  nav_tools: string;

  landing_badge: string;
  landing_hero_title: string;
  landing_hero_subtitle: string;
  landing_cta_launch: string;
  landing_cta_library: string;
  landing_feature_section_title: string;
  landing_feature_section_subtitle: string;
  landing_feat1_title: string;
  landing_feat1_desc: string;
  landing_feat2_title: string;
  landing_feat2_desc: string;
  landing_feat3_title: string;
  landing_feat3_desc: string;
  landing_feat4_title: string;
  landing_feat4_desc: string;
  landing_foss_title: string;
  landing_foss_desc: string;
  landing_footer_text: string;

  hero_greeting: string;
  hero_subtitle: string;
  streak_badge: string;
  level_badge: string;
  btn_generate_daily: string;
  btn_weekly_splits: string;
  stat_active_streak: string;
  stat_active_streak_sub: string;
  stat_total_sessions: string;
  stat_total_sessions_sub: string;
  stat_total_volume: string;
  stat_prs_logged: string;
  days: string;
  completed: string;
  tonnes: string;
  section_quick_access: string;
  link_all_programs: string;
  card_smart_daily_badge: string;
  card_smart_daily_title: string;
  card_smart_daily_desc: string;
  card_library_badge: string;
  card_library_title: string;
  card_library_desc: string;
  card_recent_title: string;
  card_recent_view: string;
  workout_in_progress: string;

  wizard_title: string;
  wizard_subtitle: string;
  step_energy: string;
  energy_high: string;
  energy_high_desc: string;
  energy_mod: string;
  energy_mod_desc: string;
  energy_low: string;
  energy_low_desc: string;
  step_duration: string;
  mins: string;
  step_focus: string;
  btn_generate: string;
  plan_prescribed_movements: string;
  btn_reroll: string;
  btn_adjust: string;
  btn_start_active: string;
  sets_times_reps: string;

  focus_full_body: string;
  focus_upper_body: string;
  focus_lower_body: string;
  focus_push: string;
  focus_pull: string;
  focus_legs: string;
  focus_core: string;
  focus_cardio: string;

  gear_title: string;
  gear_subtitle: string;
  gear_desc: string;
  btn_add_custom_tool: string;
  modal_add_tool_title: string;
  tool_name_label: string;
  tool_name_placeholder: string;
  tool_desc_label: string;
  tool_desc_placeholder: string;
  tool_weight_label: string;
  btn_cancel: string;
  btn_save_tool: string;
  section_free_weights: string;
  section_free_weights_desc: string;
  section_benches_balls: string;
  section_benches_balls_desc: string;
  section_machines: string;
  section_machines_desc: string;
  section_improvised: string;
  section_improvised_desc: string;

  live_session: string;
  btn_finish_workout: string;
  btn_cancel_workout: string;
  set_header: string;
  target_header: string;
  actual_reps_header: string;
  weight_header: string;
  status_header: string;
  btn_complete_set: string;
  btn_completed: string;
  workout_notes_placeholder: string;
  btn_swap_exercise: string;
  modal_swap_title: string;
  modal_swap_subtitle: string;
  swap_recommended_title: string;
  swap_all_compatible_title: string;
  btn_replace: string;

  detail_primary_target: string;
  detail_required_gear: string;
  detail_supporting_muscles: string;
  detail_execution_steps: string;
  btn_got_it: string;

  lib_movements_indexed: string;
  lib_title: string;
  lib_search_placeholder: string;
  lib_muscle_groups: string;
  lib_filter_gear: string;
  lib_showing: string;
  lib_clear_filter: string;

  analytics_title: string;
  analytics_subtitle: string;
  analytics_heatmap_title: string;
  analytics_prs_title: string;
  btn_export_backup: string;
  btn_import_backup: string;
  no_history_yet: string;

  rest_interval: string;
  btn_skip: string;
  btn_pause: string;
  btn_resume: string;
}

export const I18N_DICTIONARY: Record<Language, Translations> = {
  en: {
    nav_overview: 'Overview',
    nav_daily_plan: 'Daily Plan',
    nav_splits: 'Splits',
    nav_library: 'Library',
    nav_gear: 'Gear',
    nav_analytics: 'Analytics',
    nav_quick_start: 'Quick Start',
    nav_resume_session: 'Resume Session',
    nav_tools: 'tools',

    landing_badge: '100% Free, Private & Open-Source',
    landing_hero_title: 'Adaptive Home Strength, Engineered for Freedom.',
    landing_hero_subtitle: 'Minimalist calisthenics, free weights, and intelligent daily training. Strictly configured for your bodyweight, dumbbells, pull-up bar, and improvised household tools.',
    landing_cta_launch: 'Launch Forma Studio',
    landing_cta_library: 'Explore 1,324 Movements',
    landing_feature_section_title: 'Clinical Architecture & Features',
    landing_feature_section_subtitle: 'Designed according to pure biomechanics, strict gear isolation, and offline privacy.',
    landing_feat1_title: 'Dynamic Daily Generator',
    landing_feat1_desc: 'Adaptive volume and intensity tailored to your current energy tank (High, Moderate, Recovery) and session duration.',
    landing_feat2_title: 'Strict Auxiliary Gear Engine',
    landing_feat2_desc: 'Compound semantic gear matching ensures you are never prescribed movements requiring equipment you do not own.',
    landing_feat3_title: '1,324 Visual Movement Guides',
    landing_feat3_desc: 'Seamless pure-white GIF visualizers, primary/secondary target breakdowns, and natural step-by-step coaching cues.',
    landing_feat4_title: 'Synthesizer Audio & Rest Timer',
    landing_feat4_desc: 'Floating rest interval countdowns with synthesized 3-2-1 acoustic cues and set completion chimes.',
    landing_foss_title: 'Community-Driven & Open-Source',
    landing_foss_desc: 'Zero subscription paywalls. Zero telemetry tracking. All workout logs and personal records are stored strictly in your browser.',
    landing_footer_text: 'Forma Studio — Free and Open Source Home Strength Engine.',

    hero_greeting: "Ready for today's session",
    hero_subtitle: 'Targeted home training engineered for your bodyweight, dumbbells, and available home tools.',
    streak_badge: 'Day Streak',
    level_badge: 'Level',
    btn_generate_daily: 'Generate Daily Plan',
    btn_weekly_splits: 'Weekly Splits',
    stat_active_streak: 'Active Streak',
    stat_active_streak_sub: 'Consistency score on track',
    stat_total_sessions: 'Total Sessions',
    stat_total_sessions_sub: 'sessions / week target',
    stat_total_volume: 'Total Volume',
    stat_prs_logged: 'Personal Records logged',
    days: 'days',
    completed: 'completed',
    tonnes: 'tonnes',
    section_quick_access: 'Quick Training Access',
    link_all_programs: 'All Programs',
    card_smart_daily_badge: 'Smart Daily',
    card_smart_daily_title: 'Dynamic Daily Generator',
    card_smart_daily_desc: 'Generate a custom 15-60 min routine based on your energy level, target muscles, and available gear.',
    card_library_badge: '1,324 Exercises',
    card_library_title: 'Exercise Technique Library',
    card_library_desc: 'Browse step-by-step video guides, target muscle filters, and calisthenics progressions.',
    card_recent_title: 'Last Completed Session',
    card_recent_view: 'View Log',
    workout_in_progress: 'Workout in Progress',

    wizard_title: 'Daily Training Generator',
    wizard_subtitle: 'Engineered for your energy level, duration, and available home tools.',
    step_energy: '1. Current Energy Level',
    energy_high: 'Full Tank (High)',
    energy_high_desc: 'Full volume, progressive loads, peak output',
    energy_mod: 'Moderate (Standard)',
    energy_mod_desc: 'Balanced volume, solid working sets',
    energy_low: 'Low (Recovery)',
    energy_low_desc: 'Reduced sets, joint-friendly tempo & flow',
    step_duration: '2. Available Duration',
    mins: 'Mins',
    step_focus: '3. Target Muscle Group',
    btn_generate: 'Generate Workout Plan',
    plan_prescribed_movements: 'Prescribed Movements',
    btn_reroll: 'Reroll',
    btn_adjust: 'Adjust',
    btn_start_active: 'Start Active Workout',
    sets_times_reps: 'Sets × Reps',

    focus_full_body: 'Full Body',
    focus_upper_body: 'Upper Body',
    focus_lower_body: 'Lower Body',
    focus_push: 'Chest & Push',
    focus_pull: 'Back & Pull',
    focus_legs: 'Legs & Glutes',
    focus_core: 'Core & Abs',
    focus_cardio: 'Cardio & HIIT',

    gear_title: 'Gear & Household Setup',
    gear_subtitle: 'Available Equipment',
    gear_desc: 'Toggle what you currently have at home. The daily plan algorithm strictly uses only available gear.',
    btn_add_custom_tool: 'Add Custom Tool',
    modal_add_tool_title: 'Add Improvised Home Tool',
    tool_name_label: 'Tool Name',
    tool_name_placeholder: 'e.g. Heavy Water Jug, Dining Chair, Ottoman',
    tool_desc_label: 'Description / Use Case',
    tool_desc_placeholder: 'e.g. Used for loaded rows and curls',
    tool_weight_label: 'Estimated Load / Weight (kg)',
    btn_cancel: 'Cancel',
    btn_save_tool: 'Save Tool',
    section_free_weights: 'Free Weights & Calisthenics',
    section_free_weights_desc: 'Standard home weights, bars, and progressive bodyweight anchors.',
    section_benches_balls: 'Benches, Balls & Core Gear',
    section_benches_balls_desc: 'Support surfaces and instability tools required for specific angle variations.',
    section_machines: 'Gym Machines & Cable Systems',
    section_machines_desc: 'Heavy pulley and gym apparatus (enable if you have a home pulley or gym access).',
    section_improvised: 'Improvised Household Tools',
    section_improvised_desc: 'Everyday objects mapped to gym movements (chairs for dips, backpacks for weights, towels for sliders).',

    live_session: 'Live Session Tracker',
    btn_finish_workout: 'Finish Workout',
    btn_cancel_workout: 'Discard Workout',
    set_header: 'Set',
    target_header: 'Target',
    actual_reps_header: 'Reps Done',
    weight_header: 'Weight (kg)',
    status_header: 'Status',
    btn_complete_set: 'Done',
    btn_completed: 'Done',
    workout_notes_placeholder: 'Add workout reflection or notes...',
    btn_swap_exercise: 'Swap Exercise',
    modal_swap_title: 'Swap Movement',
    modal_swap_subtitle: 'Select an alternative exercise targeting the same muscle group.',
    swap_recommended_title: 'Recommended Alternatives',
    swap_all_compatible_title: 'Search & Pick Any Compatible Movement',
    btn_replace: 'Replace Movement',

    detail_primary_target: 'Primary Target',
    detail_required_gear: 'Required Equipment',
    detail_supporting_muscles: 'Supporting & Synergist Muscles',
    detail_execution_steps: 'Step-by-Step Execution',
    btn_got_it: 'Got It',

    lib_movements_indexed: '1,324 Movements Indexed',
    lib_title: 'Exercise Technique Library',
    lib_search_placeholder: 'Search pull-ups, squats, curls...',
    lib_muscle_groups: 'Muscle Groups',
    lib_filter_gear: 'Filter by Equipment',
    lib_showing: 'Showing',
    lib_clear_filter: 'Clear gear filter',

    analytics_title: 'Performance & Logs',
    analytics_subtitle: 'Tracking your consistency, total volume, and personal milestone records.',
    analytics_heatmap_title: 'Consistency Heatmap (Last 28 Days)',
    analytics_prs_title: 'Personal Milestone Records',
    btn_export_backup: 'Export JSON Backup',
    btn_import_backup: 'Import JSON Backup',
    no_history_yet: 'No workouts recorded yet. Start your first session to unlock performance insights!',

    rest_interval: 'Rest Interval',
    btn_skip: 'Skip',
    btn_pause: 'Pause',
    btn_resume: 'Resume',
  },

  id: {
    nav_overview: 'Ringkasan',
    nav_daily_plan: 'Rencana Harian',
    nav_splits: 'Program Mingguan',
    nav_library: 'Koleksi Gerakan',
    nav_gear: 'Peralatan',
    nav_analytics: 'Statistik',
    nav_quick_start: 'Mulai Cepat',
    nav_resume_session: 'Lanjutkan Sesi',
    nav_tools: 'alat',

    landing_badge: '100% Gratis, Privasi Aman & Open-Source',
    landing_hero_title: 'Kekuatan Tanpa Batas, Dirancang untuk Rumah.',
    landing_hero_subtitle: 'Latihan kalistenik, beban bebas, dan program harian cerdas. Disesuaikan khusus untuk berat badan, dumbbell, pull-up bar, dan alat rumah tangga alternatif.',
    landing_cta_launch: 'Buka Studio Forma',
    landing_cta_library: 'Jelajahi 1.324 Gerakan',
    landing_feature_section_title: 'Arsitektur & Fitur Utama',
    landing_feature_section_subtitle: 'Dibangun dengan prinsip biomekanika murni, isolasi peralatan ketat, dan privasi offline.',
    landing_feat1_title: 'Generator Rutinitas Harian',
    landing_feat1_desc: 'Volume dan intensitas adaptif disesuaikan dengan tingkat energimu (Penuh, Standar, Pemulihan) dan durasi waktu.',
    landing_feat2_title: 'Sistem Deteksi Alat Presisi',
    landing_feat2_desc: 'Pencocokan alat komprehensif memastikan Anda tidak akan pernah mendapatkan gerakan dengan alat yang tidak Anda miliki.',
    landing_feat3_title: '1.324 Panduan Visual Gerakan',
    landing_feat3_desc: 'Animasi visualizer berlatar putih mulus, rincian otot primer/sekunder, dan panduan langkah alami dalam Bahasa Indonesia.',
    landing_feat4_title: 'Audio Synthesizer & Pengatur Istirahat',
    landing_feat4_desc: 'Hitung mundur istirahat melayang dengan isyarat suara akustik 3-2-1 dan nada selesai tiap set.',
    landing_foss_title: 'Komunitas Terbuka & Open Source',
    landing_foss_desc: 'Tanpa biaya langganan. Tanpa pelacak privasi. Semua catatan latihan dan rekor tersimpan aman di browser Anda.',
    landing_footer_text: 'Forma Studio — Mesin Latihan Kekuatan Mandiri Bebas & Terbuka.',

    hero_greeting: 'Siap latihan hari ini',
    hero_subtitle: 'Program latihan di rumah yang disesuaikan dengan berat badan, dumbbell, dan perlengkapan rumah Anda.',
    streak_badge: 'Hari Berturut-turut',
    level_badge: 'Level',
    btn_generate_daily: 'Buat Rencana Harian',
    btn_weekly_splits: 'Program Mingguan',
    stat_active_streak: 'Konsistensi Latihan',
    stat_active_streak_sub: 'Target konsistensi tercapai',
    stat_total_sessions: 'Total Sesi Selesai',
    stat_total_sessions_sub: 'target sesi / minggu',
    stat_total_volume: 'Total Beban Terangkat',
    stat_prs_logged: 'Rekor Pribadi tercatat',
    days: 'hari',
    completed: 'sesi',
    tonnes: 'ton',
    section_quick_access: 'Akses Latihan Cepat',
    link_all_programs: 'Semua Program',
    card_smart_daily_badge: 'Rencana Cerdas',
    card_smart_daily_title: 'Generator Latihan Harian',
    card_smart_daily_desc: 'Buat rutinitas khusus 15-60 menit berdasarkan tingkat energi, target otot, dan alat yang tersedia.',
    card_library_badge: '1.324 Gerakan',
    card_library_title: 'Koleksi Panduan Gerakan',
    card_library_desc: 'Jelajahi panduan video langkah demi langkah, filter otot sasaran, dan progresi kalistenik.',
    card_recent_title: 'Sesi Latihan Terakhir',
    card_recent_view: 'Lihat Catatan',
    workout_in_progress: 'Latihan Sedang Berjalan',

    wizard_title: 'Generator Latihan Harian',
    wizard_subtitle: 'Dirancang sesuai tingkat energimu, durasi, dan alat rumah yang tersedia.',
    step_energy: '1. Tingkat Energi Saat Ini',
    energy_high: 'Energi Penuh (Tinggi)',
    energy_high_desc: 'Volume penuh, beban progresif, intensitas maksimal',
    energy_mod: 'Sedang (Standar)',
    energy_mod_desc: 'Volume seimbang, set kerja optimal',
    energy_low: 'Rendah (Pemulihan)',
    energy_low_desc: 'Jumlah set lebih sedikit, ramah sendi & kelenturan',
    step_duration: '2. Durasi Waktu',
    mins: 'Menit',
    step_focus: '3. Sasaran Kelompok Otot',
    btn_generate: 'Buat Rencana Latihan',
    plan_prescribed_movements: 'Daftar Gerakan yang Dianjurkan',
    btn_reroll: 'Acak Ulang',
    btn_adjust: 'Ubah',
    btn_start_active: 'Mulai Latihan Sekarang',
    sets_times_reps: 'Set × Repetisi',

    focus_full_body: 'Seluruh Tubuh',
    focus_upper_body: 'Tubuh Bagian Atas',
    focus_lower_body: 'Tubuh Bagian Bawah',
    focus_push: 'Dada & Dorong',
    focus_pull: 'Punggung & Tarik',
    focus_legs: 'Kaki & Bokong',
    focus_core: 'Otot Inti & Perut',
    focus_cardio: 'Kardio & HIIT',

    gear_title: 'Pengaturan Peralatan Rumah',
    gear_subtitle: 'Peralatan yang Tersedia',
    gear_desc: 'Pilih perlengkapan yang Anda miliki di rumah. Algoritma rencana harian hanya akan memilih gerakan sesuai alat yang aktif.',
    btn_add_custom_tool: 'Tambah Alat Rumah',
    modal_add_tool_title: 'Tambah Alat Rumah Tangga Alternatif',
    tool_name_label: 'Nama Alat',
    tool_name_placeholder: 'contoh: Galon Air, Kursi Makan, Ottoman',
    tool_desc_label: 'Keterangan / Fungsi',
    tool_desc_placeholder: 'contoh: Untuk rowing berbeban dan bicep curl',
    tool_weight_label: 'Perkiraan Berat Beban (kg)',
    btn_cancel: 'Batal',
    btn_save_tool: 'Simpan Alat',
    section_free_weights: 'Beban Bebas & Kalistenik',
    section_free_weights_desc: 'Beban standar rumah, pull-up bar, dan tumpuan berat badan.',
    section_benches_balls: 'Bangku, Bola & Perlengkapan Inti',
    section_benches_balls_desc: 'Permukaan tumpuan dan alat keseimbangan untuk variasi sudut gerakan.',
    section_machines: 'Mesin Gym & Sistem Kabel',
    section_machines_desc: 'Peralatan katrol berat (aktifkan jika memiliki katrol di rumah atau akses gym).',
    section_improvised: 'Alat Rumah Tangga Pengganti',
    section_improvised_desc: 'Benda sehari-hari yang dimanfaatkan sebagai alat latihan (kursi untuk dips, ransel berisi beban, handuk untuk slider).',

    live_session: 'Pelacak Sesi Langsung',
    btn_finish_workout: 'Selesaikan Latihan',
    btn_cancel_workout: 'Batalkan Latihan',
    set_header: 'Set',
    target_header: 'Target',
    actual_reps_header: 'Repetisi',
    weight_header: 'Beban (kg)',
    status_header: 'Status',
    btn_complete_set: 'Selesai',
    btn_completed: 'Selesai',
    workout_notes_placeholder: 'Tuliskan catatan atau evaluasi latihan...',
    btn_swap_exercise: 'Ganti Gerakan',
    modal_swap_title: 'Ganti Gerakan Latihan',
    modal_swap_subtitle: 'Pilih gerakan alternatif yang melatih kelompok otot yang sama.',
    swap_recommended_title: 'Pilihan Alternatif yang Dianjurkan',
    swap_all_compatible_title: 'Cari & Pilih Gerakan yang Sesuai',
    btn_replace: 'Ganti Gerakan',

    detail_primary_target: 'Otot Utama',
    detail_required_gear: 'Alat yang Dibutuhkan',
    detail_supporting_muscles: 'Otot Pendukung & Sinergis',
    detail_execution_steps: 'Panduan Pelaksanaan Gerakan',
    btn_got_it: 'Mengerti',

    lib_movements_indexed: '1.324 Gerakan Terindeks',
    lib_title: 'Koleksi Panduan Gerakan',
    lib_search_placeholder: 'Cari pull-up, squat, curl...',
    lib_muscle_groups: 'Kelompok Otot',
    lib_filter_gear: 'Filter Berdasarkan Alat',
    lib_showing: 'Menampilkan',
    lib_clear_filter: 'Hapus filter alat',

    analytics_title: 'Performa & Riwayat Latihan',
    analytics_subtitle: 'Pantau konsistensi latihan, total beban angkatan, dan pencapaian rekor pribadi.',
    analytics_heatmap_title: 'Peta Konsistensi (28 Hari Terakhir)',
    analytics_prs_title: 'Pencapaian Rekor Pribadi (PR)',
    btn_export_backup: 'Ekspor Cadangan JSON',
    btn_import_backup: 'Impor Cadangan JSON',
    no_history_yet: 'Belum ada latihan yang tercatat. Selesaikan sesi pertamamu untuk melihat statistik!',

    rest_interval: 'Waktu Istirahat',
    btn_skip: 'Lewati',
    btn_pause: 'Jeda',
    btn_resume: 'Lanjutkan',
  },
};

export function getTranslation(lang: Language): Translations {
  return I18N_DICTIONARY[lang] || I18N_DICTIONARY.en;
}
