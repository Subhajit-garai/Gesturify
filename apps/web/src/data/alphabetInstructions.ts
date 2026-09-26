export interface AlphabetInstruction {
  char: string;
  name: string;
  category: "Fist" | "Flat Open" | "Curved / Arc" | "Pointing" | "Spread" | "Pinch";
  summary: string;
  steps: string[];
  proTip: string;
}

export const ALPHABET_INSTRUCTIONS: Record<string, AlphabetInstruction> = {
  A: {
    char: "A",
    name: "Letter A",
    category: "Fist",
    summary: "Tight fist with thumb resting straight upright along the outer side of the index finger.",
    steps: [
      "Curl all four fingers (index to pinky) firmly into your palm.",
      "Keep your thumb straight and upright, resting against the outer edge of your index finger.",
      "Hold your palm facing outward toward the observer with wrist straight."
    ],
    proTip: "Keep your thumb on the SIDE of your fist. If your thumb crosses over your fingers, that is Letter S!"
  },
  B: {
    char: "B",
    name: "Letter B",
    category: "Flat Open",
    summary: "Four fingers extended straight up touching together, with thumb folded flat across palm.",
    steps: [
      "Extend index, middle, ring, and pinky fingers straight upward toward the ceiling.",
      "Press all four fingers tightly together with zero gaps between them.",
      "Fold your thumb flat across the lower portion of your palm."
    ],
    proTip: "Keep fingers strictly straight and closed together. Thumb must be folded across the palm, not sticking out."
  },
  C: {
    char: "C",
    name: "Letter C",
    category: "Curved / Arc",
    summary: "All fingers and thumb curved into a smooth half-circle arc forming a visible letter 'C'.",
    steps: [
      "Curve all four fingers forward and downward in a smooth arc.",
      "Curve your thumb downward opposite your fingertips like holding a beverage cup.",
      "Turn your hand slightly sideways so the observer clearly sees the open 'C' profile."
    ],
    proTip: "Ensure a generous round opening between your fingertips and thumb tip."
  },
  D: {
    char: "D",
    name: "Letter D",
    category: "Pointing",
    summary: "Index finger points straight up, while thumb touches middle fingertip forming a circular base.",
    steps: [
      "Point your index finger straight up toward the ceiling.",
      "Curl your middle, ring, and pinky fingers downward.",
      "Touch the tip of your thumb to the tip of your curled middle finger to form a round circle."
    ],
    proTip: "Only ONE finger points up. If both index and middle are up, that is Letter K or V!"
  },
  E: {
    char: "E",
    name: "Letter E",
    category: "Fist",
    summary: "Compact fist with all 4 fingertips curled tightly down resting along the edge of folded thumb.",
    steps: [
      "Fold your thumb horizontally across your palm.",
      "Bend all four fingers at the knuckles and rest their tips directly along the top edge of your thumb.",
      "Keep your hand compact and facing outward."
    ],
    proTip: "Fingertips must visibly rest ON the thumb edge; do not tuck them into a hidden fist."
  },
  F: {
    char: "F",
    name: "Letter F",
    category: "Pinch",
    summary: "Thumb and index tips touch forming an 'OK' circle, with remaining 3 fingers spread straight up.",
    steps: [
      "Touch the tip of your index finger to the tip of your thumb, forming a round circle.",
      "Extend your middle, ring, and pinky fingers straight up.",
      "Spread the three upright fingers slightly apart."
    ],
    proTip: "Looks like the standard 'OK' hand gesture held upright with palm forward."
  },
  G: {
    char: "G",
    name: "Letter G",
    category: "Pinch",
    summary: "Index finger and thumb pointing horizontally sideways parallel to each other like a pinch.",
    steps: [
      "Make a fist with your middle, ring, and pinky fingers curled tightly.",
      "Extend your index finger horizontally pointing toward your non-dominant side.",
      "Extend your thumb parallel along the bottom of the index finger with a small gap between them."
    ],
    proTip: "Both fingers point horizontally sideways, never vertically upward."
  },
  H: {
    char: "H",
    name: "Letter H",
    category: "Pointing",
    summary: "Index and middle fingers extended together horizontally pointing sideways.",
    steps: [
      "Extend index and middle fingers straight out horizontally and press them tightly together.",
      "Curl your ring and pinky fingers firmly into your palm.",
      "Tuck your thumb flat against the base of your middle finger."
    ],
    proTip: "Like Letter G, but with TWO fingers extended parallel together instead of one."
  },
  I: {
    char: "I",
    name: "Letter I",
    category: "Pointing",
    summary: "Only pinky finger extended straight up, with all other fingers curled into a fist locked by thumb.",
    steps: [
      "Curl your index, middle, and ring fingers tightly into your palm.",
      "Lock your thumb firmly across the folded index, middle, and ring fingers.",
      "Extend your pinky finger straight up toward the ceiling."
    ],
    proTip: "Only the pinky stands upright. Make sure thumb is firmly locked over the curled knuckles."
  },
  J: {
    char: "J",
    name: "Letter J",
    category: "Pointing",
    summary: "Pinky extended upright, tracing a smooth hook/curve 'J' downward and up in the air.",
    steps: [
      "Start with the Letter I handshape (only pinky upright, others in a fist).",
      "Dip your hand downward and curve smoothly upward to the left, tracing the letter 'J'.",
      "End the stroke with palm facing slightly toward you."
    ],
    proTip: "This is one of only two dynamic moving letters in the alphabet (along with Letter Z)."
  },
  K: {
    char: "K",
    name: "Letter K",
    category: "Spread",
    summary: "Index finger straight up, middle finger angled forward, thumb upright wedged between them.",
    steps: [
      "Extend your index finger straight up.",
      "Extend your middle finger angled slightly forward at about 45 degrees.",
      "Place your thumb upright so its tip rests directly between the index and middle knuckles."
    ],
    proTip: "Thumb is placed vertically between index and middle. When viewed from the side, it forms a 'K'."
  },
  L: {
    char: "L",
    name: "Letter L",
    category: "Pointing",
    summary: "Thumb and index finger form a sharp 90-degree 'L' shape, with other fingers curled in palm.",
    steps: [
      "Point your index finger straight up toward the ceiling.",
      "Extend your thumb horizontally straight out to the side at a 90-degree right angle.",
      "Curl your middle, ring, and pinky fingers tightly into your palm."
    ],
    proTip: "Hold palm facing outward so the observer sees a perfectly formed letter 'L'."
  },
  M: {
    char: "M",
    name: "Letter M",
    category: "Fist",
    summary: "Thumb folded under first three fingers (index, middle, ring draped over thumb).",
    steps: [
      "Fold your thumb across your palm until its tip reaches under your ring finger.",
      "Fold your index, middle, and ring fingers down over the thumb.",
      "Curl your pinky finger beside them."
    ],
    proTip: "Count 3 knuckles draped over the thumb: index, middle, and ring (M has 3 legs!)."
  },
  N: {
    char: "N",
    name: "Letter N",
    category: "Fist",
    summary: "Thumb folded under first two fingers (index and middle draped over thumb).",
    steps: [
      "Fold your thumb across your palm until its tip reaches under your middle finger.",
      "Fold your index and middle fingers down over the thumb.",
      "Curl your ring and pinky fingers beside them."
    ],
    proTip: "Count 2 knuckles draped over the thumb: index and middle (N has 2 legs!)."
  },
  O: {
    char: "O",
    name: "Letter O",
    category: "Pinch",
    summary: "All five fingertips touch thumb tip forming a closed circular 'O' opening.",
    steps: [
      "Curve all four fingers forward and downward.",
      "Bring your thumb tip up to meet all four fingertips.",
      "Keep a clear, round circular opening visible through your hand."
    ],
    proTip: "Unlike Letter C (open arc), in Letter O all fingertips physically touch the thumb to close the circle."
  },
  P: {
    char: "P",
    name: "Letter P",
    category: "Pointing",
    summary: "Inverted Letter K pointing downward toward the ground.",
    steps: [
      "Form the Letter K handshape (index straight, middle angled, thumb between).",
      "Rotate your wrist downward so your index finger points toward the floor.",
      "Middle finger points slightly inward and down."
    ],
    proTip: "It is identical to Letter K, but flipped upside-down pointing down toward the ground."
  },
  Q: {
    char: "Q",
    name: "Letter Q",
    category: "Pinch",
    summary: "Inverted Letter G pointing downward toward the ground.",
    steps: [
      "Form the Letter G handshape (index and thumb extended like a pinch).",
      "Tilt your hand downward so both index and thumb point toward the floor.",
      "Keep middle, ring, and pinky fingers curled tightly into your palm."
    ],
    proTip: "It is the downward-pointing counterpart to Letter G."
  },
  R: {
    char: "R",
    name: "Letter R",
    category: "Pointing",
    summary: "Index and middle fingers crossed tightly over each other (good luck sign).",
    steps: [
      "Extend your index and middle fingers straight up.",
      "Cross your middle finger tightly over in front of your index finger.",
      "Curl your ring and pinky fingers into your palm, locked down by your thumb."
    ],
    proTip: "Think of crossing your fingers for good luck!"
  },
  S: {
    char: "S",
    name: "Letter S",
    category: "Fist",
    summary: "Tight fist with thumb crossed firmly OVER the front of all curled fingers.",
    steps: [
      "Curl all four fingers tightly into your palm.",
      "Wrap your thumb across the middle knuckles of your index, middle, and ring fingers.",
      "Squeeze into a tight, compact fist."
    ],
    proTip: "In Letter A, the thumb rests on the SIDE. In Letter S, the thumb wraps across the FRONT."
  },
  T: {
    char: "T",
    name: "Letter T",
    category: "Fist",
    summary: "Thumb tucked between index and middle fingers, peeking out between knuckles.",
    steps: [
      "Make a fist, but slide your thumb between your index and middle fingers.",
      "Wrap your index finger over the top of the thumb tip.",
      "Middle, ring, and pinky remain curled into the palm."
    ],
    proTip: "Only ONE finger (index) folds over the thumb (T = 1 knuckle over thumb)."
  },
  U: {
    char: "U",
    name: "Letter U",
    category: "Pointing",
    summary: "Index and middle fingers straight up and pressed tightly together (parallel closed).",
    steps: [
      "Extend your index and middle fingers straight up toward the ceiling.",
      "Press both fingers tightly together so there is no gap between them.",
      "Curl your ring and pinky fingers, locked down by your thumb."
    ],
    proTip: "Unlike Letter V (spread apart), in Letter U both fingers are pressed tightly together."
  },
  V: {
    char: "V",
    name: "Letter V",
    category: "Spread",
    summary: "Index and middle fingers straight up spread into a V / Peace sign.",
    steps: [
      "Extend your index and middle fingers straight up.",
      "Spread both fingers wide apart forming a clear 'V' shape.",
      "Curl your ring and pinky fingers into your palm, locked by your thumb."
    ],
    proTip: "The classic peace sign facing outward with palm toward the viewer."
  },
  W: {
    char: "W",
    name: "Letter W",
    category: "Spread",
    summary: "Index, middle, and ring fingers spread upward like the letter 'W'.",
    steps: [
      "Extend your index, middle, and ring fingers straight up.",
      "Spread all three fingers evenly apart to form a 'W'.",
      "Curl your pinky finger down and hold it securely with your thumb tip."
    ],
    proTip: "Three fingers spread upright; thumb holds down ONLY the pinky finger."
  },
  X: {
    char: "X",
    name: "Letter X",
    category: "Pointing",
    summary: "Index finger bent into a hooked claw/pirate hook, other fingers curled into a fist.",
    steps: [
      "Curl your middle, ring, and pinky fingers into your palm.",
      "Extend your index finger, then bend it at the second knuckle into a hook.",
      "Rest your thumb against your curled middle finger."
    ],
    proTip: "Think of a bent finger gesturing 'come here' or Captain Hook's claw."
  },
  Y: {
    char: "Y",
    name: "Letter Y",
    category: "Spread",
    summary: "Thumb and pinky extended wide outwards (hang loose / phone sign).",
    steps: [
      "Extend your thumb as far out to the side as possible.",
      "Extend your pinky finger as far out to the opposite side as possible.",
      "Curl your middle three fingers (index, middle, ring) tightly into your palm."
    ],
    proTip: "The classic 'hang loose' (shaka) or 'call me' telephone gesture."
  },
  Z: {
    char: "Z",
    name: "Letter Z",
    category: "Pointing",
    summary: "Index finger extended pointing upward/forward, tracing the letter 'Z' in the air.",
    steps: [
      "Make a fist and extend your index finger like pointing a laser.",
      "In the air in front of you, trace the letter 'Z': horizontal right, diagonal down-left, horizontal right.",
      "Keep your wrist moving smoothly to draw the shape."
    ],
    proTip: "One of only two dynamic moving letters in the alphabet (along with Letter J)."
  }
};

export function getAlphabetInstruction(char: string): AlphabetInstruction {
  const key = (char || "A").toUpperCase().trim().charAt(0) || "A";
  return ALPHABET_INSTRUCTIONS[key] || ALPHABET_INSTRUCTIONS["A"];
}
