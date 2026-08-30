// Comprehensive Indonesian Fitness Dictionary & Multi-Pass Translator for HomeFit Studio

const PHRASE_DICTIONARY: [RegExp, string][] = [
  // Starting Position Patterns
  [/Lie flat on your back with your knees bent and feet flat on the (ground|floor).?/gi, 'Berbaring telentang di lantai dengan lutut ditekuk dan telapak kaki menempel rata pada lantai.'],
  [/Lie flat on your back on a (mat|floor|bench).?/gi, 'Berbaring telentang di atas $1.'],
  [/Lie flat on your back.?/gi, 'Berbaring telentang di lantai.'],
  [/Lie on your side with your legs straight.?/gi, 'Berbaring miring ke samping dengan kedua kaki lurus.'],
  [/Lie face down on the (floor|ground|mat).?/gi, 'Tengkurap menghadap ke bawah di lantai/matras.'],
  [/Stand up straight with your feet (shoulder|hip)-width apart.?/gi, 'Berdiri tegak dengan kaki dibuka selebar bahu/pinggul.'],
  [/Stand with your feet (shoulder|hip)-width apart.?/gi, 'Berdiri dengan kaki dibuka selebar bahu/pinggul.'],
  [/Stand with your feet together.?/gi, 'Berdiri tegak dengan kedua kaki rapat.'],
  [/Place your hands behind your head with your elbows pointing outwards?.?/gi, 'Letakkan kedua tangan di belakang kepala dengan siku mengarah ke samping luar.'],
  [/Hold a dumbbell in each hand with an overhand grip.?/gi, 'Pegang dumbbell di masing-masing tangan dengan genggaman overhand (telapak tangan menghadap ke bawah/dalam).'],
  [/Hold a dumbbell in each hand with an underhand grip.?/gi, 'Pegang dumbbell di masing-masing tangan dengan genggaman underhand (telapak tangan menghadap ke atas).'],
  [/Hold a dumbbell in each hand with a neutral grip.?/gi, 'Pegang dumbbell di masing-masing tangan dengan genggaman netral (telapak saling berhadapan).'],
  [/Hold a dumbbell in each hand.?/gi, 'Pegang dumbbell di masing-masing tangan.'],
  [/Hold a dumbbell with both hands.?/gi, 'Pegang satu dumbbell dengan kedua tangan.'],
  [/Grasp the pull-up bar with an overhand grip.?/gi, 'Pegang pull-up bar dengan genggaman overhand (telapak menghadap ke depan) selebar bahu.'],
  [/Grasp the pull-up bar with an underhand grip.?/gi, 'Pegang pull-up bar dengan genggaman underhand (telapak menghadap ke diri Anda) selebar bahu.'],
  [/Hang from the bar with your arms fully extended.?/gi, 'Gantungkan tubuh pada pull-up bar dengan kedua lengan terentang lurus.'],
  [/Sit on a sturdy chair with your back straight.?/gi, 'Duduk di kursi yang kokoh dengan punggung tegak.'],
  [/Sit on the edge of a bench or chair.?/gi, 'Duduk di tepi bangku atau kursi yang kokoh.'],
  [/Start in a high plank position with your hands shoulder-width apart.?/gi, 'Mulai dari posisi high plank dengan tangan dibuka selebar bahu dan tubuh lurus.'],
  [/Start in a push-up position.?/gi, 'Mulai dari posisi awal push-up dengan tubuh lurus dari kepala hingga tumit.'],
  [/Begin in a standard plank position.?/gi, 'Mulai dari posisi plank standar dengan bertumpu pada lengan bawah.'],

  // Execution Patterns
  [/Engaging your abs, slowly lift your upper body off the (ground|floor)[^.]*./gi, 'Kencangkan otot perut, lalu angkat tubuh bagian atas secara perlahan dari lantai.'],
  [/Slowly lower your body until your chest nearly touches the (ground|floor).?/gi, 'Turunkan tubuh secara perlahan hingga dada hampir menyentuh lantai.'],
  [/Lower your body until your (thighs|knees) are parallel to the (floor|ground).?/gi, 'Turunkan tubuh Anda hingga paha sejajar dengan lantai.'],
  [/Push through your heels to return to the starting position.?/gi, 'Dorong bertumpu pada tumit untuk kembali ke posisi awal.'],
  [/Push back up to the starting position, fully extending your arms.?/gi, 'Dorong kembali tubuh ke atas hingga kedua lengan lurus terkendali.'],
  [/Pull your body upward until your chin clears the bar.?/gi, 'Tarik tubuh ke atas hingga dagu melewati pull-up bar.'],
  [/Pull the dumbbells? up towards your (chest|ribs|torso).?/gi, 'Tarik dumbbell ke arah rusuk/dada Anda dengan memfokuskan tarikan pada otot punggung.'],
  [/Slowly lower yourself back down with control.?/gi, 'Turunkan tubuh kembali ke posisi bawah secara perlahan dan terkontrol.'],
  [/Slowly lower the weights? back to the starting position.?/gi, 'Turunkan beban kembali ke posisi awal secara perlahan.'],
  [/Pause for a moment at the top( of the movement)?\.?/gi, 'Tahan dan rasakan kontraksi puncak selama 1 detik di posisi atas.'],
  [/Pause for a second at the peak( of the movement)?\.?/gi, 'Tahan 1 detik pada puncak kontraksi gerakan.'],
  [/Pause at the top( of the movement)?\.?/gi, 'Tahan sejenak di puncak gerakan.'],
  [/Keep your core tight and back straight throughout the movement.?/gi, 'Jaga otot perut tetap kencang dan punggung lurus selama gerakan.'],
  [/Keep your elbows close to your body.?/gi, 'Jaga siku tetap dekat di samping tubuh.'],
  [/Breathe in as you lower and breathe out as you push.?/gi, 'Tarik napas saat menurunkan beban, dan hembuskan napas saat mendorong.'],
  [/Inhale as you lower and exhale as you lift.?/gi, 'Tarik napas saat menurunkan gerakan dan buang napas saat mengangkat beban.'],
  [/Squeeze your shoulder blades together at the top of the movement.?/gi, 'Rapatkan dan kunci tulang belikat di puncak gerakan untuk kontraksi maksimal.'],
  [/Squeeze your glutes at the top of the movement.?/gi, 'Kencangkan otot bokong (glutes) di puncak gerakan.'],
  [/Repeat for the desired number of repetitions?.?/gi, 'Ulangi gerakan sesuai target jumlah repetisi.'],
  [/Repeat for the prescribed number of reps.?/gi, 'Ulangi gerakan sesuai target repetisi yang ditentukan.'],
  [/Repeat on the other side.?/gi, 'Ulangi gerakan yang sama untuk sisi sebaliknya.'],
  [/Switch sides and repeat.?/gi, 'Ganti ke sisi sebaliknya dan ulangi gerakan.'],
];

const VOCAB_MAP: [RegExp, string][] = [
  // Actions
  [/\bStarting position:?\b/gi, 'Posisi awal:'],
  [/\bExecution:?\b/gi, 'Pelaksanaan:'],
  [/\bLie down\b/gi, 'Berbaringlah'],
  [/\bStand upright\b/gi, 'Berdiri tegak'],
  [/\bSlowly lower\b/gi, 'Turunkan perlahan'],
  [/\bLower slowly\b/gi, 'Turunkan perlahan'],
  [/\bPush up\b/gi, 'Dorong ke atas'],
  [/\bPull up\b/gi, 'Tarik ke atas'],
  [/\bPress up\b/gi, 'Tekan ke atas'],
  [/\bLift your\b/gi, 'Angkat'],
  [/\bRaise your\b/gi, 'Angkat'],
  [/\bExtend your\b/gi, 'Luruskan'],
  [/\bBend your\b/gi, 'Tekuk'],
  [/\bHold for\b/gi, 'Tahan selama'],
  [/\bSqueeze your\b/gi, 'Kontraksikan/kencangkan'],
  [/\bEngage your\b/gi, 'Kencangkan'],
  [/\bReturn to\b/gi, 'Kembali ke'],
  [/\bRepeat\b/gi, 'Ulangi'],
  [/\bInhale\b/gi, 'Tarik napas'],
  [/\bExhale\b/gi, 'Buang napas'],

  // Body Parts
  [/\bshoulder-width apart\b/gi, 'dibuka selebar bahu'],
  [/\bhip-width apart\b/gi, 'dibuka selebar pinggul'],
  [/\bfeet\b/gi, 'kaki'],
  [/\bfoot\b/gi, 'kaki'],
  [/\bhands?\b/gi, 'tangan'],
  [/\bpalms?\b/gi, 'telapak tangan'],
  [/\belbows?\b/gi, 'siku'],
  [/\bshoulders?\b/gi, 'bahu'],
  [/\bknees?\b/gi, 'lutut'],
  [/\bchest\b/gi, 'dada'],
  [/\bback\b/gi, 'punggung'],
  [/\bhips?\b/gi, 'pinggul'],
  [/\bcore\b/gi, 'otot inti (core)'],
  [/\babs\b/gi, 'otot perut'],
  [/\bglutes\b/gi, 'otot bokong (glutes)'],
  [/\bquads\b/gi, 'otot paha depan (quads)'],
  [/\bhamstrings\b/gi, 'otot paha belakang (hamstrings)'],
  [/\bcalves\b/gi, 'otot betis'],
  [/\bbiceps\b/gi, 'otot bisep'],
  [/\btriceps\b/gi, 'otot trisep'],
  [/\bspine\b/gi, 'tulang belakang'],
  [/\bheels?\b/gi, 'tumit'],
  [/\btoes?\b/gi, 'jari kaki'],
  [/\bchin\b/gi, 'dagu'],
  [/\btorso\b/gi, 'batang tubuh'],

  // Gear & Surfaces
  [/\bfloor\b/gi, 'lantai'],
  [/\bground\b/gi, 'lantai'],
  [/\bmat\b/gi, 'matras'],
  [/\bbench\b/gi, 'bangku'],
  [/\bchair\b/gi, 'kursi'],
  [/\bdumbbells?\b/gi, 'dumbbell'],
  [/\bbarbells?\b/gi, 'barbell'],
  [/\bkettlebells?\b/gi, 'kettlebell'],
  [/\bpull-up bar\b/gi, 'pull-up bar'],
  [/\bresistance bands?\b/gi, 'resistance band'],
  [/\bexercise ball\b/gi, 'bola senam/gym ball'],
  [/\bstability ball\b/gi, 'stability ball'],

  // Adverbs / Modifiers
  [/\bwith control\b/gi, 'dengan terkendali'],
  [/\bcontrolled manner\b/gi, 'gerakan terkendali'],
  [/\bthroughout the movement\b/gi, 'sepanjang gerakan'],
  [/\bstarting position\b/gi, 'posisi awal'],
  [/\bfully extended\b/gi, 'terentang lurus penuh'],
  [/\bparallel to the (floor|ground)\b/gi, 'sejajar dengan lantai'],
  [/\bper side\b/gi, 'di setiap sisi'],
  [/\beach side\b/gi, 'masing-masing sisi'],
  [/\bwithout swinging\b/gi, 'tanpa mengayunkan badan'],
];

export function translateStepsToIndonesian(englishSteps: string[]): string[] {
  if (!englishSteps || englishSteps.length === 0) {
    return ['Lakukan gerakan dengan teknik yang benar dan kendalikan tempo gerakan secara perlahan.'];
  }

  return englishSteps.map((step) => {
    let text = step;

    // Pass 1: Sentence-level patterns
    for (const [pattern, replacement] of PHRASE_DICTIONARY) {
      text = text.replace(pattern, replacement);
    }

    // Pass 2: Word and phrase substitutions
    for (const [pattern, replacement] of VOCAB_MAP) {
      text = text.replace(pattern, replacement);
    }

    return text;
  });
}
