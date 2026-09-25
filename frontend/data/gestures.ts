export interface AlphabetItem {
  char: string;
  name: string;
  desc: string;
  cues: string;
}

export interface WordItem {
  word: string;
  category: string;
  desc: string;
  duration: string;
}

export interface SentenceTemplate {
  spoken: string;
  aslGrammar: string;
  tokens: string[];
  rule: string;
}

export interface GrammarRule {
  title: string;
  explanation: string;
  example: string;
}

export const ALPHABETS: AlphabetItem[] = [
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
];

export const WORDS: WordItem[] = [
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
  { word: 'Silence', category: 'Communication', desc: 'Crossed hands in front of mouth separate gently downwards into flat open palms.', duration: '1.8s' }
];

export const SENTENCE_TEMPLATES: SentenceTemplate[] = [
  {
    spoken: 'Hello, my name is Alex.',
    aslGrammar: 'HELLO, MY NAME A-L-E-X.',
    tokens: ['HELLO', 'MY', 'NAME', 'ALEX'],
    rule: 'Topic-Comment Structure: Introduction starts with the greeting followed by direct identity reference.'
  },
  {
    spoken: 'Where is the nearest hospital?',
    aslGrammar: 'HOSPITAL NEAR WHERE?',
    tokens: ['HOSPITAL', 'NEAR', 'WHERE'],
    rule: 'WH-Question Rule: Wh-words (Where, What, Who) are placed at the end of the sentence with lowered furrowed eyebrows.'
  },
  {
    spoken: 'Can you help me please?',
    aslGrammar: 'PLEASE HELP ME YOU?',
    tokens: ['PLEASE', 'HELP-ME', 'YOU'],
    rule: 'Directional Verbs: "Help" moves from the person helping towards the person receiving assistance.'
  },
  {
    spoken: 'I do not understand sign language.',
    aslGrammar: 'SIGN LANGUAGE I UNDERSTAND NOT.',
    tokens: ['SIGN', 'LANGUAGE', 'I', 'UNDERSTAND', 'NOT'],
    rule: 'Negation Syntax: The negative particle "NOT" or headshake accompanies the verb at the sentence conclusion.'
  }
];

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    title: '1. Topic - Comment Order',
    explanation: 'Unlike spoken English (Subject-Verb-Object), sign language often states the main topic first, followed by comments or questions regarding that topic.',
    example: 'English: "I am reading a book." → Sign: "BOOK, I READ."'
  },
  {
    title: '2. WH-Question Positioning',
    explanation: 'Questions involving Who, What, Where, When, and Why place the question particle at the end of the sentence accompanied by furrowed eyebrows.',
    example: 'English: "Where is the bathroom?" → Sign: "BATHROOM WHERE?"'
  },
  {
    title: '3. Directional & Spatial Verbs',
    explanation: 'Verbs like GIVE, HELP, and SHOW change trajectory in physical 3D space to indicate who acts upon whom, eliminating auxiliary pronouns.',
    example: 'Move hand from helper to receiver to signify "HELP-YOU".'
  },
  {
    title: '4. Facial Grammar & Non-Manual Markers (NMM)',
    explanation: 'Facial expressions (eyebrow tilts, head nods, mouth shapes) are core grammatical operators for conditional questions, assertions, and tone.',
    example: 'Raised eyebrows indicate Yes/No questions; furrowed eyebrows signify WH-questions.'
  }
];
