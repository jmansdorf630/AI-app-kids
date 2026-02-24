import type { Lesson } from "@/types";

export const lessons: Lesson[] = [
  {
    id: "1-what-is-ai",
    title: "What is AI?",
    description: "Learn what artificial intelligence means in a simple way.",
    emoji: "🤖",
    tier: "beginner",
    xpReward: 15,
    steps: [
      { id: "s1", type: "info", title: "Meet AI!", text: "AI stands for Artificial Intelligence. It's when a computer can do things that seem smart — like answering questions or recognizing pictures.", emoji: "🤖" },
      { id: "s2", type: "info", title: "Not Magic", text: "AI is made by people who teach computers using lots of examples. The computer finds patterns and uses them to help us.", emoji: "📚" },
      { id: "s3", type: "mcq", question: "What does AI stand for?", options: [
        { id: "a", text: "Amazing Internet", correct: false, explain: "AI is about intelligence, not the internet." },
        { id: "b", text: "Artificial Intelligence", correct: true, explain: "Yes! Computers that can do smart tasks." },
        { id: "c", text: "Auto Idea", correct: false, explain: "Artificial means made by people; Intelligence means smart." },
      ]},
      { id: "s4", type: "mcq", question: "Who teaches the computer in AI?", options: [
        { id: "a", text: "Nobody, it's magic", correct: false, explain: "AI is built by people using data and code." },
        { id: "b", text: "People, using lots of examples", correct: true, explain: "Right! People give examples so the computer learns patterns." },
        { id: "c", text: "Other computers only", correct: false, explain: "People design and train AI systems." },
      ]},
    ],
  },
  {
    id: "2-what-is-llm",
    title: "What is an LLM?",
    description: "Discover what large language models are and how they work.",
    emoji: "🧠",
    tier: "beginner",
    xpReward: 20,
    steps: [
      { id: "s1", type: "info", title: "Language Models", text: "An LLM is a Large Language Model. It's a kind of AI that reads and writes text — like a super reader and writer combined!", emoji: "📝" },
      { id: "s2", type: "info", title: "Trained on Text", text: "LLMs learn from huge amounts of text (books, articles, websites). They learn how words and sentences usually go together.", emoji: "📚" },
      { id: "s3", type: "mcq", question: "What does LLM stand for?", options: [
        { id: "a", text: "Long List Machine", correct: false, explain: "LLM is about language, not lists." },
        { id: "b", text: "Large Language Model", correct: true, explain: "Yes! It's a big AI that works with language." },
        { id: "c", text: "Little Learning Mouse", correct: false, explain: "It's large and about language." },
      ]},
      { id: "s4", type: "mcq", question: "What does an LLM do best?", options: [
        { id: "a", text: "Drive a car", correct: false, explain: "LLMs work with text, not steering wheels." },
        { id: "b", text: "Read and write text", correct: true, explain: "Right! They understand and generate language." },
        { id: "c", text: "Play video games", correct: false, explain: "Their main job is language." },
      ]},
    ],
  },
  {
    id: "3-tokens-prompts",
    title: "Tokens & Prompts",
    description: "Learn how we talk to AI with prompts and how it sees words as tokens.",
    emoji: "💬",
    tier: "beginner",
    xpReward: 20,
    steps: [
      { id: "s1", type: "info", title: "What's a Prompt?", text: "A prompt is what you type to the AI — your question or instruction. Like: \"What is the capital of France?\" That's a prompt!", emoji: "✏️" },
      { id: "s2", type: "info", title: "What are Tokens?", text: "The AI doesn't see words like we do. It breaks text into small pieces called tokens (words or parts of words). So \"running\" might be \"run\" + \"ning\".", emoji: "🧩" },
      { id: "s3", type: "mcq", question: "What is a prompt?", options: [
        { id: "a", text: "A kind of robot", correct: false, explain: "A prompt is text you give to the AI." },
        { id: "b", text: "Your question or instruction to the AI", correct: true, explain: "Yes! It's what you type when you ask the AI something." },
        { id: "c", text: "A type of token", correct: false, explain: "Prompts are what you write; tokens are how the AI reads them." },
      ]},
      { id: "s4", type: "match", instruction: "Match the word to what it means.", pairs: [
        { left: "Prompt", right: "What you type to the AI" },
        { left: "Token", right: "A small piece of text the AI uses" },
      ]},
    ],
  },
  {
    id: "4-hallucinations",
    title: "Hallucinations",
    description: "Find out when AI makes things up and how to spot it.",
    emoji: "🔍",
    tier: "beginner",
    xpReward: 25,
    badgeId: "hallucination_hunter",
    badgeOnCompletion: "hallucination_hunter",
    steps: [
      { id: "s1", type: "info", title: "AI Can Make Mistakes", text: "Sometimes AI gives an answer that sounds right but is wrong or made up. We call that a hallucination — like the AI \"seeing\" something that isn't real.", emoji: "👻" },
      { id: "s2", type: "info", title: "Why It Happens", text: "The AI is trying to guess the next words. Sometimes it guesses wrong! So we should always double-check important facts.", emoji: "✅" },
      { id: "s3", type: "spot", instruction: "Spot the hallucination!", aiAnswer: "The capital of France is Paris. France has 100 million people and its president is named Pierre.", question: "What's wrong with this AI answer?", options: [
        { id: "a", text: "Paris is not the capital", correct: false, explain: "Paris is correct." },
        { id: "b", text: "France doesn't have 100 million people", correct: true, explain: "France has about 67 million people. The number was made up!" },
        { id: "c", text: "France has no president", correct: false, explain: "France does have a president." },
      ]},
      { id: "s4", type: "spot", instruction: "Another one!", aiAnswer: "Dogs have four legs. A group of dogs is called a pack. Dogs can see in full color and hear sounds we cannot.", question: "Which part is likely wrong?", options: [
        { id: "a", text: "Dogs have four legs", correct: false, explain: "That's true." },
        { id: "b", text: "A group is called a pack", correct: false, explain: "That's correct." },
        { id: "c", text: "Dogs see in full color", correct: true, explain: "Dogs see fewer colors than we do. That's the mistake!" },
      ]},
    ],
  },
  {
    id: "5-bias-fairness",
    title: "Bias & Fairness",
    description: "Why AI should be fair to everyone.",
    emoji: "⚖️",
    tier: "beginner",
    xpReward: 20,
    steps: [
      { id: "s1", type: "info", title: "What is Bias?", text: "Bias means treating some people or ideas unfairly. AI learns from data that people made, so sometimes it can repeat unfair ideas if we're not careful.", emoji: "⚖️" },
      { id: "s2", type: "info", title: "Fair AI", text: "Good AI is fair to everyone — no matter who they are. People work hard to make AI that helps all of us equally.", emoji: "🌍" },
      { id: "s3", type: "mcq", question: "What does bias in AI mean?", options: [
        { id: "a", text: "The AI is very fast", correct: false, explain: "Bias is about fairness, not speed." },
        { id: "b", text: "Treating some people or ideas unfairly", correct: true, explain: "Yes. We want AI to be fair to everyone." },
        { id: "c", text: "The AI uses big computers", correct: false, explain: "Bias is about unfair treatment." },
      ]},
      { id: "s4", type: "order", instruction: "Put these in order: how we want AI to work.", items: [
        "AI learns from data",
        "People check that AI is fair",
        "AI helps everyone equally",
      ]},
    ],
  },
  {
    id: "6-safety",
    title: "Safety First",
    description: "How to stay safe when using AI.",
    emoji: "🛡️",
    tier: "beginner",
    xpReward: 20,
    steps: [
      { id: "s1", type: "info", title: "Keep Your Info Private", text: "Don't share your full name, address, school name, or phone number with AI. Treat it like talking to someone you don't know — stay safe!", emoji: "🔒" },
      { id: "s2", type: "info", title: "Ask an Adult", text: "If something feels weird or you're not sure, ask a parent or teacher. They can help you figure it out.", emoji: "👨‍👩‍👧" },
      { id: "s3", type: "mcq", question: "Should you tell the AI your home address?", options: [
        { id: "a", text: "Yes, so it can help me", correct: false, explain: "Never share your address with AI or strangers." },
        { id: "b", text: "No, keep private info private", correct: true, explain: "Right! Don't share personal details." },
        { id: "c", text: "Only if it asks twice", correct: false, explain: "Never share it, no matter what." },
      ]},
      { id: "s4", type: "match", instruction: "Match: safe or not safe to share?", pairs: [
        { left: "Your favorite color", right: "OK to share" },
        { left: "Your school name", right: "Better not to share" },
      ]},
    ],
  },
  {
    id: "7-ai-for-school",
    title: "Using AI for School",
    description: "Good ways and not-so-good ways to use AI when learning.",
    emoji: "📖",
    tier: "beginner",
    xpReward: 25,
    steps: [
      { id: "s1", type: "info", title: "AI Can Help You Learn", text: "You can ask AI to explain a hard topic, give practice questions, or help you understand a word. That's using AI to learn!", emoji: "💡" },
      { id: "s2", type: "info", title: "Copying Isn't Learning", text: "If you copy an AI answer and hand it in as your own, that's not OK. Your teacher wants to see what YOU learned. Use AI to understand, then write in your own words.", emoji: "✍️" },
      { id: "s3", type: "mcq", question: "What's a good way to use AI for school?", options: [
        { id: "a", text: "Copy the AI's essay and submit it", correct: false, explain: "That's plagiarism. Your work should be yours." },
        { id: "b", text: "Ask AI to explain a topic, then write in your own words", correct: true, explain: "Yes! Learn from it, then do your own work." },
        { id: "c", text: "Never use AI for homework", correct: false, explain: "Using it to learn is OK; copying is not." },
      ]},
      { id: "s4", type: "order", instruction: "Order these from best to not as good.", items: [
        "Use AI to understand, then write yourself",
        "Ask AI for one practice question",
        "Copy AI answer and turn it in as yours",
      ]},
    ],
  },
  {
    id: "8-great-prompts",
    title: "Build a Great Prompt",
    description: "Final review: how to ask AI so you get great answers.",
    emoji: "🎓",
    tier: "beginner",
    xpReward: 30,
    badgeId: "prompt_master",
    badgeOnCompletion: "prompt_master",
    steps: [
      { id: "s1", type: "info", title: "Clear Questions Get Better Answers", text: "The more clear your prompt, the better the AI can help. Say what you need: \"Explain like I'm 10\" or \"Give me 3 examples.\"", emoji: "✨" },
      { id: "s2", type: "build_prompt", question: "Build a strong prompt to get a short summary.", fragments: ["Summarize", "in 2 sentences", "for a 10-year-old", "the story of Cinderella", "in your own words"], correctCombination: ["Summarize", "the story of Cinderella", "in 2 sentences", "for a 10-year-old", "in your own words"], explanation: "A good prompt says what you want (summary), what topic (Cinderella), how long (2 sentences), who it's for (10-year-old), and how (in your own words)." },
      { id: "s3", type: "mcq", question: "What makes a prompt good?", options: [
        { id: "a", text: "It's very long no matter what", correct: false, explain: "Length isn't the key — being clear is." },
        { id: "b", text: "It's clear and says what you need", correct: true, explain: "Yes! Clear prompts get better answers." },
        { id: "c", text: "It uses the hardest words you know", correct: false, explain: "Simple and clear is better." },
      ]},
      { id: "s4", type: "mcq", question: "You finished the beginner path! What should you do next?", options: [
        { id: "a", text: "Forget everything", correct: false, explain: "You learned a lot — use it!" },
        { id: "b", text: "Practice with real prompts and try Explorer lessons", correct: true, explain: "Keep learning and have fun with AI!" },
        { id: "c", text: "Never use AI again", correct: false, explain: "Using it wisely is great." },
      ]},
    ],
  },
  // --- EXPLORER TIER ---
  {
    id: "9-how-ai-predicts-words",
    title: "How AI Predicts Words",
    description: "See how LLMs guess the next word like a super autocomplete.",
    emoji: "🔮",
    tier: "explorer",
    xpReward: 25,
    steps: [
      { id: "s1", type: "info", title: "Next Word Prediction", text: "An LLM reads your text and predicts what word might come next. It's like autocomplete, but for whole sentences and ideas!", emoji: "📝" },
      { id: "s2", type: "next_word_prediction", sentence: "The cat sat on the ____.", options: ["mat", "table", "roof"], correctIndex: 0 },
      { id: "s3", type: "next_word_prediction", sentence: "In winter, we wear a warm ____.", options: ["hat", "swimsuit", "sandals"], correctIndex: 0 },
      { id: "s4", type: "next_word_prediction", sentence: "To make a sandwich, you need bread and ____.", options: ["water", "butter", "pencil"], correctIndex: 1 },
    ],
  },
  {
    id: "10-training-data-matters",
    title: "Training Data Matters",
    description: "Why the data AI learns from changes its answers.",
    emoji: "📊",
    tier: "explorer",
    xpReward: 28,
    steps: [
      { id: "s1", type: "info", title: "Data Shapes AI", text: "AI learns from data — text, images, and more. If the data is biased or wrong, the AI can repeat those mistakes. Good data helps make good AI.", emoji: "📚" },
      { id: "s2", type: "scenario", story: "A school only had old science books that said \"Pluto is a planet.\" They trained an AI helper on those books. When a student asked how many planets there are, the AI said 9.", question: "What's the problem?", options: ["The AI is too slow", "The AI learned from outdated info and gave a wrong answer", "The student asked a bad question"], correctIndex: 1, explanation: "The AI only knew what was in the old books. Scientists later said Pluto is a dwarf planet. Training data matters!" },
      { id: "s3", type: "detect_risk", aiAnswer: "You should always share your full name and address with any app so it can help you better. The more personal info you give, the smarter the AI gets.", question: "What's wrong with this AI answer?", options: ["Hallucination", "Unsafe advice", "Bias"], correctIndex: 1, explanation: "Telling kids to share personal info with any app is unsafe. We should keep private info private." },
    ],
  },
  {
    id: "11-ai-vs-google",
    title: "AI vs Google",
    description: "When to search and when to ask AI.",
    emoji: "🔍",
    tier: "explorer",
    xpReward: 25,
    steps: [
      { id: "s1", type: "info", title: "Search vs Chat", text: "Search (like Google) finds existing web pages. AI chat invents an answer from what it learned. For up-to-date facts, search is often better. For explaining ideas, AI can help!", emoji: "💡" },
      { id: "s2", type: "mcq", question: "You need the score of yesterday's game. Best tool?", options: [
        { id: "a", text: "Ask an AI chatbot", correct: false, explain: "AI might make up a score!" },
        { id: "b", text: "Use search to find a sports website", correct: true, explain: "Search finds current pages with real results." },
        { id: "c", text: "Guess", correct: false, explain: "Search is the way to go." },
      ]},
      { id: "s3", type: "mcq", question: "You want to understand how photosynthesis works. Best tool?", options: [
        { id: "a", text: "Search for a definition", correct: false, explain: "Both can work; AI can explain simply." },
        { id: "b", text: "Ask AI to explain simply", correct: true, explain: "AI is great at explaining concepts in simple terms!" },
        { id: "c", text: "Neither", correct: false, explain: "AI can help explain." },
      ], timerSeconds: 15 },
    ],
  },
  // --- MASTER TIER ---
  {
    id: "12-deepfakes",
    title: "Deepfakes",
    description: "When videos and images can be faked by AI.",
    emoji: "🎬",
    tier: "master",
    xpReward: 35,
    steps: [
      { id: "s1", type: "info", title: "What Are Deepfakes?", text: "Deepfakes are fake videos or images made by AI. Someone's face or voice can be copied to make it look like they said or did something they didn't. So don't believe everything you see!", emoji: "⚠️" },
      { id: "s2", type: "scenario", story: "Your friend sends you a video of a famous singer saying something mean. It looks real, but you're not sure. What should you do?", question: "What's the best move?", options: ["Share it with everyone", "Believe it and get angry", "Don't share it; check if it's real or ask an adult"], correctIndex: 2, explanation: "Videos can be faked. Don't spread something that might be a deepfake. Check first or ask for help." },
      { id: "s3", type: "scenario", story: "You see a photo online of a politician at a party. The caption says it's from last week. You've learned that AI can make fake images.", question: "What should you remember?", options: ["Photos are always true", "Photos and videos can be faked; don't trust everything", "Only videos can be faked"], correctIndex: 1, explanation: "Both photos and videos can be faked by AI. Think before you trust or share." },
    ],
  },
];

export const lessonIds = lessons.map((l) => l.id);

export const beginnerIds = lessons.filter((l) => l.tier === "beginner").map((l) => l.id);
export const explorerIds = lessons.filter((l) => l.tier === "explorer").map((l) => l.id);
export const masterIds = lessons.filter((l) => l.tier === "master").map((l) => l.id);

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}
