export interface SignItem {
  id: string;
  label: string;
  hindiLabel: string;
  category: "GREETING" | "EMERGENCY" | "ESSENTIALS" | "PRONOUNS" | "QUESTIONS" | "POLITE" | "COMMON";
  description: string;
  movementType: "STATIC" | "DYNAMIC_WAVE" | "DYNAMIC_SWIPE" | "DYNAMIC_TAP" | "TWO_HANDED";
  keywords: string[];
  sampleSentence: string;
  gestureGuide: string;
}

export const SIGN_VOCABULARY: SignItem[] = [
  {
    id: "HELLO",
    label: "HELLO",
    hindiLabel: "नमस्ते (Namaste)",
    category: "GREETING",
    description: "Open flat palm moving outward or touching forehead (salute/namaste gesture).",
    movementType: "DYNAMIC_WAVE",
    keywords: ["hi", "hello", "hey", "namaste", "greetings"],
    sampleSentence: "Hello everyone!",
    gestureGuide: "Raise your dominant hand near temple or open palm waving forward."
  },
  {
    id: "THANK YOU",
    label: "THANK YOU",
    hindiLabel: "धन्यवाद (Dhanyavaad)",
    category: "POLITE",
    description: "Flat hand fingers touching chin then moving gently forward and downward toward other person.",
    movementType: "DYNAMIC_SWIPE",
    keywords: ["thanks", "thank you", "dhanyavaad", "grateful"],
    sampleSentence: "Thank you very much.",
    gestureGuide: "Touch chin with flat fingertips, then extend hand outward palm up."
  },
  {
    id: "YES",
    label: "YES",
    hindiLabel: "हाँ (Haan)",
    category: "COMMON",
    description: "Closed fist nodding up and down from the wrist like a head nod.",
    movementType: "DYNAMIC_TAP",
    keywords: ["yes", "yeah", "correct", "agree", "haan"],
    sampleSentence: "Yes, I agree.",
    gestureGuide: "Make a soft fist and tilt knuckles forward twice (nodding fist)."
  },
  {
    id: "NO",
    label: "NO",
    hindiLabel: "नहीं (Nahi)",
    category: "COMMON",
    description: "Index and middle fingers snapping down against thumb, or open hand waving side-to-side.",
    movementType: "DYNAMIC_SWIPE",
    keywords: ["no", "nah", "disagree", "nahi", "stop"],
    sampleSentence: "No, that is not correct.",
    gestureGuide: "Extend index and middle finger, snap down to touch thumb, or shake palm left-right."
  },
  {
    id: "HELP",
    label: "HELP",
    hindiLabel: "मदद (Madad)",
    category: "EMERGENCY",
    description: "Closed fist with thumb up resting on the open flat palm of the non-dominant hand, lifted together.",
    movementType: "TWO_HANDED",
    keywords: ["help", "assist", "emergency", "madad", "support"],
    sampleSentence: "Please help me!",
    gestureGuide: "Thumbs-up fist placed on horizontal open palm, lift both hands slightly upward."
  },
  {
    id: "WATER",
    label: "WATER",
    hindiLabel: "पानी (Paani)",
    category: "ESSENTIALS",
    description: "W-shaped three fingers (index, middle, ring) tapping near the lips/chin.",
    movementType: "DYNAMIC_TAP",
    keywords: ["water", "drink", "paani", "thirsty"],
    sampleSentence: "I need drinking water.",
    gestureGuide: "Form 'W' with 3 fingers and tap corner of mouth twice."
  },
  {
    id: "FOOD",
    label: "FOOD",
    hindiLabel: "खाना (Khaana)",
    category: "ESSENTIALS",
    description: "Fingertips grouped together touching or tapping repeatedly near the mouth.",
    movementType: "DYNAMIC_TAP",
    keywords: ["food", "eat", "hungry", "lunch", "dinner", "khaana"],
    sampleSentence: "I want to eat food.",
    gestureGuide: "Bunch fingertips together (squished circle) and tap lips twice."
  },
  {
    id: "HOSPITAL",
    label: "HOSPITAL",
    hindiLabel: "अस्पताल (Aspataal)",
    category: "EMERGENCY",
    description: "Index and middle fingers drawing a cross on the shoulder or forehead.",
    movementType: "DYNAMIC_SWIPE",
    keywords: ["hospital", "doctor", "medicine", "clinic", "aspataal"],
    sampleSentence: "Please take me to the hospital.",
    gestureGuide: "Two fingers trace a '+' sign on the upper shoulder."
  },
  {
    id: "STOP",
    label: "STOP",
    hindiLabel: "रुको (Ruko)",
    category: "COMMON",
    description: "Open flat hand chopped downward perpendicularly into open flat upward palm.",
    movementType: "TWO_HANDED",
    keywords: ["stop", "halt", "ruko", "wait", "pause"],
    sampleSentence: "Please stop right here.",
    gestureGuide: "Edge of one vertical flat hand strikes down onto horizontal palm."
  },
  {
    id: "PLEASE",
    label: "PLEASE",
    hindiLabel: "कृपया (Kripya)",
    category: "POLITE",
    description: "Open flat palm rubbing in gentle circles over chest over heart.",
    movementType: "DYNAMIC_WAVE",
    keywords: ["please", "kripya", "kindly", "request"],
    sampleSentence: "Please assist me.",
    gestureGuide: "Open flat hand against chest, rub in clockwise circles."
  },
  {
    id: "SORRY",
    label: "SORRY",
    hindiLabel: "माफ़ कीजिये (Maaf Kijiye)",
    category: "POLITE",
    description: "Fist rotated in gentle circular motion over the chest.",
    movementType: "DYNAMIC_WAVE",
    keywords: ["sorry", "apologize", "forgive", "maafi"],
    sampleSentence: "I am really sorry.",
    gestureGuide: "Closed fist rubbing in circles on center of chest."
  },
  {
    id: "GOOD",
    label: "GOOD",
    hindiLabel: "अच्छा (Achha)",
    category: "COMMON",
    description: "Thumbs up or flat hand from lips dropping onto opposite open palm.",
    movementType: "STATIC",
    keywords: ["good", "great", "fine", "achha", "nice"],
    sampleSentence: "This is very good.",
    gestureGuide: "Give clear thumbs up or flat hand from chin down to palm."
  },
  {
    id: "BAD",
    label: "BAD",
    hindiLabel: "खराब (Kharab)",
    category: "COMMON",
    description: "Flat hand from lips turned downward and flipped away.",
    movementType: "DYNAMIC_SWIPE",
    keywords: ["bad", "poor", "kharab", "wrong"],
    sampleSentence: "That is bad.",
    gestureGuide: "Flat fingers touch chin and twist outward pointing palm down."
  },
  {
    id: "I",
    label: "I",
    hindiLabel: "मैं (Main)",
    category: "PRONOUNS",
    description: "Index finger pointing directly at one's own chest.",
    movementType: "STATIC",
    keywords: ["i", "me", "myself", "main"],
    sampleSentence: "I am here.",
    gestureGuide: "Point index finger directly at center of chest."
  },
  {
    id: "YOU",
    label: "YOU",
    hindiLabel: "आप / तुम (Aap)",
    category: "PRONOUNS",
    description: "Index finger pointing straight ahead toward conversation partner.",
    movementType: "STATIC",
    keywords: ["you", "your", "aap", "tum"],
    sampleSentence: "Are you ready?",
    gestureGuide: "Point index finger straight forward at camera."
  },
  {
    id: "WHERE",
    label: "WHERE",
    hindiLabel: "कहाँ (Kahaan)",
    category: "QUESTIONS",
    description: "Both hands palms facing up moving side-to-side in inquiry gesture.",
    movementType: "TWO_HANDED",
    keywords: ["where", "location", "kahaan"],
    sampleSentence: "Where is the place?",
    gestureGuide: "Hold both palms face up at waist level and move them outward."
  }
];

export const VOCABULARY_MAP = new Map<string, SignItem>(
  SIGN_VOCABULARY.map((item) => [item.id, item])
);
