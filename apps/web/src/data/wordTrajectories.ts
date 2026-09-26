import { ALPHABET_POSES, HandPose21, JointOffset } from "./alphabetPoses";

export type BodyAnchor = "TEMPLE" | "CHIN" | "MOUTH" | "CHEST" | "ARM" | "NEUTRAL";

export interface TrajectoryKeyframe {
  progress: number; // 0.0 to 1.0
  rightWrist: JointOffset; // Offset relative to body center (cx, cy)
  rightPose: HandPose21;
  leftWrist?: JointOffset;
  leftPose?: HandPose21;
}

export interface WordTrajectory {
  id: string;
  word: string;
  category: string;
  bodyAnchor: BodyAnchor;
  anchorOffset: JointOffset; // Relative to body center (cx, cy)
  summary: string;
  steps: string[];
  proTip: string;
  isTwoHanded: boolean;
  durationMs: number;
  keyframes: TrajectoryKeyframe[];
}

// Mirror right handpose to create left handpose
function mirrorHandPose(pose: HandPose21): HandPose21 {
  const mirrored: HandPose21 = {};
  for (let i = 0; i <= 20; i++) {
    const pt = pose[i] || { x: 0, y: 0 };
    mirrored[i] = { x: -pt.x, y: pt.y };
  }
  return mirrored;
}

// Flat Open Hand (like B or Open Palm)
const FLAT_HAND = ALPHABET_POSES["B"];
// Closed Fist (like S)
const FIST_HAND = ALPHABET_POSES["S"];
// Thumbs Up Fist (like Good / A modified)
const THUMBS_UP = {
  ...ALPHABET_POSES["A"],
  4: { x: -45, y: -125 }, // Thumb extended higher straight up
};
// Water 'W' Hand
const W_HAND = ALPHABET_POSES["W"];
// Bunched 'O' Hand
const BUNCHED_HAND = ALPHABET_POSES["O"];
// Index Point 'D'
const POINT_HAND = ALPHABET_POSES["D"];
// Two Finger 'H'
const H_HAND = ALPHABET_POSES["H"];

export const WORD_TRAJECTORIES: Record<string, WordTrajectory> = {
  HELLO: {
    id: "HELLO",
    word: "Hello",
    category: "Greetings",
    bodyAnchor: "TEMPLE",
    anchorOffset: { x: 40, y: -80 }, // Near right temple
    summary: "Flat open hand touches near the temple, then salutes smoothly outward and down.",
    steps: [
      "Place your flat open hand with fingers together near your right temple/forehead.",
      "Sweep your hand forward, outward, and slightly downward toward the listener like a polite salute.",
      "End with your palm facing slightly forward and fingers relaxed."
    ],
    proTip: "Keep the movement smooth and confident. Do not bend your wrist abruptly; the forearm drives the salute.",
    isTwoHanded: false,
    durationMs: 1400,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 38, y: 15 }, rightPose: FLAT_HAND },
      { progress: 0.2, rightWrist: { x: 42, y: 12 }, rightPose: FLAT_HAND },
      { progress: 0.65, rightWrist: { x: 80, y: 35 }, rightPose: FLAT_HAND },
      { progress: 0.85, rightWrist: { x: 85, y: 38 }, rightPose: FLAT_HAND },
      { progress: 1.0, rightWrist: { x: 38, y: 15 }, rightPose: FLAT_HAND },
    ],
  },

  THANK_YOU: {
    id: "THANK_YOU",
    word: "Thank You",
    category: "Courtesy",
    bodyAnchor: "CHIN",
    anchorOffset: { x: 0, y: -35 }, // At chin
    summary: "Fingertips of flat dominant hand touch the chin, then glide forward and down toward listener.",
    steps: [
      "Bring the fingertips of your flat dominant hand to gently touch your chin or lips.",
      "Sweep your hand forward and downward in a graceful arc extending toward the other person.",
      "End with palm facing slightly upward as a sign of offering gratitude."
    ],
    proTip: "Start precisely at the chin. Moving from the forehead is 'Hello', moving from the chin is 'Thank You'!",
    isTwoHanded: false,
    durationMs: 1500,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 0, y: 65 }, rightPose: FLAT_HAND },
      { progress: 0.2, rightWrist: { x: 0, y: 60 }, rightPose: FLAT_HAND },
      { progress: 0.65, rightWrist: { x: 25, y: 105 }, rightPose: FLAT_HAND },
      { progress: 0.85, rightWrist: { x: 25, y: 110 }, rightPose: FLAT_HAND },
      { progress: 1.0, rightWrist: { x: 0, y: 65 }, rightPose: FLAT_HAND },
    ],
  },

  PLEASE: {
    id: "PLEASE",
    word: "Please",
    category: "Courtesy",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 35 }, // At center chest
    summary: "Flat open hand placed firmly on center chest, making a clockwise circular respectful motion.",
    steps: [
      "Place your flat dominant hand with fingers together against the center of your chest.",
      "Move your hand in a continuous clockwise circle across your sternum.",
      "Complete 2 smooth circular rotations with gentle contact."
    ],
    proTip: "Keep your hand flat against the chest. The circle moves clockwise (up, right, down, left).",
    isTwoHanded: false,
    durationMs: 1600,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 0, y: 60 }, rightPose: FLAT_HAND },
      { progress: 0.25, rightWrist: { x: 25, y: 45 }, rightPose: FLAT_HAND },
      { progress: 0.5, rightWrist: { x: 0, y: 75 }, rightPose: FLAT_HAND },
      { progress: 0.75, rightWrist: { x: -25, y: 60 }, rightPose: FLAT_HAND },
      { progress: 1.0, rightWrist: { x: 0, y: 60 }, rightPose: FLAT_HAND },
    ],
  },

  HELP: {
    id: "HELP",
    word: "Help",
    category: "Essential",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 45 },
    summary: "Thumbs-up fist rests on the open flat palm of the non-dominant hand, lifted together upward.",
    steps: [
      "Extend your non-dominant hand flat, palm facing up at chest height.",
      "Make a 'thumbs-up' fist with your dominant hand and place it firmly onto the open palm.",
      "Lift both hands upward together by 4 to 6 inches, indicating giving support or lifting someone up."
    ],
    proTip: "This is a two-handed gesture. The flat palm acts as a platform lifting the fist upward.",
    isTwoHanded: true,
    durationMs: 1500,
    keyframes: [
      {
        progress: 0.0,
        rightWrist: { x: 10, y: 65 }, rightPose: THUMBS_UP,
        leftWrist: { x: -10, y: 85 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 0.2,
        rightWrist: { x: 10, y: 65 }, rightPose: THUMBS_UP,
        leftWrist: { x: -10, y: 85 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 0.65,
        rightWrist: { x: 10, y: 25 }, rightPose: THUMBS_UP,
        leftWrist: { x: -10, y: 45 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 0.85,
        rightWrist: { x: 10, y: 25 }, rightPose: THUMBS_UP,
        leftWrist: { x: -10, y: 45 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 1.0,
        rightWrist: { x: 10, y: 65 }, rightPose: THUMBS_UP,
        leftWrist: { x: -10, y: 85 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
    ],
  },

  YES: {
    id: "YES",
    word: "Yes",
    category: "Basic",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 30, y: 35 },
    summary: "Closed fist held at chest height, nodding up and down from the wrist like a nodding head.",
    steps: [
      "Make an 'S' shape fist with your dominant hand held at chest height.",
      "Tilt your fist downward at the wrist, then back up.",
      "Repeat the nodding motion twice in quick succession."
    ],
    proTip: "Simulates a nodding head. Only the wrist bends up and down, your forearm remains steady.",
    isTwoHanded: false,
    durationMs: 1200,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 30, y: 45 }, rightPose: FIST_HAND },
      { progress: 0.25, rightWrist: { x: 30, y: 68 }, rightPose: FIST_HAND }, // Nod 1 down
      { progress: 0.5, rightWrist: { x: 30, y: 45 }, rightPose: FIST_HAND },  // Up
      { progress: 0.75, rightWrist: { x: 30, y: 68 }, rightPose: FIST_HAND }, // Nod 2 down
      { progress: 1.0, rightWrist: { x: 30, y: 45 }, rightPose: FIST_HAND },  // Reset
    ],
  },

  NO: {
    id: "NO",
    word: "No",
    category: "Basic",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 25, y: 35 },
    summary: "Index and middle fingers snap down onto thumb twice in a quick, firm snapping motion.",
    steps: [
      "Hold index and middle fingers extended forward with thumb held open below them.",
      "Snap index and middle fingers down firmly onto the thumb pad.",
      "Open slightly and snap shut a second time."
    ],
    proTip: "Think of an opening and closing bird beak snapping shut twice firmly.",
    isTwoHanded: false,
    durationMs: 1200,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 25, y: 50 }, rightPose: ALPHABET_POSES["V"] },
      { progress: 0.25, rightWrist: { x: 25, y: 50 }, rightPose: ALPHABET_POSES["O"] }, // Snap shut
      { progress: 0.5, rightWrist: { x: 25, y: 50 }, rightPose: ALPHABET_POSES["V"] },  // Open
      { progress: 0.75, rightWrist: { x: 25, y: 50 }, rightPose: ALPHABET_POSES["O"] }, // Snap shut
      { progress: 1.0, rightWrist: { x: 25, y: 50 }, rightPose: ALPHABET_POSES["V"] },  // Reset
    ],
  },

  WATER: {
    id: "WATER",
    word: "Water",
    category: "Daily Life",
    bodyAnchor: "CHIN",
    anchorOffset: { x: 0, y: -35 },
    summary: "Three fingers form a 'W' handshape and tap index finger gently against chin twice.",
    steps: [
      "Form the letter 'W' with your dominant hand (index, middle, and ring extended spread).",
      "Bring the side of your index finger to tap gently against your chin.",
      "Pull back slightly and tap your chin a second time."
    ],
    proTip: "The 'W' finger configuration directly taps the chin twice. Keep pinky tucked with thumb.",
    isTwoHanded: false,
    durationMs: 1300,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 15, y: 65 }, rightPose: W_HAND },
      { progress: 0.25, rightWrist: { x: 0, y: 58 }, rightPose: W_HAND }, // Tap 1
      { progress: 0.5, rightWrist: { x: 15, y: 65 }, rightPose: W_HAND },  // Pull back
      { progress: 0.75, rightWrist: { x: 0, y: 58 }, rightPose: W_HAND }, // Tap 2
      { progress: 1.0, rightWrist: { x: 15, y: 65 }, rightPose: W_HAND },
    ],
  },

  EAT: {
    id: "EAT",
    word: "Eat",
    category: "Daily Life",
    bodyAnchor: "MOUTH",
    anchorOffset: { x: 0, y: -50 }, // Near mouth
    summary: "Fingertips pressed together (flat-O shape) tap near the mouth twice like putting food in.",
    steps: [
      "Bunch all four fingertips together touching your thumb tip (flat-O shape).",
      "Move the bunched fingertips toward your mouth and tap gently twice.",
      "Keep palm facing toward your face."
    ],
    proTip: "Simulates holding a small bite of food and bringing it toward your mouth.",
    isTwoHanded: false,
    durationMs: 1300,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 15, y: 20 }, rightPose: BUNCHED_HAND },
      { progress: 0.25, rightWrist: { x: 0, y: 10 }, rightPose: BUNCHED_HAND }, // Tap mouth 1
      { progress: 0.5, rightWrist: { x: 15, y: 20 }, rightPose: BUNCHED_HAND },  // Pull back
      { progress: 0.75, rightWrist: { x: 0, y: 10 }, rightPose: BUNCHED_HAND }, // Tap mouth 2
      { progress: 1.0, rightWrist: { x: 15, y: 20 }, rightPose: BUNCHED_HAND },
    ],
  },

  UNDERSTAND: {
    id: "UNDERSTAND",
    word: "Understand",
    category: "Communication",
    bodyAnchor: "TEMPLE",
    anchorOffset: { x: 40, y: -80 },
    summary: "Fist held by temple, index finger flicks straight up like a lightbulb turning on.",
    steps: [
      "Hold a loose fist near your right temple with palm facing toward your head.",
      "Flick your index finger straight up into an extended point.",
      "Hold for a brief moment to signify a concept 'clicking' or turning on."
    ],
    proTip: "The flick of the index finger represents a lightbulb clicking on in your head!",
    isTwoHanded: false,
    durationMs: 1400,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 40, y: -35 }, rightPose: FIST_HAND },
      { progress: 0.3, rightWrist: { x: 40, y: -35 }, rightPose: FIST_HAND },
      { progress: 0.6, rightWrist: { x: 40, y: -45 }, rightPose: POINT_HAND }, // Flick open
      { progress: 0.85, rightWrist: { x: 40, y: -45 }, rightPose: POINT_HAND },
      { progress: 1.0, rightWrist: { x: 40, y: -35 }, rightPose: FIST_HAND },
    ],
  },

  EMERGENCY: {
    id: "EMERGENCY",
    word: "Emergency",
    category: "Safety",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 35 },
    summary: "Hand in 'E' handshape shakes rapidly from side to side at chest height.",
    steps: [
      "Form the letter 'E' with your dominant hand (fingertips curled over thumb).",
      "Hold your hand at center chest height.",
      "Shake your hand rapidly side-to-side in urgent, quick vibrations."
    ],
    proTip: "Maintain an urgent, rapid side-to-side oscillation to clearly communicate alarm.",
    isTwoHanded: false,
    durationMs: 1500,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 0, y: 55 }, rightPose: ALPHABET_POSES["E"] },
      { progress: 0.2, rightWrist: { x: -25, y: 55 }, rightPose: ALPHABET_POSES["E"] },
      { progress: 0.4, rightWrist: { x: 25, y: 55 }, rightPose: ALPHABET_POSES["E"] },
      { progress: 0.6, rightWrist: { x: -25, y: 55 }, rightPose: ALPHABET_POSES["E"] },
      { progress: 0.8, rightWrist: { x: 25, y: 55 }, rightPose: ALPHABET_POSES["E"] },
      { progress: 1.0, rightWrist: { x: 0, y: 55 }, rightPose: ALPHABET_POSES["E"] },
    ],
  },

  HOSPITAL: {
    id: "HOSPITAL",
    word: "Hospital",
    category: "Safety",
    bodyAnchor: "ARM",
    anchorOffset: { x: -75, y: 10 }, // Left upper arm / shoulder
    summary: "Index and middle fingers in 'H' shape draw a small cross on opposite upper arm.",
    steps: [
      "Form the letter 'H' with your right hand (index and middle fingers extended together).",
      "Touch your left upper arm / shoulder and draw a vertical line downward.",
      "Cross it by drawing a horizontal line across the vertical stroke (forming a red cross)."
    ],
    proTip: "Traces the universal medical cross on your opposite arm.",
    isTwoHanded: false,
    durationMs: 1700,
    keyframes: [
      { progress: 0.0, rightWrist: { x: -50, y: 25 }, rightPose: H_HAND },
      { progress: 0.35, rightWrist: { x: -50, y: 55 }, rightPose: H_HAND }, // Vertical stroke
      { progress: 0.5, rightWrist: { x: -65, y: 40 }, rightPose: H_HAND },  // Start horizontal
      { progress: 0.8, rightWrist: { x: -35, y: 40 }, rightPose: H_HAND },  // Cross stroke
      { progress: 1.0, rightWrist: { x: -50, y: 25 }, rightPose: H_HAND },
    ],
  },

  QUIET: {
    id: "QUIET",
    word: "Quiet / Silence",
    category: "Communication",
    bodyAnchor: "MOUTH",
    anchorOffset: { x: 0, y: -45 },
    summary: "Both hands cross in front of mouth with index fingers, then gently separate downward into open palms.",
    steps: [
      "Bring both hands up in front of your mouth with index fingers crossed in an 'X' shape.",
      "Gently separate your hands outward and downward.",
      "Open into flat downward-facing palms settling at chest height (signifying calm/quiet)."
    ],
    proTip: "Begin tightly crossed at the mouth, then smoothly expand downward into stillness.",
    isTwoHanded: true,
    durationMs: 1800,
    keyframes: [
      {
        progress: 0.0,
        rightWrist: { x: 15, y: 40 }, rightPose: POINT_HAND,
        leftWrist: { x: -15, y: 40 }, leftPose: mirrorHandPose(POINT_HAND),
      },
      {
        progress: 0.25,
        rightWrist: { x: 15, y: 40 }, rightPose: POINT_HAND,
        leftWrist: { x: -15, y: 40 }, leftPose: mirrorHandPose(POINT_HAND),
      },
      {
        progress: 0.7,
        rightWrist: { x: 70, y: 85 }, rightPose: FLAT_HAND,
        leftWrist: { x: -70, y: 85 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 0.9,
        rightWrist: { x: 70, y: 85 }, rightPose: FLAT_HAND,
        leftWrist: { x: -70, y: 85 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 1.0,
        rightWrist: { x: 15, y: 40 }, rightPose: POINT_HAND,
        leftWrist: { x: -15, y: 40 }, leftPose: mirrorHandPose(POINT_HAND),
      },
    ],
  },

  MY: {
    id: "MY",
    word: "My",
    category: "Pronouns",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 35 },
    summary: "Flat open hand pressed gently against the center of the chest indicating possession.",
    steps: [
      "Open your dominant hand flat with fingers together.",
      "Place your palm flat against the center of your chest.",
      "Hold firmly to indicate 'Mine' or 'My'."
    ],
    proTip: "Flat palm indicates possession ('My'). An index finger pointing to chest indicates 'I/Me'.",
    isTwoHanded: false,
    durationMs: 1200,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 25, y: 70 }, rightPose: FLAT_HAND },
      { progress: 0.35, rightWrist: { x: 0, y: 65 }, rightPose: FLAT_HAND },
      { progress: 0.8, rightWrist: { x: 0, y: 65 }, rightPose: FLAT_HAND },
      { progress: 1.0, rightWrist: { x: 25, y: 70 }, rightPose: FLAT_HAND },
    ],
  },

  NAME: {
    id: "NAME",
    word: "Name",
    category: "Identity",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 40 },
    summary: "Index and middle fingers of both hands ('H' shape) tap each other crosswise twice.",
    steps: [
      "Extend index and middle fingers on both hands ('H' shape).",
      "Cross dominant 'H' fingers on top of non-dominant 'H' fingers at a right angle.",
      "Tap the fingers together twice lightly."
    ],
    proTip: "Looks like two 'H' hands forming an 'X' cross tapping twice.",
    isTwoHanded: true,
    durationMs: 1300,
    keyframes: [
      {
        progress: 0.0,
        rightWrist: { x: 15, y: 55 }, rightPose: H_HAND,
        leftWrist: { x: -15, y: 65 }, leftPose: mirrorHandPose(H_HAND),
      },
      {
        progress: 0.25,
        rightWrist: { x: 5, y: 60 }, rightPose: H_HAND, // Tap 1
        leftWrist: { x: -5, y: 65 }, leftPose: mirrorHandPose(H_HAND),
      },
      {
        progress: 0.5,
        rightWrist: { x: 15, y: 50 }, rightPose: H_HAND, // Lift
        leftWrist: { x: -15, y: 65 }, leftPose: mirrorHandPose(H_HAND),
      },
      {
        progress: 0.75,
        rightWrist: { x: 5, y: 60 }, rightPose: H_HAND, // Tap 2
        leftWrist: { x: -5, y: 65 }, leftPose: mirrorHandPose(H_HAND),
      },
      {
        progress: 1.0,
        rightWrist: { x: 15, y: 55 }, rightPose: H_HAND,
        leftWrist: { x: -15, y: 65 }, leftPose: mirrorHandPose(H_HAND),
      },
    ],
  },

  WHERE: {
    id: "WHERE",
    word: "Where",
    category: "Questions",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 45 },
    summary: "Both open hands held palm-up at chest level, oscillating side to side.",
    steps: [
      "Hold both open hands palm-up at chest height.",
      "Gently oscillate both hands side-to-side in unison.",
      "Accompany with lowered/furrowed eyebrows indicating a WH-question."
    ],
    proTip: "Wh-words in sign language naturally go at the very end of the sentence!",
    isTwoHanded: true,
    durationMs: 1400,
    keyframes: [
      {
        progress: 0.0,
        rightWrist: { x: 45, y: 70 }, rightPose: FLAT_HAND,
        leftWrist: { x: -45, y: 70 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 0.25,
        rightWrist: { x: 60, y: 70 }, rightPose: FLAT_HAND,
        leftWrist: { x: -30, y: 70 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 0.75,
        rightWrist: { x: 30, y: 70 }, rightPose: FLAT_HAND,
        leftWrist: { x: -60, y: 70 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 1.0,
        rightWrist: { x: 45, y: 70 }, rightPose: FLAT_HAND,
        leftWrist: { x: -45, y: 70 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
    ],
  },

  YOU: {
    id: "YOU",
    word: "You",
    category: "Pronouns",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 25, y: 35 },
    summary: "Index finger extends pointing forward directly toward the conversation partner.",
    steps: [
      "Extend your index finger like pointing.",
      "Point directly forward toward the person you are communicating with.",
      "Hold steady at chest height."
    ],
    proTip: "In ISL/ASL, spatial indexing directly references the other person.",
    isTwoHanded: false,
    durationMs: 1200,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 15, y: 65 }, rightPose: POINT_HAND },
      { progress: 0.35, rightWrist: { x: 25, y: 55 }, rightPose: POINT_HAND },
      { progress: 0.8, rightWrist: { x: 25, y: 55 }, rightPose: POINT_HAND },
      { progress: 1.0, rightWrist: { x: 15, y: 65 }, rightPose: POINT_HAND },
    ],
  },

  I: {
    id: "I",
    word: "I / Me",
    category: "Pronouns",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 35 },
    summary: "Index finger points directly toward the center of your chest.",
    steps: [
      "Extend your index finger like pointing.",
      "Point the tip directly toward the center of your chest.",
      "Rest knuckles close to sternum."
    ],
    proTip: "Points directly to yourself to establish subject pronoun.",
    isTwoHanded: false,
    durationMs: 1200,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 30, y: 70 }, rightPose: POINT_HAND },
      { progress: 0.35, rightWrist: { x: 10, y: 65 }, rightPose: POINT_HAND },
      { progress: 0.8, rightWrist: { x: 10, y: 65 }, rightPose: POINT_HAND },
      { progress: 1.0, rightWrist: { x: 30, y: 70 }, rightPose: POINT_HAND },
    ],
  },

  NOT: {
    id: "NOT",
    word: "Not",
    category: "Negation",
    bodyAnchor: "CHIN",
    anchorOffset: { x: 0, y: -35 },
    summary: "Thumb tip rests under chin, then flicks outward forward with a headshake.",
    steps: [
      "Form a fist with thumb extended upright ('A' handshape).",
      "Touch thumb tip under your chin.",
      "Flick thumb outward forward with a firm negative headshake."
    ],
    proTip: "Always accompany with a subtle headshake to reinforce negation.",
    isTwoHanded: false,
    durationMs: 1300,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 0, y: 35 }, rightPose: ALPHABET_POSES["A"] },
      { progress: 0.3, rightWrist: { x: 0, y: 25 }, rightPose: ALPHABET_POSES["A"] },
      { progress: 0.65, rightWrist: { x: 25, y: 65 }, rightPose: ALPHABET_POSES["A"] },
      { progress: 1.0, rightWrist: { x: 0, y: 35 }, rightPose: ALPHABET_POSES["A"] },
    ],
  },

  NEAR: {
    id: "NEAR",
    word: "Near",
    category: "Location",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 40 },
    summary: "Dominant curved hand moves close to stationary non-dominant hand at chest.",
    steps: [
      "Hold non-dominant hand stationary with bent palm facing inward.",
      "Bring dominant hand from outside in close proximity to the stationary hand.",
      "Hold close without touching to indicate 'near' or 'close by'."
    ],
    proTip: "The distance between your hands represents physical proximity.",
    isTwoHanded: true,
    durationMs: 1300,
    keyframes: [
      {
        progress: 0.0,
        rightWrist: { x: 55, y: 65 }, rightPose: FLAT_HAND,
        leftWrist: { x: -35, y: 65 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 0.6,
        rightWrist: { x: -10, y: 65 }, rightPose: FLAT_HAND,
        leftWrist: { x: -35, y: 65 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 1.0,
        rightWrist: { x: 55, y: 65 }, rightPose: FLAT_HAND,
        leftWrist: { x: -35, y: 65 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
    ],
  },

  SIGN: {
    id: "SIGN",
    word: "Sign",
    category: "Communication",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 40 },
    summary: "Both index fingers roll in alternating backward circular orbits near chest.",
    steps: [
      "Extend index fingers on both hands ('D' handshape).",
      "Revolve fingers around each other in backward alternating circles.",
      "Keep movement rhythmic and centered at chest."
    ],
    proTip: "Simulates hands rolling and conversing in visual sign space.",
    isTwoHanded: true,
    durationMs: 1400,
    keyframes: [
      {
        progress: 0.0,
        rightWrist: { x: 30, y: 45 }, rightPose: POINT_HAND,
        leftWrist: { x: -30, y: 65 }, leftPose: mirrorHandPose(POINT_HAND),
      },
      {
        progress: 0.5,
        rightWrist: { x: 30, y: 65 }, rightPose: POINT_HAND,
        leftWrist: { x: -30, y: 45 }, leftPose: mirrorHandPose(POINT_HAND),
      },
      {
        progress: 1.0,
        rightWrist: { x: 30, y: 45 }, rightPose: POINT_HAND,
        leftWrist: { x: -30, y: 65 }, leftPose: mirrorHandPose(POINT_HAND),
      },
    ],
  },

  LANGUAGE: {
    id: "LANGUAGE",
    word: "Language",
    category: "Communication",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 45 },
    summary: "Both hands in 'L' shape draw gentle wavy paths outward away from each other.",
    steps: [
      "Form letter 'L' with both hands (thumb and index at 90 degrees).",
      "Touch thumbs lightly at center chest.",
      "Draw both hands outward in a subtle wavy undulating path."
    ],
    proTip: "The letter 'L' shape establishes the lexical root of Language.",
    isTwoHanded: true,
    durationMs: 1500,
    keyframes: [
      {
        progress: 0.0,
        rightWrist: { x: 15, y: 60 }, rightPose: ALPHABET_POSES["L"],
        leftWrist: { x: -15, y: 60 }, leftPose: mirrorHandPose(ALPHABET_POSES["L"]),
      },
      {
        progress: 0.65,
        rightWrist: { x: 75, y: 60 }, rightPose: ALPHABET_POSES["L"],
        leftWrist: { x: -75, y: 60 }, leftPose: mirrorHandPose(ALPHABET_POSES["L"]),
      },
      {
        progress: 1.0,
        rightWrist: { x: 15, y: 60 }, rightPose: ALPHABET_POSES["L"],
        leftWrist: { x: -15, y: 60 }, leftPose: mirrorHandPose(ALPHABET_POSES["L"]),
      },
    ],
  },

  ALEX: {
    id: "ALEX",
    word: "Alex",
    category: "Identity",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 30, y: 35 },
    summary: "Fingerspelling name sign sequence A-L-E-X.",
    steps: [
      "Hold hand steady at shoulder height facing forward.",
      "Display clear letters: A, then L, then E, then X.",
      "Keep wrist steady with slight lateral pause per letter."
    ],
    proTip: "Names in sign language are fingerspelled cleanly before a unique personal name sign is given.",
    isTwoHanded: false,
    durationMs: 1600,
    keyframes: [
      { progress: 0.0, rightWrist: { x: 30, y: 45 }, rightPose: ALPHABET_POSES["A"] },
      { progress: 0.25, rightWrist: { x: 30, y: 45 }, rightPose: ALPHABET_POSES["A"] },
      { progress: 0.5, rightWrist: { x: 35, y: 45 }, rightPose: ALPHABET_POSES["L"] },
      { progress: 0.75, rightWrist: { x: 40, y: 45 }, rightPose: ALPHABET_POSES["E"] },
      { progress: 1.0, rightWrist: { x: 45, y: 45 }, rightPose: ALPHABET_POSES["X"] },
    ],
  },

  NICE: {
    id: "NICE",
    word: "Nice",
    category: "Courtesies",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 40 },
    summary: "Dominant flat open palm glides smoothly across the open palm of the non-dominant hand.",
    steps: [
      "Hold non-dominant hand flat, palm facing up at chest height.",
      "Place dominant flat palm on top near the base of the palm.",
      "Slide dominant hand smoothly forward across and off the fingertips."
    ],
    proTip: "Represents a clean, smooth surface—signifying pleasantness or 'Nice'.",
    isTwoHanded: true,
    durationMs: 1400,
    keyframes: [
      {
        progress: 0.0,
        rightWrist: { x: -20, y: 60 }, rightPose: FLAT_HAND,
        leftWrist: { x: -15, y: 70 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 0.25,
        rightWrist: { x: -15, y: 60 }, rightPose: FLAT_HAND,
        leftWrist: { x: -15, y: 70 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 0.7,
        rightWrist: { x: 25, y: 60 }, rightPose: FLAT_HAND,
        leftWrist: { x: -15, y: 70 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
      {
        progress: 1.0,
        rightWrist: { x: -20, y: 60 }, rightPose: FLAT_HAND,
        leftWrist: { x: -15, y: 70 }, leftPose: mirrorHandPose(FLAT_HAND),
      },
    ],
  },

  MEET: {
    id: "MEET",
    word: "Meet",
    category: "Interactions",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 0, y: 40 },
    summary: "Both hands hold index fingers upright and glide inward toward each other until meeting.",
    steps: [
      "Hold both hands with index fingers pointing upright ('D' shape) separated by 8 inches at chest height.",
      "Glide both hands inward in unison toward the center.",
      "Meet knuckle-to-knuckle in front of your chest to indicate two people meeting."
    ],
    proTip: "The two index fingers personify two individuals coming together.",
    isTwoHanded: true,
    durationMs: 1300,
    keyframes: [
      {
        progress: 0.0,
        rightWrist: { x: 45, y: 65 }, rightPose: POINT_HAND,
        leftWrist: { x: -45, y: 65 }, leftPose: mirrorHandPose(POINT_HAND),
      },
      {
        progress: 0.3,
        rightWrist: { x: 40, y: 65 }, rightPose: POINT_HAND,
        leftWrist: { x: -40, y: 65 }, leftPose: mirrorHandPose(POINT_HAND),
      },
      {
        progress: 0.75,
        rightWrist: { x: 12, y: 65 }, rightPose: POINT_HAND,
        leftWrist: { x: -12, y: 65 }, leftPose: mirrorHandPose(POINT_HAND),
      },
      {
        progress: 1.0,
        rightWrist: { x: 45, y: 65 }, rightPose: POINT_HAND,
        leftWrist: { x: -45, y: 65 }, leftPose: mirrorHandPose(POINT_HAND),
      },
    ],
  },
};

// Synthesize letter-by-letter fingerspelling for any arbitrary unknown words
function createFingerspellingTrajectory(word: string): WordTrajectory {
  const letters = word.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 8).split("");
  if (letters.length === 0) return WORD_TRAJECTORIES["HELLO"];

  const keyframes: TrajectoryKeyframe[] = [];
  const count = letters.length;
  letters.forEach((char, idx) => {
    const pose = ALPHABET_POSES[char] || ALPHABET_POSES["A"];
    const progress = idx / Math.max(1, count - 1);
    const xOffset = 30 + idx * 4;
    keyframes.push({
      progress,
      rightWrist: { x: xOffset, y: 45 },
      rightPose: pose,
    });
  });

  return {
    id: word,
    word: word,
    category: "Fingerspelling",
    bodyAnchor: "CHEST",
    anchorOffset: { x: 30, y: 35 },
    summary: `Fingerspelling word '${word}' letter by letter: ${letters.join("-")}.`,
    steps: letters.map((c, i) => `Hold letter '${c}' shape clearly (${i + 1}/${count}).`),
    proTip: "Keep hand steady at shoulder height facing forward with subtle lateral movement.",
    isTwoHanded: false,
    durationMs: Math.max(1200, count * 350),
    keyframes,
  };
}

export function getWordTrajectory(word: string): WordTrajectory {
  const clean = (word || "").toUpperCase().replace(/[^A-Z]/g, "_");
  if (clean.includes("THANK")) return WORD_TRAJECTORIES["THANK_YOU"];
  if (clean.includes("HELLO") || clean.includes("HI")) return WORD_TRAJECTORIES["HELLO"];
  if (clean.includes("NICE")) return WORD_TRAJECTORIES["NICE"];
  if (clean.includes("MEET")) return WORD_TRAJECTORIES["MEET"];
  if (clean.includes("PLEASE")) return WORD_TRAJECTORIES["PLEASE"];
  if (clean.includes("HELP")) return WORD_TRAJECTORIES["HELP"];
  if (clean.includes("YES")) return WORD_TRAJECTORIES["YES"];
  if (clean.includes("NO")) return WORD_TRAJECTORIES["NO"];
  if (clean.includes("WATER")) return WORD_TRAJECTORIES["WATER"];
  if (clean.includes("EAT") || clean.includes("FOOD")) return WORD_TRAJECTORIES["EAT"];
  if (clean.includes("UNDERSTAND")) return WORD_TRAJECTORIES["UNDERSTAND"];
  if (clean.includes("EMERGENCY")) return WORD_TRAJECTORIES["EMERGENCY"];
  if (clean.includes("HOSPITAL")) return WORD_TRAJECTORIES["HOSPITAL"];
  if (clean.includes("QUIET") || clean.includes("SILENCE")) return WORD_TRAJECTORIES["QUIET"];
  if (clean === "MY") return WORD_TRAJECTORIES["MY"];
  if (clean === "NAME") return WORD_TRAJECTORIES["NAME"];
  if (clean === "WHERE") return WORD_TRAJECTORIES["WHERE"];
  if (clean.includes("YOU")) return WORD_TRAJECTORIES["YOU"];
  if (clean === "I" || clean === "ME") return WORD_TRAJECTORIES["I"];
  if (clean.includes("NOT")) return WORD_TRAJECTORIES["NOT"];
  if (clean.includes("NEAR")) return WORD_TRAJECTORIES["NEAR"];
  if (clean === "SIGN") return WORD_TRAJECTORIES["SIGN"];
  if (clean === "LANGUAGE") return WORD_TRAJECTORIES["LANGUAGE"];
  if (clean === "ALEX") return WORD_TRAJECTORIES["ALEX"];

  if (WORD_TRAJECTORIES[clean]) {
    return WORD_TRAJECTORIES[clean];
  }

  // Gracefully fingerspell unknown words (e.g. names, custom vocabulary)
  return createFingerspellingTrajectory(word || "HELLO");
}
