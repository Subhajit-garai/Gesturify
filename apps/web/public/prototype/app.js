/**
 * Gesturify - Frontend Core Logic
 * Minimalist, Accessible, Monochrome Architecture
 * Supporting Muted Persons & Sign Language Learners
 */

// --- 1. Sign Language Practice & Translation Data ---
const GESTURE_DICTIONARY = {
  alphabets: [
    { char: 'A', name: 'Letter A', desc: 'Fist with thumb resting against the side of the index finger.', cues: 'Keep thumb upright along the side of the fist.' },
    { char: 'B', name: 'Letter B', desc: 'Four fingers straight up touching each other, thumb folded across palm.', cues: 'Fingers held straight, thumb tucked tightly.' },
    { char: 'C', name: 'Letter C', desc: 'Curved hand forming a "C" shape facing outward.', cues: 'Fingers and thumb form a smooth arc.' },
    { char: 'D', name: 'Letter D', desc: 'Index finger straight up, other fingers touch thumb tip forming a circle.', cues: 'Single finger point, smooth circle at base.' },
    { char: 'E', name: 'Letter E', desc: 'All fingertips curled down touching the thumb edge.', cues: 'Compact handshape with bent knuckle joints.' },
    { char: 'F', name: 'Letter F', desc: 'Thumb and index finger touch to form a circle, other three fingers upright and spread.', cues: 'Like the "OK" gesture held upright.' },
    { char: 'G', name: 'Letter G', desc: 'Index and thumb parallel pointing horizontally to the side.', cues: 'Simulates a pinch gesture pointing sideways.' },
    { char: 'H', name: 'Letter H', desc: 'Index and middle fingers together pointing sideways, thumb resting below.', cues: 'Horizontal two-finger point.' },
    { char: 'I', name: 'Letter I', desc: 'Pinky finger straight up, remaining fingers folded into a fist with thumb over.', cues: 'Only the pinky extended upward.' },
    { char: 'J', name: 'Letter J', desc: 'Pinky finger extends and traces a small curve "J" in the air.', cues: 'Downward stroke with a curved hook.' },
    { char: 'K', name: 'Letter K', desc: 'Index finger straight, middle finger angled forward, thumb tucked between them.', cues: 'Two fingers form a "V" with thumb wedged between.' },
    { char: 'L', name: 'Letter L', desc: 'Thumb and index finger form a 90-degree "L" shape.', cues: 'Palm facing out, clear right angle.' },
    { char: 'M', name: 'Letter M', desc: 'Thumb folded under first three fingers, pinky curled beside.', cues: 'Three fingers resting over thumb.' },
    { char: 'N', name: 'Letter N', desc: 'Thumb folded under first two fingers, ring and pinky curled beside.', cues: 'Two fingers resting over thumb.' },
    { char: 'O', name: 'Letter O', desc: 'All fingertips touch the thumb tip to form an "O".', cues: 'Round circular opening visible from side.' },
    { char: 'P', name: 'Letter P', desc: 'Inverted "K" shape pointing downwards towards the ground.', cues: 'Middle finger points down, thumb in between.' },
    { char: 'Q', name: 'Letter Q', desc: 'Index and thumb pointing downwards like an inverted "G".', cues: 'Downward pointing pinch.' },
    { char: 'R', name: 'Letter R', desc: 'Index and middle fingers crossed tightly.', cues: 'Fingers crossed for good luck.' },
    { char: 'S', name: 'Letter S', desc: 'Tight fist with thumb crossed over the front of all fingers.', cues: 'Thumb rests across fingers, not beside.' },
    { char: 'T', name: 'Letter T', desc: 'Thumb tucked under the index finger, showing between index and middle.', cues: 'Index knuckle resting over thumb tip.' },
    { char: 'U', name: 'Letter U', desc: 'Index and middle fingers straight up and pressed tightly together.', cues: 'Two fingers parallel and closed.' },
    { char: 'V', name: 'Letter V', desc: 'Index and middle fingers straight up spread into a "V" shape.', cues: 'Peace sign with palm facing outward.' },
    { char: 'W', name: 'Letter W', desc: 'Index, middle, and ring fingers spread upward like the letter "W".', cues: 'Three fingers upright and separated.' },
    { char: 'X', name: 'Letter X', desc: 'Index finger hooked like a pirate hook, others curled into fist.', cues: 'Bent index knuckle pointing up.' },
    { char: 'Y', name: 'Letter Y', desc: 'Thumb and pinky extended outward, middle three fingers folded into palm.', cues: 'Hang-loose or telephone handshape.' },
    { char: 'Z', name: 'Letter Z', desc: 'Index finger extends and draws a "Z" path in the air.', cues: 'Draw top line, diagonal stroke, bottom line.' }
  ],
  words: [
    { word: 'Hello', category: 'Greetings', desc: 'Open flat hand touches near the temple, then salutes slightly outward and down.', duration: '1.2s' },
    { word: 'Thank You', category: 'Courtesy', desc: 'Fingertips of flat dominant hand touch the chin, then move outward towards the listener.', duration: '1.4s' },
    { word: 'Please', category: 'Courtesy', desc: 'Flat hand placed on the chest, making a circular, respectful motion.', duration: '1.5s' },
    { word: 'Help', category: 'Essential', desc: 'Closed fist with thumb upright rests on the flat palm of the non-dominant hand, lifting together.', duration: '1.6s' },
    { word: 'Yes', category: 'Basic', desc: 'Fist "S" handshape nods up and down at the wrist like a nodding head.', duration: '1.0s' },
    { word: 'No', category: 'Basic', desc: 'Index and middle finger snap down onto the thumb twice in a quick snapping motion.', duration: '1.1s' },
    { word: 'Water', category: 'Daily Life', desc: 'Index, middle, and ring finger form "W" handshape and tap the index finger gently against chin.', duration: '1.3s' },
    { word: 'Eat', category: 'Daily Life', desc: 'Fingertips pressed together (flat-O handshape) tap near the mouth twice.', duration: '1.2s' },
    { word: 'Understand', category: 'Communication', desc: 'Fist held by temple, index finger flicks straight up like a lightbulb turning on.', duration: '1.3s' },
    { word: 'Emergency', category: 'Safety', desc: 'Hand in "E" handshape shakes rapidly from side to side at chest height.', duration: '1.5s' },
    { word: 'Hospital', category: 'Safety', desc: 'Index and middle fingers in "H" draw a small cross on the opposite upper arm.', duration: '1.7s' },
    { word: 'Quiet / Silence', category: 'Communication', desc: 'Crossed hands in front of mouth separate gently downwards into flat open palms.', duration: '1.8s' }
  ],
  sentenceTemplates: [
    
    {
      spoken: "Hello, my name is Alex.",
      aslGrammar: "HELLO, MY NAME A-L-E-X.",
      tokens: ["HELLO", "MY", "NAME", "ALEX"],
      rule: "Topic-Comment Structure: In sign language, identity introduction starts with the greeting followed by direct reference."
    },
    {
      spoken: "Where is the nearest hospital?",
      aslGrammar: "HOSPITAL NEAR WHERE?",
      tokens: ["HOSPITAL", "NEAR", "WHERE"],
      rule: "WH-Question Rule: Wh-words (Where, What, Who) are placed at the end of the sentence with lowered furrowed eyebrows."
    },
    {
      spoken: "Can you help me please?",
      aslGrammar: "PLEASE HELP ME YOU?",
      tokens: ["PLEASE", "HELP-ME", "YOU"],
      rule: "Directional Verbs: 'Help' moves from the person helping towards the person receiving assistance."
    },
    {
      spoken: "I do not understand sign language.",
      aslGrammar: "SIGN LANGUAGE I UNDERSTAND NOT.",
      tokens: ["SIGN", "LANGUAGE", "I", "UNDERSTAND", "NOT"],
      rule: "Negation Syntax: The negative particle 'NOT' or headshake accompanies the verb at the sentence conclusion."
    }
  ],
  grammarRules: [
    {
      title: "1. Topic - Comment Order",
      explanation: "Unlike English (Subject-Verb-Object), sign language often states the main topic first, followed by comments or questions about that topic.",
      example: "English: 'I am reading a book.' -> Sign: 'BOOK, I READ.'"
    },
    {
      title: "2. WH-Question Positioning",
      explanation: "Questions involving Who, What, Where, When, and Why usually position the question word at the end of the sentence accompanied by furrowed eyebrows.",
      example: "English: 'Where is the bathroom?' -> Sign: 'BATHROOM WHERE?'"
    },
    {
      title: "3. Directional & Spatial Verbs",
      explanation: "Verbs like 'GIVE', 'HELP', 'SHOW', and 'ASK' change trajectory in physical 3D space to indicate who is doing the action to whom.",
      example: "Move hand from helper to receiver to signify 'HELP-YOU' without separate pronoun words."
    },
    {
      title: "4. Facial Grammar & Non-Manual Markers (NMM)",
      explanation: "Facial expressions (eyebrow tilts, head nods, mouth shapes) are not mere emotion—they are grammatical markers for clauses, conditional questions, and tone.",
      example: "Raised eyebrows indicate Yes/No questions; furrowed eyebrows indicate WH-questions."
    }
  ]
};

// --- 2. Application State ---
const state = {
  currentTab: 'alphabet', // 'alphabet' | 'words' | 'sentence' | 'grammar'
  translationMode: 'textToAnim', // 'textToAnim' | 'videoToText'
  selectedAlphabet: GESTURE_DICTIONARY.alphabets[0],
  selectedWord: GESTURE_DICTIONARY.words[0],
  selectedSentence: GESTURE_DICTIONARY.sentenceTemplates[0],
  isPlayingAnimation: false,
  animationSpeed: 1, // 0.5 | 1 | 1.5
  isCameraActive: false,
  webcamStream: null,
  landmarkSimulationStep: 0,
  fontSizeLevel: 0, // -1, 0, 1
  isHighContrast: false,
  detectedSign: 'WAITING FOR GESTURE...',
  confidence: 94.8
};

// --- 3. DOM Elements Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Setup Components
  initNavigation();
  initLearnerModule();
  initTranslationModule();
  initAuthModal();
  initAccessibilityControls();
  initContactForm();
  initOpenCvCanvas();
});

// --- 4. Navigation & Layout Handling ---
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenu.classList.toggle('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    });
  }
}

// --- 5. Learner Module Implementation ---
function initLearnerModule() {
  const learnerTabs = document.querySelectorAll('[data-learner-tab]');
  learnerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      learnerTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetView = tab.getAttribute('data-learner-tab');
      state.currentTab = targetView;

      document.querySelectorAll('.learner-subview').forEach(view => {
        view.classList.add('hidden');
      });

      const activeView = document.getElementById(`learner-view-${targetView}`);
      if (activeView) {
        activeView.classList.remove('hidden');
      }

      // Refresh icons if needed
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Render Alphabet Cards Grid
  renderAlphabetGrid();

  // Render Words Grid
  renderWordsGrid();

  // Render Sentence Formation Builder
  renderSentenceBuilder();

  // Render Grammar Rules
  renderGrammarRules();

  // Update Detail Card for initial alphabet
  updateAlphabetDetail(state.selectedAlphabet);
}

function renderAlphabetGrid() {
  const gridContainer = document.getElementById('alphabet-grid');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';
  GESTURE_DICTIONARY.alphabets.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `sign-card ${index === 0 ? 'active' : ''}`;
    card.setAttribute('data-char', item.char);
    card.innerHTML = `
      <span class="text-2xl font-bold font-mono text-zinc-900">${item.char}</span>
      <span class="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Sign ${item.char}</span>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('#alphabet-grid .sign-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.selectedAlphabet = item;
      updateAlphabetDetail(item);
    });

    gridContainer.appendChild(card);
  });
}

function updateAlphabetDetail(item) {
  const titleEl = document.getElementById('alphabet-detail-title');
  const descEl = document.getElementById('alphabet-detail-desc');
  const cuesEl = document.getElementById('alphabet-detail-cues');
  const charDisplayEl = document.getElementById('alphabet-char-large');

  if (titleEl) titleEl.textContent = item.name;
  if (descEl) descEl.textContent = item.desc;
  if (cuesEl) cuesEl.textContent = item.cues;
  if (charDisplayEl) charDisplayEl.textContent = item.char;

  // Draw simulated wireframe hand pose corresponding to this letter
  drawSimulatedHandPose(item.char);
}

function renderWordsGrid() {
  const container = document.getElementById('words-grid');
  if (!container) return;

  container.innerHTML = '';
  GESTURE_DICTIONARY.words.forEach((w, idx) => {
    const card = document.createElement('div');
    card.className = `p-4 border border-zinc-200 rounded-lg hover:border-zinc-800 transition-all cursor-pointer bg-white ${idx === 0 ? 'border-zinc-900' : ''}`;
    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold text-zinc-900 text-base">${w.word}</span>
        <span class="text-xs font-mono uppercase bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">${w.category}</span>
      </div>
      <p class="text-xs text-zinc-600 line-clamp-2 leading-relaxed mb-3">${w.desc}</p>
      <div class="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
        <span>Avg Speed: ${w.duration}</span>
        <span class="underline hover:text-zinc-900 font-medium">Practice Sign →</span>
      </div>
    `;

    card.addEventListener('click', () => {
      state.selectedWord = w;
      document.querySelectorAll('#words-grid > div').forEach(c => c.classList.remove('border-zinc-900'));
      card.classList.add('border-zinc-900');
      updateWordPracticeModal(w);
    });

    container.appendChild(card);
  });
}

function updateWordPracticeModal(word) {
  const title = document.getElementById('word-practice-title');
  const desc = document.getElementById('word-practice-desc');
  const cat = document.getElementById('word-practice-category');
  if (title) title.textContent = `Word: "${word.word}"`;
  if (desc) desc.textContent = word.desc;
  if (cat) cat.textContent = `Category: ${word.category}`;

  // Trigger OpenCV landmark visualizer
  drawSimulatedHandPose(word.word);
}

function renderSentenceBuilder() {
  const container = document.getElementById('sentence-templates-list');
  if (!container) return;

  container.innerHTML = '';
  GESTURE_DICTIONARY.sentenceTemplates.forEach((st, idx) => {
    const card = document.createElement('div');
    card.className = `p-5 border border-zinc-200 rounded-xl bg-white mb-3 hover:border-zinc-600 transition-all cursor-pointer ${idx === 0 ? 'border-zinc-900' : ''}`;
    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs uppercase font-mono tracking-wider text-zinc-500">English Expression</span>
        <span class="text-xs font-mono text-zinc-400">Template 0${idx + 1}</span>
      </div>
      <p class="text-base font-semibold text-zinc-900 mb-3">"${st.spoken}"</p>
      
      <div class="bg-zinc-50 p-3 rounded-lg border border-zinc-200 mb-3">
        <div class="text-xs uppercase font-mono text-zinc-500 mb-1">ASL Grammatical Structure:</div>
        <div class="font-mono text-sm font-semibold text-zinc-900">${st.aslGrammar}</div>
      </div>

      <div class="flex flex-wrap gap-1.5 mb-3">
        ${st.tokens.map(token => `<span class="px-2 py-1 bg-zinc-900 text-white text-xs font-mono rounded">${token}</span>`).join('')}
      </div>

      <p class="text-xs text-zinc-600 leading-normal border-t border-zinc-100 pt-2">
        <strong>Rule Insight:</strong> ${st.rule}
      </p>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('#sentence-templates-list > div').forEach(c => c.classList.remove('border-zinc-900'));
      card.classList.add('border-zinc-900');
      state.selectedSentence = st;
      // Show animation tokens
      loadSentenceInAnimationViewer(st);
    });

    container.appendChild(card);
  });
}

function renderGrammarRules() {
  const container = document.getElementById('grammar-rules-list');
  if (!container) return;

  container.innerHTML = '';
  GESTURE_DICTIONARY.grammarRules.forEach(gr => {
    const box = document.createElement('div');
    box.className = 'p-5 border border-zinc-200 rounded-xl bg-white';
    box.innerHTML = `
      <h4 class="font-semibold text-zinc-900 text-base mb-2">${gr.title}</h4>
      <p class="text-sm text-zinc-600 leading-relaxed mb-3">${gr.explanation}</p>
      <div class="bg-zinc-50 border border-zinc-200 rounded p-2.5 font-mono text-xs text-zinc-800">
        ${gr.example}
      </div>
    `;
    container.appendChild(box);
  });
}

// --- 6. Translation Module Implementation ---
function initTranslationModule() {
  const transTabs = document.querySelectorAll('[data-trans-tab]');
  transTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      transTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-trans-tab');
      state.translationMode = target;

      document.getElementById('trans-subview-textToAnim')?.classList.toggle('hidden', target !== 'textToAnim');
      document.getElementById('trans-subview-videoToText')?.classList.toggle('hidden', target !== 'videoToText');

      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Text-to-Sign Animation Controller
  const textInput = document.getElementById('text-to-sign-input');
  const translateBtn = document.getElementById('btn-translate-text');
  const animTimeline = document.getElementById('sign-anim-timeline');
  const playBtn = document.getElementById('anim-play-btn');

  if (translateBtn && textInput) {
    translateBtn.addEventListener('click', () => {
      const phrase = textInput.value.trim();
      if (!phrase) return;
      processTextToAnimation(phrase);
    });
  }

  // Preset phrase chips
  document.querySelectorAll('.preset-phrase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-phrase');
      if (textInput && text) {
        textInput.value = text;
        processTextToAnimation(text);
      }
    });
  });

  // Play / Pause Animation button
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      state.isPlayingAnimation = !state.isPlayingAnimation;
      playBtn.innerHTML = state.isPlayingAnimation
        ? `<i data-lucide="pause" class="w-4 h-4"></i> Pause Sequence`
        : `<i data-lucide="play" class="w-4 h-4"></i> Play Sequence`;
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Real-Time Video-to-Text Setup
  const toggleCameraBtn = document.getElementById('btn-toggle-camera');
  if (toggleCameraBtn) {
    toggleCameraBtn.addEventListener('click', handleToggleCamera);
  }

  const copyTranscriptBtn = document.getElementById('btn-copy-transcript');
  if (copyTranscriptBtn) {
    copyTranscriptBtn.addEventListener('click', () => {
      const transcriptBox = document.getElementById('detected-transcript-text');
      if (transcriptBox) {
        navigator.clipboard.writeText(transcriptBox.innerText);
        copyTranscriptBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyTranscriptBtn.textContent = 'Copy Text';
        }, 1800);
      }
    });
  }

  const speakTranscriptBtn = document.getElementById('btn-speak-transcript');
  if (speakTranscriptBtn) {
    speakTranscriptBtn.addEventListener('click', () => {
      const transcriptBox = document.getElementById('detected-transcript-text');
      if (transcriptBox && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(transcriptBox.innerText);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    });
  }
}

function processTextToAnimation(text) {
  const words = text.toUpperCase().replace(/[^A-Z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const timelineEl = document.getElementById('sign-anim-timeline');
  const currentTokenEl = document.getElementById('current-anim-token');
  const tokenCountEl = document.getElementById('anim-token-count');

  if (timelineEl) {
    timelineEl.innerHTML = '';
    words.forEach((w, index) => {
      const chip = document.createElement('div');
      chip.className = `flex-shrink-0 px-3 py-1.5 rounded border text-xs font-mono ${index === 0 ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-800 border-zinc-300'}`;
      chip.textContent = `${index + 1}. ${w}`;
      chip.addEventListener('click', () => {
        timelineEl.querySelectorAll('div').forEach(c => {
          c.className = 'flex-shrink-0 px-3 py-1.5 rounded border text-xs font-mono bg-white text-zinc-800 border-zinc-300';
        });
        chip.className = 'flex-shrink-0 px-3 py-1.5 rounded border text-xs font-mono bg-zinc-900 text-white border-zinc-900';
        if (currentTokenEl) currentTokenEl.textContent = `Current Sign: ${w}`;
        drawSimulatedHandPose(w);
      });
      timelineEl.appendChild(chip);
    });
  }

  if (currentTokenEl && words.length > 0) {
    currentTokenEl.textContent = `Current Sign: ${words[0]}`;
    drawSimulatedHandPose(words[0]);
  }
  if (tokenCountEl) {
    tokenCountEl.textContent = `${words.length} Signs Generated`;
  }
}

function loadSentenceInAnimationViewer(sentence) {
  const textInput = document.getElementById('text-to-sign-input');
  if (textInput) {
    textInput.value = sentence.spoken;
  }
  // Switch to Text to Anim view and execute
  const transTabBtn = document.querySelector('[data-trans-tab="textToAnim"]');
  if (transTabBtn) transTabBtn.click();
  processTextToAnimation(sentence.aslGrammar);

  const transSection = document.getElementById('translation');
  if (transSection) {
    transSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- 7. Webcam & OpenCV HUD Simulation ---
let canvasCtx = null;
let animationFrameId = null;

function initOpenCvCanvas() {
  const canvas = document.getElementById('opencv-canvas');
  if (!canvas) return;
  canvasCtx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth || 640;
    canvas.height = canvas.parentElement.clientHeight || 360;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Start HUD Render Loop
  startOpenCvHudLoop(canvas, canvasCtx);
}

function startOpenCvHudLoop(canvas, ctx) {
  let frame = 0;

  function render() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark sleek monochrome background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle OpenCV grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Simulated 21 MediaPipe / OpenCV Hand Landmarks
    drawSkeletalHand(ctx, canvas.width, canvas.height, frame);

    // Draw OpenCV HUD Bounding Box
    drawHudOverlays(ctx, canvas.width, canvas.height, frame);

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}

function drawSkeletalHand(ctx, width, height, frame) {
  const centerX = width / 2;
  const centerY = height / 2 + 15;
  const swayX = Math.sin(frame * 0.03) * 12;
  const swayY = Math.cos(frame * 0.02) * 8;

  // 21 Keypoints for Hand Skeletal Tracking
  // Wrist, Thumb (1-4), Index (5-8), Middle (9-12), Ring (13-16), Pinky (17-20)
  const baseWrist = { x: centerX + swayX, y: centerY + 90 + swayY };

  const joints = {
    0: baseWrist,
    // Thumb
    1: { x: baseWrist.x - 35, y: baseWrist.y - 25 },
    2: { x: baseWrist.x - 55, y: baseWrist.y - 55 },
    3: { x: baseWrist.x - 65, y: baseWrist.y - 85 },
    4: { x: baseWrist.x - 70, y: baseWrist.y - 110 },
    // Index
    5: { x: baseWrist.x - 20, y: baseWrist.y - 65 },
    6: { x: baseWrist.x - 25, y: baseWrist.y - 110 },
    7: { x: baseWrist.x - 28, y: baseWrist.y - 145 },
    8: { x: baseWrist.x - 30, y: baseWrist.y - 175 },
    // Middle
    9: { x: baseWrist.x, y: baseWrist.y - 70 },
    10: { x: baseWrist.x, y: baseWrist.y - 120 },
    11: { x: baseWrist.x, y: baseWrist.y - 160 },
    12: { x: baseWrist.x, y: baseWrist.y - 195 },
    // Ring
    13: { x: baseWrist.x + 20, y: baseWrist.y - 65 },
    14: { x: baseWrist.x + 24, y: baseWrist.y - 110 },
    15: { x: baseWrist.x + 27, y: baseWrist.y - 145 },
    16: { x: baseWrist.x + 30, y: baseWrist.y - 175 },
    // Pinky
    17: { x: baseWrist.x + 38, y: baseWrist.y - 55 },
    18: { x: baseWrist.x + 48, y: baseWrist.y - 90 },
    19: { x: baseWrist.x + 55, y: baseWrist.y - 120 },
    20: { x: baseWrist.x + 60, y: baseWrist.y - 145 }
  };

  // Bones connection hierarchy
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
    [0, 5], [5, 6], [6, 7], [7, 8],       // Index
    [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
    [9, 13], [13, 14], [14, 15], [15, 16],// Ring
    [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
    [0, 17]                               // Palm Base
  ];

  // Draw Bones (Lines in soft periwinkle)
  ctx.strokeStyle = 'rgba(184, 190, 221, 0.85)';
  ctx.lineWidth = 2.5;
  connections.forEach(([i, j]) => {
    ctx.beginPath();
    ctx.moveTo(joints[i].x, joints[i].y);
    ctx.lineTo(joints[j].x, joints[j].y);
    ctx.stroke();
  });

  // Draw Keypoint Nodes (Soft Pink Orchid and Blush Pop)
  for (let id in joints) {
    const pt = joints[id];
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, id === '0' || id === '4' || id === '8' || id === '12' ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = id === '0' || id === '4' || id === '8' || id === '12' ? '#f0a6ca' : '#efc3e6';
    ctx.fill();
    ctx.strokeStyle = '#3d3050';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawHudOverlays(ctx, width, height, frame) {
  // Bounding Box with tracking corners
  const bx = width / 2 - 110;
  const by = height / 2 - 130;
  const bw = 220;
  const bh = 260;

  ctx.strokeStyle = 'rgba(184, 190, 221, 0.35)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(bx, by, bw, bh);
  ctx.setLineDash([]);

  // Corner brackets
  const cornerLen = 14;
  ctx.strokeStyle = '#b8bedd';
  ctx.lineWidth = 2;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(bx, by + cornerLen);
  ctx.lineTo(bx, by);
  ctx.lineTo(bx + cornerLen, by);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(bx + bw - cornerLen, by);
  ctx.lineTo(bx + bw, by);
  ctx.lineTo(bx + bw, by + cornerLen);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(bx, by + bh - cornerLen);
  ctx.lineTo(bx, by + bh);
  ctx.lineTo(bx + cornerLen, by + bh);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(bx + bw - cornerLen, by + bh);
  ctx.lineTo(bx + bw, by + bh);
  ctx.lineTo(bx + bw, by + bh - cornerLen);
  ctx.stroke();

  // Telemetry Text
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText(`FPS: 60.0 | RES: ${width}x${height}`, 16, height - 16);
  ctx.fillText(`LANDMARKS: 21 DETECTED`, width - 150, height - 16);
}

function drawSimulatedHandPose(token) {
  // Visual cues update
  const cueBadge = document.getElementById('active-pose-badge');
  if (cueBadge) {
    cueBadge.textContent = `Pose: ${token}`;
  }
}

async function handleToggleCamera() {
  const videoElem = document.getElementById('webcam-video-element');
  const toggleBtn = document.getElementById('btn-toggle-camera');
  const cameraStateBadge = document.getElementById('camera-status-indicator');

  if (!state.isCameraActive) {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        state.webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } }
        });
        if (videoElem) {
          videoElem.srcObject = state.webcamStream;
          videoElem.play();
          videoElem.classList.remove('hidden');
        }
        state.isCameraActive = true;
        if (toggleBtn) toggleBtn.innerHTML = `<i data-lucide="video-off" class="w-4 h-4"></i> Stop Camera`;
        if (cameraStateBadge) {
          cameraStateBadge.textContent = 'LIVE WEBCAM ACTIVE';
          cameraStateBadge.classList.replace('text-zinc-400', 'text-zinc-100');
        }
        simulateGestureDetectionLoop();
      }
    } catch (err) {
      alert('Camera access could not be initialized or permission was denied. Falling back to OpenCV Simulator mode.');
    }
  } else {
    if (state.webcamStream) {
      state.webcamStream.getTracks().forEach(track => track.stop());
    }
    if (videoElem) {
      videoElem.classList.add('hidden');
      videoElem.srcObject = null;
    }
    state.isCameraActive = false;
    if (toggleBtn) toggleBtn.innerHTML = `<i data-lucide="video" class="w-4 h-4"></i> Start Real-Time Camera`;
    if (cameraStateBadge) {
      cameraStateBadge.textContent = 'OPENCV ENGINE READY';
    }
  }
  if (window.lucide) window.lucide.createIcons();
}

function simulateGestureDetectionLoop() {
  if (!state.isCameraActive) return;

  const sampleDetections = [
    { text: 'HELLO', conf: 96.4 },
    { text: 'THANK YOU', conf: 94.2 },
    { text: 'PLEASE', conf: 92.1 },
    { text: 'YES', conf: 98.0 },
    { text: 'HELP ME', conf: 95.7 }
  ];

  let step = 0;
  const interval = setInterval(() => {
    if (!state.isCameraActive) {
      clearInterval(interval);
      return;
    }
    const current = sampleDetections[step % sampleDetections.length];
    const transText = document.getElementById('detected-transcript-text');
    const confBadge = document.getElementById('detection-confidence-badge');

    if (transText) {
      transText.textContent = `${transText.textContent.trim()} ${current.text}`.trim();
    }
    if (confBadge) {
      confBadge.textContent = `Confidence: ${current.conf}%`;
    }
    step++;
  }, 4000);
}

// --- 8. Authentication Modal ("Manato Technique") ---
function initAuthModal() {
  const modalBackdrop = document.getElementById('auth-modal');
  const openButtons = document.querySelectorAll('[data-open-auth]');
  const closeButton = document.getElementById('close-auth-modal');
  const manatoSimBtn = document.getElementById('btn-manato-verify');
  const manatoStatus = document.getElementById('manato-status-text');

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalBackdrop) modalBackdrop.classList.add('open');
    });
  });

  if (closeButton && modalBackdrop) {
    closeButton.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
  }

  // Close on outside backdrop click
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });
  }

  // Simulated Manato Hand Authentication
  if (manatoSimBtn && manatoStatus) {
    manatoSimBtn.addEventListener('click', () => {
      manatoStatus.textContent = 'Scanning sign landmark pattern...';
      manatoSimBtn.disabled = true;

      setTimeout(() => {
        manatoStatus.textContent = 'Landmarks Matched! Manato Identity Verified.';
        setTimeout(() => {
          modalBackdrop.classList.remove('open');
          manatoSimBtn.disabled = false;
          manatoStatus.textContent = 'Hold custom sign gesture to authenticate';
          alert('Authenticated successfully via Manato Gesture Technique.');
        }, 1200);
      }, 1500);
    });
  }
}

// --- 9. Accessibility Controls ---
function initAccessibilityControls() {
  const highContrastToggle = document.getElementById('toggle-contrast');
  const fontIncreaseBtn = document.getElementById('btn-font-increase');
  const fontDecreaseBtn = document.getElementById('btn-font-decrease');

  if (highContrastToggle) {
    highContrastToggle.addEventListener('click', () => {
      state.isHighContrast = !state.isHighContrast;
      document.body.classList.toggle('high-contrast', state.isHighContrast);
      highContrastToggle.setAttribute('aria-pressed', state.isHighContrast);
    });
  }

}

// --- 10. Contact Form ---
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const feedbackMsg = document.getElementById('contact-success-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (feedbackMsg) {
        feedbackMsg.classList.remove('hidden');
        contactForm.reset();
        setTimeout(() => {
          feedbackMsg.classList.add('hidden');
        }, 4000);
      }
    });
  }
}
