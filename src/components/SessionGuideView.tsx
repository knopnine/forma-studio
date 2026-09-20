import React from 'react';
import {
  Shield,
  Activity,
  Clock,
  Download,
  ArrowRight,
  Sparkles,
  BarChart3,
  Check,
  HelpCircle,
} from './Icons';
import { useFitness } from '../context/FitnessContext';

export const SessionGuideView: React.FC = () => {
  const { profile, setCurrentTab } = useFitness();
  const isId = profile.language === 'id';

  const cards = [
    {
      icon: <Shield className="w-5 h-5" />,
      tag: isId ? 'Tanpa Akun & 100% Privat' : 'No Account & 100% Private',
      title: isId ? 'Penyimpanan Lokal Mandiri' : 'Local-First Private Vault',
      desc: isId
        ? 'Forma dirancang dengan arsitektur offline-first. Semua data profil, daftar peralatan, dan riwayat latihan Anda tersimpan langsung di memori browser (localStorage) perangkat Anda.'
        : 'Forma is engineered as an offline-first private vault. All your profile data, equipment setups, and workout logs are stored directly inside your browser storage (localStorage).',
      bullets: isId
        ? [
            'Tidak perlu mendaftar email atau mengingat kata sandi',
            'Bebas dari iklan dan pelacak pihak ketiga',
            'Berfungsi penuh tanpa memerlukan koneksi internet',
          ]
        : [
            'Zero email sign-ups or passwords to remember',
            'Completely free of ads and tracking cookies',
            'Full functionality without an active internet connection',
          ],
    },
    {
      icon: <Activity className="w-5 h-5" />,
      tag: isId ? 'Tahan Gangguan & Anti-Hilang' : 'Crash & Refresh Resilient',
      title: isId ? 'Penyimpanan Sesi Latihan Otomatis' : 'Real-Time In-Session Auto-Save',
      desc: isId
        ? 'Setiap centang repetisi dan beban yang Anda catat langsung disimpan secara real-time. Jika browser tertutup, halaman ter-refresh, atau layar ponsel terkunci saat latihan, sesi Anda tidak akan hilang.'
        : 'Every set checkmark, rep, and weight entry is cached in real time. If your browser reloads, mobile OS unloads the tab, or your screen locks mid-workout, your session restores automatically.',
      bullets: isId
        ? [
            'Sesi aktif langsung dipulihkan setelah halaman dimuat ulang',
            'Semua repetisi dan beban yang sudah dicentang tetap utuh',
            'Tombol "Lanjutkan Sesi" selalu tersedia di navigasi atas',
          ]
        : [
            'Active workout restores instantly upon page reload',
            'All logged sets, reps, and weights remain intact',
            'A "Resume Session" shortcut is always accessible in the navbar',
          ],
    },
    {
      icon: <Clock className="w-5 h-5" />,
      tag: isId ? 'Presisi Waktu Nyata' : 'Wall-Clock Precision',
      title: isId ? 'Timer Istirahat Akurat di Latar Belakang' : 'Background-Accurate Rest Timer',
      desc: isId
        ? 'Timer istirahat Forma menggunakan kalkulasi waktu nyata (wall-clock timestamp). Timer tidak akan membeku atau melambat saat Anda berpindah aplikasi untuk memutar musik atau saat layar HP mati.'
        : 'Forma calculates rest countdowns against real-world timestamps (wall-clock time). The timer will never freeze or drift when you switch apps to change music or lock your mobile device.',
      bullets: isId
        ? [
            'Waktu istirahat tetap berjalan akurat di latar belakang',
            'Sinyal audio 3-2-1 otomatis berbunyi saat waktu istirahat habis',
            'Dapat diatur ulang dengan tombol +30 detik kapan saja',
          ]
        : [
            'Rest countdown keeps running accurately in background',
            'Acoustic 3-2-1 sound cues trigger when rest concludes',
            'Adjustable on the fly with quick +30s and pause controls',
          ],
    },
    {
      icon: <Download className="w-5 h-5" />,
      tag: isId ? 'Portabilitas Data' : 'Data Portability',
      title: isId ? 'Cadangan JSON & Sinkronisasi Cloud' : 'JSON Backups & Cloud Sync',
      desc: isId
        ? 'Ingin memindahkan sesi ke HP, tablet, atau laptop baru? Buka tab Statistik, klik Ekspor untuk mengunduh berkas JSON cadangan, lalu klik Impor di perangkat tujuan. Format JSON terbuka dan bebas diakses.'
        : 'Want to transfer your workout logs to another phone, tablet, or laptop? Go to Analytics, click Export to download your private JSON file, and click Import on your other device.',
      bullets: isId
        ? [
            'Ekspor dan impor 1-klik tanpa batasan ukuran data',
            'Dapat dicadangkan ke Google Drive, iCloud, atau disk lokal',
            'Mendukung sinkronisasi anonim berbasis cloud jika diaktifkan',
          ]
        : [
            '1-click export and import with zero file lock-in',
            'Easily stored to personal cloud drives or local disk',
            'Supports anonymous background cloud sync when configured',
          ],
    },
  ];

  const faqs = [
    {
      q: isId ? 'Apa yang terjadi jika saya membersihkan cache atau riwayat browser?' : 'What happens if I clear my browser history or site cookies?',
      a: isId
        ? 'Membersihkan "Site Data / Cookies" browser akan menghapus penyimpanan lokal. Oleh karena itu, kami menyarankan untuk mengunduh cadangan JSON secara berkala melalui tab Statistik.'
        : 'Clearing "Site Data / Cookies" will wipe your local storage. We strongly recommend downloading a periodic JSON backup from the Analytics tab to keep your data safe.',
    },
    {
      q: isId ? 'Apakah sesi saya dapat diakses orang lain?' : 'Can other people access my session or workout history?',
      a: isId
        ? 'Tidak. Seluruh data tersimpan secara lokal dan terisolasi di perangkat Anda. Tidak ada pihak ketiga yang dapat mengakses data latihan Anda.'
        : 'No. All data is isolated inside your personal browser storage. No other user, developer, or advertiser can view your workouts.',
    },
    {
      q: isId ? 'Bagaimana cara menggunakan Forma di HP dan laptop bersamaan?' : 'How do I use Forma across both my phone and my laptop?',
      a: isId
        ? 'Gunakan tombol Ekspor di tab Statistik perangkat pertama, kirim berkas JSON ke perangkat kedua, lalu klik Impor. Semua riwayat dan rekor pribadi (PR) akan langsung tersinkronkan.'
        : 'Use the Export button in the Analytics tab on your first device, send the JSON file to your second device, and click Import. All logs and PRs will be restored immediately.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="border-b border-[#e5e5e5] pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[18px] bg-[#ffffff] border border-[#e5e5e5] text-xs font-semibold text-[#0a0a0a]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{isId ? 'Arsitektur Privasi & Sesi' : 'Privacy & Session Architecture'}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0a0a0a]">
          {isId ? 'Cara Kerja Sesi di Forma Studio' : 'How Sessions Work in Forma Studio'}
        </h1>
        <p className="text-sm text-[#6f6f6f] max-w-2xl leading-relaxed">
          {isId
            ? 'Forma dirancang sebagai asisten kebugaran yang mengutamakan privasi dan kebebasan pengguna. Tidak ada formulir pendaftaran, tidak ada kata sandi, dan data Anda sepenuhnya milik Anda.'
            : 'Forma is engineered as an offline-first companion prioritizing athlete autonomy and privacy. No registration forms, no passwords, and zero data lock-in.'}
        </p>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="clinical-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-[14px] bg-[#f5f5f5] text-[#0a0a0a] border border-[#e5e5e5] flex items-center justify-center shadow-xs">
                  {card.icon}
                </div>
                <span className="badge-soft text-[11px] font-semibold">{card.tag}</span>
              </div>
              <h3 className="text-lg font-semibold text-[#0a0a0a]">{card.title}</h3>
              <p className="text-xs text-[#6f6f6f] leading-relaxed">{card.desc}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#f5f5f5]">
              {card.bullets.map((b, bIdx) => (
                <div key={bIdx} className="flex items-start gap-2 text-xs text-[#0a0a0a]">
                  <Check className="w-3.5 h-3.5 text-[#0a0a0a] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Accordion Section */}
      <div className="clinical-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[#0a0a0a]">
          {isId ? 'Pertanyaan yang Sering Diajukan (FAQ)' : 'Frequently Asked Questions (FAQ)'}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, fIdx) => (
            <div key={fIdx} className="p-4 rounded-[18px] bg-[#fafafa] border border-[#e5e5e5] space-y-1.5">
              <h4 className="font-semibold text-sm text-[#0a0a0a]">{faq.q}</h4>
              <p className="text-xs text-[#6f6f6f] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Action Bar */}
      <div className="clinical-card p-6 bg-[#0a0a0a] text-[#fafafa] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#fafafa]" />
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              {isId ? 'Siap Latihan Hari Ini?' : 'Ready To Train Today?'}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-[#fafafa]">
            {isId ? 'Mulai sesi latihan tanpa perlu login' : 'Start your workout session immediately'}
          </h3>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setCurrentTab('analytics')}
            className="px-4 py-2.5 rounded-[18px] text-xs font-semibold bg-[#ffffff]/10 hover:bg-[#ffffff]/20 text-[#fafafa] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isId ? 'Lihat Statistik' : 'View Analytics'}</span>
          </button>
          <button
            onClick={() => setCurrentTab('wizard')}
            className="px-4 py-2.5 rounded-[18px] text-xs font-semibold bg-[#ffffff] hover:bg-[#f5f5f5] text-[#0a0a0a] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>{isId ? 'Rencana Harian' : 'Daily Plan'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
