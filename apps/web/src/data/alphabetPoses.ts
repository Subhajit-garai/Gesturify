/**
 * Gesturify - 21-Joint Anatomical Hand Landmark Poses for A–Z
 * Based on MediaPipe Hands skeletal landmark indexing:
 * 
 * 0: Wrist
 * 1: Thumb CMC, 2: Thumb MCP, 3: Thumb IP, 4: Thumb Tip
 * 5: Index MCP, 6: Index PIP, 7: Index DIP, 8: Index Tip
 * 9: Middle MCP, 10: Middle PIP, 11: Middle DIP, 12: Middle Tip
 * 13: Ring MCP, 14: Ring PIP, 15: Ring DIP, 16: Ring Tip
 * 17: Pinky MCP, 18: Pinky PIP, 19: Pinky DIP, 20: Pinky Tip
 * 
 * Coordinates are defined relative to the Wrist (0, 0):
 * - Negative Y extends upwards (fingers pointing towards head)
 * - Negative X extends leftwards (thumb side on right hand)
 * - Positive X extends rightwards (pinky side on right hand)
 */

export interface JointOffset {
  x: number;
  y: number;
}

export type HandPose21 = Record<number, JointOffset>;

// Standard Base MCP Anchors (Palm Base)
const BASE_MCP = {
  wrist: { x: 0, y: 0 },
  thumbCMC: { x: -30, y: -25 },
  thumbMCP: { x: -50, y: -50 },
  indexMCP: { x: -20, y: -65 },
  middleMCP: { x: 0, y: -70 },
  ringMCP: { x: 20, y: -65 },
  pinkyMCP: { x: 38, y: -55 },
};

// Curled Finger Templates (Closed Fist positions)
const CURLED_INDEX = {
  6: { x: -22, y: -90 },
  7: { x: -18, y: -75 },
  8: { x: -15, y: -60 },
};

const CURLED_MIDDLE = {
  10: { x: 0, y: -95 },
  11: { x: 0, y: -80 },
  12: { x: 0, y: -65 },
};

const CURLED_RING = {
  14: { x: 18, y: -90 },
  15: { x: 16, y: -75 },
  16: { x: 14, y: -60 },
};

const CURLED_PINKY = {
  18: { x: 34, y: -75 },
  19: { x: 30, y: -62 },
  20: { x: 26, y: -50 },
};

// Extended Straight Finger Templates (Upright positions)
const EXT_INDEX = {
  6: { x: -25, y: -110 },
  7: { x: -28, y: -145 },
  8: { x: -30, y: -178 },
};

const EXT_MIDDLE = {
  10: { x: 0, y: -120 },
  11: { x: 0, y: -160 },
  12: { x: 0, y: -195 },
};

const EXT_RING = {
  14: { x: 24, y: -110 },
  15: { x: 27, y: -145 },
  16: { x: 30, y: -178 },
};

const EXT_PINKY = {
  18: { x: 44, y: -90 },
  19: { x: 50, y: -120 },
  20: { x: 55, y: -148 },
};

export const ALPHABET_POSES: Record<string, HandPose21> = {
  // A: Closed fist with thumb straight upright along the side of the index finger
  A: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: BASE_MCP.thumbMCP,
    3: { x: -46, y: -82 },
    4: { x: -40, y: -108 }, // Thumb upright alongside index
    5: BASE_MCP.indexMCP, ...CURLED_INDEX,
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // B: Four fingers straight up touching together, thumb tucked across the palm
  B: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -32, y: -45 },
    3: { x: -16, y: -55 },
    4: { x: 0, y: -60 }, // Thumb folded across palm
    5: BASE_MCP.indexMCP,
    6: { x: -15, y: -110 }, 7: { x: -15, y: -148 }, 8: { x: -15, y: -182 }, // Fingers pressed tightly together
    9: BASE_MCP.middleMCP,
    10: { x: 0, y: -120 }, 11: { x: 0, y: -160 }, 12: { x: 0, y: -195 },
    13: BASE_MCP.ringMCP,
    14: { x: 15, y: -110 }, 15: { x: 15, y: -148 }, 16: { x: 15, y: -182 },
    17: BASE_MCP.pinkyMCP,
    18: { x: 30, y: -92 }, 19: { x: 30, y: -122 }, 20: { x: 30, y: -152 },
  },

  // C: All fingers and thumb curved into an arc facing outward
  C: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -45, y: -40 },
    3: { x: -35, y: -60 },
    4: { x: -15, y: -72 }, // Thumb tip curved
    5: BASE_MCP.indexMCP,
    6: { x: -28, y: -102 }, 7: { x: -12, y: -125 }, 8: { x: 10, y: -130 },
    9: BASE_MCP.middleMCP,
    10: { x: -5, y: -110 }, 11: { x: 15, y: -130 }, 12: { x: 35, y: -135 },
    13: BASE_MCP.ringMCP,
    14: { x: 15, y: -102 }, 15: { x: 35, y: -120 }, 16: { x: 50, y: -125 },
    17: BASE_MCP.pinkyMCP,
    18: { x: 35, y: -85 }, 19: { x: 50, y: -100 }, 20: { x: 60, y: -105 },
  },

  // D: Index finger straight up, thumb touches middle fingertip forming a lower circle
  D: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -35, y: -45 },
    3: { x: -20, y: -65 },
    4: { x: 0, y: -75 }, // Thumb touches middle
    5: BASE_MCP.indexMCP, ...EXT_INDEX, // Index straight up
    9: BASE_MCP.middleMCP,
    10: { x: 4, y: -98 }, 11: { x: 4, y: -88 }, 12: { x: 0, y: -75 }, // Middle curves to touch thumb
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // E: All 4 fingertips curled down tightly touching thumb edge
  E: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -32, y: -42 },
    3: { x: -15, y: -50 },
    4: { x: 6, y: -55 }, // Thumb tucked under curled fingertips
    5: BASE_MCP.indexMCP,
    6: { x: -22, y: -90 }, 7: { x: -15, y: -80 }, 8: { x: -10, y: -65 },
    9: BASE_MCP.middleMCP,
    10: { x: 0, y: -95 }, 11: { x: 0, y: -85 }, 12: { x: 0, y: -70 },
    13: BASE_MCP.ringMCP,
    14: { x: 18, y: -90 }, 15: { x: 15, y: -80 }, 16: { x: 10, y: -65 },
    17: BASE_MCP.pinkyMCP,
    18: { x: 32, y: -75 }, 19: { x: 28, y: -65 }, 20: { x: 20, y: -55 },
  },

  // F: Thumb and index finger tips touch to form a circle ("OK"), middle/ring/pinky extended upright
  F: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -38, y: -48 },
    3: { x: -25, y: -68 },
    4: { x: -15, y: -80 }, // Thumb touches index tip
    5: BASE_MCP.indexMCP,
    6: { x: -28, y: -90 }, 7: { x: -22, y: -88 }, 8: { x: -15, y: -80 }, // Index touches thumb
    9: BASE_MCP.middleMCP, ...EXT_MIDDLE,
    13: BASE_MCP.ringMCP, ...EXT_RING,
    17: BASE_MCP.pinkyMCP, ...EXT_PINKY,
  },

  // G: Index and thumb pointing horizontally forward like a pinch pointing left
  G: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -48, y: -45 },
    3: { x: -75, y: -55 },
    4: { x: -105, y: -60 }, // Thumb points horizontally
    5: BASE_MCP.indexMCP,
    6: { x: -55, y: -78 }, 7: { x: -90, y: -84 }, 8: { x: -125, y: -88 }, // Index points horizontally
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // H: Index and middle fingers extended together horizontally, thumb tucked below
  H: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -35, y: -45 },
    3: { x: -20, y: -55 },
    4: { x: -10, y: -65 },
    5: BASE_MCP.indexMCP,
    6: { x: -55, y: -82 }, 7: { x: -90, y: -90 }, 8: { x: -125, y: -95 }, // Index horizontal
    9: BASE_MCP.middleMCP,
    10: { x: -40, y: -72 }, 11: { x: -75, y: -78 }, 12: { x: -110, y: -82 }, // Middle horizontal
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // I: Pinky finger straight up, all other fingers curled into a fist with thumb folded over
  I: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -30, y: -45 },
    3: { x: -15, y: -55 },
    4: { x: 5, y: -62 }, // Thumb locked over curled fingers
    5: BASE_MCP.indexMCP, ...CURLED_INDEX,
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...EXT_PINKY, // Only pinky straight up
  },

  // J: Pinky extended with a curved, dynamic hook tracing
  J: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -30, y: -45 },
    3: { x: -15, y: -55 },
    4: { x: 5, y: -62 },
    5: BASE_MCP.indexMCP, ...CURLED_INDEX,
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP,
    18: { x: 48, y: -88 }, 19: { x: 62, y: -115 }, 20: { x: 74, y: -130 }, // Hook curve
  },

  // K: Index finger straight up, middle finger angled forward/downward, thumb upright between them
  K: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -38, y: -45 },
    3: { x: -22, y: -70 },
    4: { x: -10, y: -95 }, // Thumb upright between index and middle
    5: BASE_MCP.indexMCP, ...EXT_INDEX, // Index straight up
    9: BASE_MCP.middleMCP,
    10: { x: 8, y: -105 }, 11: { x: 22, y: -135 }, 12: { x: 36, y: -165 }, // Middle angled forward
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // L: Thumb and index finger form a 90-degree 'L' shape, other 3 fingers curled into palm
  L: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -50, y: -48 },
    3: { x: -75, y: -52 },
    4: { x: -105, y: -55 }, // Thumb 90-degree horizontal extension
    5: BASE_MCP.indexMCP, ...EXT_INDEX, // Index straight up
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // M: Thumb folded under first 3 fingers (index, middle, ring draped over thumb)
  M: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -25, y: -40 },
    3: { x: 0, y: -55 },
    4: { x: 22, y: -60 }, // Thumb reaches under ring finger
    5: BASE_MCP.indexMCP,
    6: { x: -20, y: -95 }, 7: { x: -15, y: -80 }, 8: { x: -10, y: -62 },
    9: BASE_MCP.middleMCP,
    10: { x: 2, y: -100 }, 11: { x: 4, y: -85 }, 12: { x: 5, y: -64 },
    13: BASE_MCP.ringMCP,
    14: { x: 20, y: -95 }, 15: { x: 20, y: -80 }, 16: { x: 18, y: -62 },
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // N: Thumb folded under first 2 fingers (index and middle draped over thumb)
  N: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -28, y: -42 },
    3: { x: -5, y: -55 },
    4: { x: 10, y: -60 }, // Thumb reaches under middle finger
    5: BASE_MCP.indexMCP,
    6: { x: -20, y: -95 }, 7: { x: -15, y: -80 }, 8: { x: -10, y: -62 },
    9: BASE_MCP.middleMCP,
    10: { x: 2, y: -100 }, 11: { x: 4, y: -85 }, 12: { x: 5, y: -64 },
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // O: All fingertips touch thumb tip forming a circular 'O'
  O: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -40, y: -45 },
    3: { x: -30, y: -70 },
    4: { x: -5, y: -85 }, // Thumb tip meets fingers
    5: BASE_MCP.indexMCP,
    6: { x: -25, y: -100 }, 7: { x: -15, y: -95 }, 8: { x: -5, y: -85 },
    9: BASE_MCP.middleMCP,
    10: { x: 0, y: -105 }, 11: { x: 0, y: -95 }, 12: { x: 0, y: -85 },
    13: BASE_MCP.ringMCP,
    14: { x: 18, y: -100 }, 15: { x: 12, y: -95 }, 16: { x: 5, y: -85 },
    17: BASE_MCP.pinkyMCP,
    18: { x: 30, y: -85 }, 19: { x: 22, y: -82 }, 20: { x: 10, y: -85 },
  },

  // P: Inverted K pointing downward towards floor
  P: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -35, y: -30 },
    3: { x: -20, y: -45 },
    4: { x: -10, y: -60 },
    5: BASE_MCP.indexMCP,
    6: { x: -35, y: -50 }, 7: { x: -65, y: -40 }, 8: { x: -95, y: -30 }, // Index pointing sideways/down
    9: BASE_MCP.middleMCP,
    10: { x: -10, y: -45 }, 11: { x: -20, y: -25 }, 12: { x: -30, y: -5 }, // Middle pointing down
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // Q: Inverted G pointing downwards
  Q: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -40, y: -35 },
    3: { x: -50, y: -20 },
    4: { x: -60, y: -5 }, // Thumb points down
    5: BASE_MCP.indexMCP,
    6: { x: -30, y: -40 }, 7: { x: -35, y: -20 }, 8: { x: -40, y: 5 }, // Index points down
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // R: Index and middle fingers crossed tightly for good luck
  R: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -30, y: -45 },
    3: { x: -15, y: -55 },
    4: { x: 5, y: -62 },
    5: BASE_MCP.indexMCP,
    6: { x: -15, y: -110 }, 7: { x: -5, y: -148 }, 8: { x: 8, y: -182 }, // Index crosses behind middle
    9: BASE_MCP.middleMCP,
    10: { x: -5, y: -118 }, 11: { x: -15, y: -155 }, 12: { x: -25, y: -188 }, // Middle crosses over index
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // S: Tight fist with thumb crossed over the front of all curled fingers
  S: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -28, y: -42 },
    3: { x: -5, y: -65 },
    4: { x: 18, y: -72 }, // Thumb locked OVER front of fingers
    5: BASE_MCP.indexMCP, ...CURLED_INDEX,
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // T: Thumb tucked between index and middle fingers
  T: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -30, y: -45 },
    3: { x: -18, y: -70 },
    4: { x: -10, y: -90 }, // Thumb tip peeking out between index and middle
    5: BASE_MCP.indexMCP,
    6: { x: -20, y: -98 }, 7: { x: -15, y: -82 }, 8: { x: -10, y: -65 }, // Index covers thumb
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // U: Index and middle fingers straight up and pressed tightly together (parallel)
  U: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -30, y: -45 },
    3: { x: -12, y: -58 },
    4: { x: 8, y: -65 }, // Thumb folds over ring
    5: BASE_MCP.indexMCP,
    6: { x: -12, y: -110 }, 7: { x: -10, y: -150 }, 8: { x: -8, y: -185 }, // Parallel closed
    9: BASE_MCP.middleMCP,
    10: { x: 2, y: -115 }, 11: { x: 4, y: -155 }, 12: { x: 6, y: -190 }, // Parallel closed
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // V: Index and middle fingers straight up spread into a V / Peace sign
  V: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -30, y: -45 },
    3: { x: -12, y: -58 },
    4: { x: 8, y: -65 },
    5: BASE_MCP.indexMCP,
    6: { x: -32, y: -110 }, 7: { x: -44, y: -148 }, 8: { x: -55, y: -182 }, // Index spreads left
    9: BASE_MCP.middleMCP,
    10: { x: 12, y: -115 }, 11: { x: 24, y: -155 }, 12: { x: 35, y: -190 }, // Middle spreads right
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // W: Index, middle, and ring fingers spread upward like a 'W'
  W: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -30, y: -45 },
    3: { x: 0, y: -55 },
    4: { x: 22, y: -60 }, // Thumb touches pinky
    5: BASE_MCP.indexMCP,
    6: { x: -32, y: -108 }, 7: { x: -44, y: -145 }, 8: { x: -55, y: -178 }, // Index spread left
    9: BASE_MCP.middleMCP, ...EXT_MIDDLE, // Middle straight
    13: BASE_MCP.ringMCP,
    14: { x: 32, y: -108 }, 15: { x: 44, y: -145 }, 16: { x: 55, y: -178 }, // Ring spread right
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY, // Pinky curled
  },

  // X: Index finger hooked like a hook, other fingers curled in fist
  X: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -32, y: -45 },
    3: { x: -15, y: -58 },
    4: { x: 5, y: -65 },
    5: BASE_MCP.indexMCP,
    6: { x: -25, y: -105 }, 7: { x: -15, y: -115 }, 8: { x: -8, y: -95 }, // Hooked index
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },

  // Y: Thumb and pinky extended wide outwards (hang loose), middle 3 fingers curled into palm
  Y: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -55, y: -45 },
    3: { x: -85, y: -55 },
    4: { x: -118, y: -65 }, // Thumb extended wide outward
    5: BASE_MCP.indexMCP, ...CURLED_INDEX,
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP,
    18: { x: 55, y: -80 }, 19: { x: 80, y: -105 }, 20: { x: 105, y: -128 }, // Pinky extended wide outward
  },

  // Z: Index finger extended pointing upward/diagonal (ready to trace Z)
  Z: {
    0: BASE_MCP.wrist,
    1: BASE_MCP.thumbCMC,
    2: { x: -32, y: -45 },
    3: { x: -15, y: -58 },
    4: { x: 5, y: -65 },
    5: BASE_MCP.indexMCP,
    6: { x: -30, y: -110 }, 7: { x: -38, y: -148 }, 8: { x: -45, y: -185 }, // Index extended
    9: BASE_MCP.middleMCP, ...CURLED_MIDDLE,
    13: BASE_MCP.ringMCP, ...CURLED_RING,
    17: BASE_MCP.pinkyMCP, ...CURLED_PINKY,
  },
};

export const SKELETON_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [5, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [9, 13], [13, 14], [14, 15], [15, 16],
  // Pinky & Palm
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];
