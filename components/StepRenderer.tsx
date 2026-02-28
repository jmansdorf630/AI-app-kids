"use client";

import { useState, useEffect } from "react";
import type {
  Step,
  InfoStep,
  McqStep,
  MatchStep,
  OrderStep,
  SpotStep,
  BuildPromptStep,
  DetectRiskStep,
  ScenarioStep,
  NextWordPredictionStep,
} from "@/types";

interface StepRendererProps {
  step: Step;
  onComplete: (correct: boolean, fastBonus?: boolean) => void;
}

function TimerBar({ seconds, onTimeout, onTick }: { seconds: number; onTimeout: () => void; onTick?: (left: number) => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) {
      onTimeout();
      return;
    }
    const t = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(t);
          onTimeout();
          return 0;
        }
        onTick?.(l - 1);
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [left, onTimeout, onTick]);
  const pct = (left / seconds) * 100;
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-1000 linear ${pct > 50 ? "bg-green-500" : pct > 25 ? "bg-amber-500" : "bg-red-500"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function StepRenderer({ step, onComplete }: StepRendererProps) {
  switch (step.type) {
    case "info":
      return <InfoStepBlock step={step} onComplete={onComplete} />;
    case "mcq":
      return <McqStepBlock step={step} onComplete={onComplete} />;
    case "match":
      return <MatchStepBlock step={step} onComplete={onComplete} />;
    case "order":
      return <OrderStepBlock step={step} onComplete={onComplete} />;
    case "spot":
      return <SpotStepBlock step={step} onComplete={onComplete} />;
    case "build_prompt":
      return <BuildPromptStepBlock step={step} onComplete={onComplete} />;
    case "detect_risk":
      return <DetectRiskStepBlock step={step} onComplete={onComplete} />;
    case "scenario":
      return <ScenarioStepBlock step={step} onComplete={onComplete} />;
    case "next_word_prediction":
      return <NextWordPredictionStepBlock step={step} onComplete={onComplete} />;
    default:
      return null;
  }
}

function InfoStepBlock({ step, onComplete }: { step: InfoStep; onComplete: (c: boolean, fast?: boolean) => void }) {
  return (
    <div className="space-y-4">
      {step.emoji && <div className="text-5xl text-center">{step.emoji}</div>}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">{step.title}</h2>
      <p className="text-gray-700 dark:text-white leading-relaxed">{step.text}</p>
      <button
        type="button"
        onClick={() => onComplete(true)}
        className="w-full py-3 px-4 rounded-xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-600 transition"
      >
        Next →
      </button>
    </div>
  );
}

function McqStepBlock({ step, onComplete }: { step: McqStep; onComplete: (c: boolean, fast?: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [answeredAt, setAnsweredAt] = useState<number | null>(null);
  const chosen = selected != null ? step.options.find((o) => o.id === selected) : null;
  const timerSeconds = step.timerSeconds ?? 0;
  const [timeLeftWhenAnswered, setTimeLeftWhenAnswered] = useState<number | null>(null);

  const handleTimeout = () => {
    if (showFeedback) return;
    setTimedOut(true);
    setShowFeedback(true);
  };

  const handleSubmit = () => {
    if (selected == null) return;
    setAnsweredAt(timerSeconds > 0 ? Date.now() : null);
    setShowFeedback(true);
  };

  const handleNext = () => {
    const correct = timedOut ? false : (chosen?.correct ?? false);
    let fastBonus = false;
    if (timerSeconds > 0 && timeLeftWhenAnswered != null && correct) {
      if (timeLeftWhenAnswered >= timerSeconds * 0.5) fastBonus = true;
    }
    onComplete(correct, fastBonus);
  };

  if (timedOut && showFeedback) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 font-bold">⏱ Time's up! The correct answer was: {step.options.find((o) => o.correct)?.text}</p>
        <button type="button" onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
          Next →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timerSeconds > 0 && !showFeedback && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600 dark:text-white">⏱ {timerSeconds}s</span>
          <TimerBar
            seconds={timerSeconds}
            onTimeout={handleTimeout}
            onTick={(left) => setTimeLeftWhenAnswered(left)}
          />
        </div>
      )}
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">{step.question}</h2>
      <div className="space-y-2">
        {step.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            data-choice
            onClick={() => !showFeedback && setSelected(opt.id)}
            disabled={showFeedback}
            className={`w-full text-left py-3 px-4 rounded-xl border-2 font-semibold transition text-gray-800 dark:text-white ${
              selected === opt.id ? "border-indigo-500 bg-indigo-50 text-gray-900 dark:text-gray-900" : "border-gray-200 hover:border-indigo-300 dark:border-slate-500"
            } ${showFeedback && opt.correct ? "border-green-500 bg-green-50 text-gray-900 dark:text-gray-900" : ""} ${showFeedback && selected === opt.id && !opt.correct ? "border-red-300 bg-red-50 text-gray-900 dark:text-gray-900" : ""}`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      {!showFeedback ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selected == null}
          className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold disabled:opacity-50"
        >
          Check
        </button>
      ) : (
        <>
          {chosen?.explain && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-gray-800 dark:text-white">{chosen.explain}</div>
          )}
          <button type="button" onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
            Next →
          </button>
        </>
      )}
    </div>
  );
}

function MatchStepBlock({ step, onComplete }: { step: MatchStep; onComplete: (c: boolean, fast?: boolean) => void }) {
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [pairs, setPairs] = useState<{ left: string; right: string }[]>([]);
  const lefts = step.pairs.map((p) => p.left);
  const rights = step.pairs.map((p) => p.right);
  const [shuffledRight] = useState(() => [...rights].sort(() => Math.random() - 0.5));
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const checkCorrect = () => {
    const correctOrder = step.pairs.map((p) => p.left);
    const userOrder = pairs.map((p) => p.left);
    return correctOrder.length === userOrder.length && correctOrder.every((l, i) => userOrder[i] === l && step.pairs.find((x) => x.left === l)?.right === pairs[i].right);
  };
  const allPaired = pairs.length === step.pairs.length;
  const handleLeft = (left: string) => {
    if (pairs.some((p) => p.left === left)) return;
    setLeftSelected(left);
  };
  const handleRight = (right: string) => {
    if (leftSelected == null) return;
    if (pairs.some((p) => p.right === right)) return;
    setPairs((prev) => [...prev, { left: leftSelected, right }].sort((a, b) => lefts.indexOf(a.left) - lefts.indexOf(b.left)));
    setLeftSelected(null);
  };
  const handleCheck = () => {
    setCorrect(checkCorrect());
    setChecked(true);
  };
  const handleNext = () => onComplete(correct);

  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-800 dark:text-white">{step.instruction}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          {lefts.map((left) => (
            <div
              key={left}
              role="button"
              tabIndex={0}
              onClick={() => !checked && handleLeft(left)}
              onKeyDown={(e) => { if (!checked && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); handleLeft(left); } }}
              className={`py-2 px-3 rounded-xl border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-800 dark:text-white ${leftSelected === left ? "border-indigo-500 bg-indigo-50 text-gray-900 dark:text-gray-900" : "border-gray-200 dark:border-slate-500"} ${pairs.some((p) => p.left === left) ? "opacity-60" : ""}`}
            >
              {left}
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-2">
          {shuffledRight.map((right) => (
            <div
              key={right}
              role="button"
              tabIndex={0}
              onClick={() => !checked && leftSelected && handleRight(right)}
              onKeyDown={(e) => { if (!checked && leftSelected && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); handleRight(right); } }}
              className={`py-2 px-3 rounded-xl border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-gray-800 dark:text-white ${pairs.some((p) => p.right === right) ? "opacity-60 border-green-200 bg-green-50 text-gray-900 dark:text-gray-900" : "border-gray-200 dark:border-slate-500"}`}
            >
              {right}
            </div>
          ))}
        </div>
      </div>
      {allPaired && !checked && (
        <button type="button" onClick={handleCheck} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold">
          Check
        </button>
      )}
      {checked && (
        <>
          <p className={correct ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
            {correct ? "Correct!" : "Not quite. The right pairs are in the lesson — try to remember!"}
          </p>
          <button type="button" onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
            Next →
          </button>
        </>
      )}
    </div>
  );
}

function OrderStepBlock({ step, onComplete }: { step: OrderStep; onComplete: (c: boolean, fast?: boolean) => void }) {
  const [items, setItems] = useState<string[]>(() => [...step.items].sort(() => Math.random() - 0.5));
  const [checked, setChecked] = useState(false);
  const correctOrder = step.items;
  const isCorrect = items.length === correctOrder.length && items.every((v, i) => v === correctOrder[i]);
  const move = (from: number, to: number) => {
    if (checked) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setItems(next);
  };
  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-800 dark:text-white">{step.instruction}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={`${item}-${i}`} className="flex items-center gap-2 p-3 rounded-xl border-2 border-gray-200 dark:border-slate-500 bg-white dark:bg-slate-800/50">
            <span className="text-gray-500 dark:text-white font-bold w-6">{i + 1}.</span>
            <span className="flex-1 text-gray-800 dark:text-white">{item}</span>
            <div className="flex gap-1">
              {i > 0 && (
                <button type="button" onClick={() => move(i, i - 1)} className="px-2 py-1 rounded bg-gray-200 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" aria-label={`Move item ${i + 1} up`}>↑</button>
              )}
              {i < items.length - 1 && (
                <button type="button" onClick={() => move(i, i + 1)} className="px-2 py-1 rounded bg-gray-200 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" aria-label={`Move item ${i + 1} down`}>↓</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {!checked ? (
        <button type="button" onClick={() => setChecked(true)} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Check order
        </button>
      ) : (
        <>
          <p className={isCorrect ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
            {isCorrect ? "Correct order!" : "Not quite. Re-read the lesson to see the right order."}
          </p>
          <button type="button" onClick={() => onComplete(isCorrect)} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Next →
          </button>
        </>
      )}
    </div>
  );
}

function SpotStepBlock({ step, onComplete }: { step: SpotStep; onComplete: (c: boolean, fast?: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const chosen = selected != null ? step.options.find((o) => o.id === selected) : null;
  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-700 dark:text-white">{step.instruction}</p>
      <div className="p-4 rounded-xl bg-gray-100 dark:bg-slate-700/50 border-2 border-gray-200 dark:border-slate-600 italic text-gray-800 dark:text-white">{step.aiAnswer}</div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">{step.question}</h2>
      <div className="space-y-2">
        {step.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            data-choice
            onClick={() => !showFeedback && setSelected(opt.id)}
            disabled={showFeedback}
            className={`w-full text-left py-3 px-4 rounded-xl border-2 font-semibold transition text-gray-800 dark:text-white ${
              selected === opt.id ? "border-indigo-500 bg-indigo-50 text-gray-900 dark:text-gray-900" : "border-gray-200 hover:border-indigo-300 dark:border-slate-500"
            } ${showFeedback && opt.correct ? "border-green-500 bg-green-50 text-gray-900 dark:text-gray-900" : ""} ${showFeedback && selected === opt.id && !opt.correct ? "border-red-300 bg-red-50 text-gray-900 dark:text-gray-900" : ""}`}
          >
            {opt.text}
          </button>
        ))}
      </div>
      {!showFeedback ? (
        <button type="button" onClick={() => selected != null && setShowFeedback(true)} disabled={selected == null} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold disabled:opacity-50">
          Check
        </button>
      ) : (
        <>
          {chosen?.explain && <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-gray-800 dark:text-white">{chosen.explain}</div>}
          <button type="button" onClick={() => onComplete(chosen?.correct ?? false)} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
            Next →
          </button>
        </>
      )}
    </div>
  );
}

function BuildPromptStepBlock({ step, onComplete }: { step: BuildPromptStep; onComplete: (c: boolean, fast?: boolean) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const toggle = (frag: string) => {
    if (showFeedback) return;
    setSelected((prev) => (prev.includes(frag) ? prev.filter((x) => x !== frag) : [...prev, frag]));
  };
  const correct = selected.length === step.correctCombination.length && step.correctCombination.every((f, i) => selected[i] === f);
  const checkCorrect = () => {
    const a = [...selected];
    const b = [...step.correctCombination];
    return a.length === b.length && a.every((x, i) => x === b[i]);
  };
  const isCorrect = checkCorrect();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">{step.question}</h2>
      <p className="text-sm text-gray-600 dark:text-white">Tap fragments in the order you want them in your prompt.</p>
      <div className="flex flex-wrap gap-2">
        {step.fragments.map((frag) => (
          <button
            key={frag}
            type="button"
            onClick={() => toggle(frag)}
            className={`py-2 px-3 rounded-xl border-2 font-medium transition text-gray-800 dark:text-white ${
              selected.includes(frag) ? "border-indigo-500 bg-indigo-50 text-gray-900 dark:text-gray-900" : "border-gray-200 hover:border-indigo-300 dark:border-slate-500"
            }`}
          >
            {frag}
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-600 dark:text-white">Your order: {selected.length ? selected.join(" → ") : "(tap to add)"}</div>
      {!showFeedback ? (
        <button type="button" onClick={() => setShowFeedback(true)} disabled={selected.length === 0} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold disabled:opacity-50">
          Check
        </button>
      ) : (
        <>
          <p className={isCorrect ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{isCorrect ? "Correct!" : "Not quite the best order."}</p>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-gray-800 dark:text-white">{step.explanation}</div>
          <button type="button" onClick={() => onComplete(isCorrect)} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
            Next →
          </button>
        </>
      )}
    </div>
  );
}

function DetectRiskStepBlock({ step, onComplete }: { step: DetectRiskStep; onComplete: (c: boolean, fast?: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const timerSeconds = step.timerSeconds ?? 0;
  const [timeLeftWhenAnswered, setTimeLeftWhenAnswered] = useState<number | null>(null);
  const handleTimeout = () => {
    if (showFeedback) return;
    setTimedOut(true);
    setShowFeedback(true);
  };
  const correct = selected === step.correctIndex;
  const handleNext = () => {
    const c = timedOut ? false : correct;
    let fastBonus = false;
    if (timerSeconds > 0 && timeLeftWhenAnswered != null && c) {
      if (timeLeftWhenAnswered >= timerSeconds * 0.5) fastBonus = true;
    }
    onComplete(c, fastBonus);
  };
  if (timedOut && showFeedback) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 font-bold">⏱ Time's up! The right answer was: {step.options[step.correctIndex]}</p>
        <button type="button" onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
          Next →
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {timerSeconds > 0 && !showFeedback && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600 dark:text-white">⏱ {timerSeconds}s</span>
          <TimerBar seconds={timerSeconds} onTimeout={handleTimeout} onTick={(left) => setTimeLeftWhenAnswered(left)} />
        </div>
      )}
      <div className="p-4 rounded-xl bg-gray-100 dark:bg-slate-700/50 border-2 border-gray-200 dark:border-slate-600 italic text-gray-800 dark:text-white">{step.aiAnswer}</div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">{step.question}</h2>
      <div className="space-y-2">
        {step.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => !showFeedback && setSelected(i)}
            disabled={showFeedback}
            className={`w-full text-left py-3 px-4 rounded-xl border-2 font-semibold transition text-gray-800 dark:text-white ${
              selected === i ? "border-indigo-500 bg-indigo-50 text-gray-900 dark:text-gray-900" : "border-gray-200 hover:border-indigo-300 dark:border-slate-500"
            } ${showFeedback && i === step.correctIndex ? "border-green-500 bg-green-50 text-gray-900 dark:text-gray-900" : ""} ${showFeedback && selected === i && i !== step.correctIndex ? "border-red-300 bg-red-50 text-gray-900 dark:text-gray-900" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!showFeedback ? (
        <button type="button" onClick={() => selected != null && setShowFeedback(true)} disabled={selected == null} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold disabled:opacity-50">
          Check
        </button>
      ) : (
        <>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-gray-800 dark:text-white">{step.explanation}</div>
          <button type="button" onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
            Next →
          </button>
        </>
      )}
    </div>
  );
}

function ScenarioStepBlock({ step, onComplete }: { step: ScenarioStep; onComplete: (c: boolean, fast?: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const correct = selected === step.correctIndex;
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700">
        <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">📖 Story</p>
        <p className="text-gray-800 dark:text-white">{step.story}</p>
      </div>
      <h2 className="text-lg font-bold text-gray-800 dark:text-white">{step.question}</h2>
      <div className="space-y-2">
        {step.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => !showFeedback && setSelected(i)}
            disabled={showFeedback}
            className={`w-full text-left py-3 px-4 rounded-xl border-2 font-semibold transition text-gray-800 dark:text-white ${
              selected === i ? "border-indigo-500 bg-indigo-50 text-gray-900 dark:text-gray-900" : "border-gray-200 hover:border-indigo-300 dark:border-slate-500"
            } ${showFeedback && i === step.correctIndex ? "border-green-500 bg-green-50 text-gray-900 dark:text-gray-900" : ""} ${showFeedback && selected === i && i !== step.correctIndex ? "border-red-300 bg-red-50 text-gray-900 dark:text-gray-900" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!showFeedback ? (
        <button type="button" onClick={() => selected != null && setShowFeedback(true)} disabled={selected == null} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold disabled:opacity-50">
          Check
        </button>
      ) : (
        <>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-gray-800 dark:text-white">{step.explanation}</div>
          <button type="button" onClick={() => onComplete(correct)} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
            Next →
          </button>
        </>
      )}
    </div>
  );
}

function NextWordPredictionStepBlock({ step, onComplete }: { step: NextWordPredictionStep; onComplete: (c: boolean, fast?: boolean) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const correct = selected === step.correctIndex;
  const sentenceWithBlank = step.sentence.replace("____", "______");
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-800 dark:text-white">{sentenceWithBlank}</p>
      <p className="text-sm text-gray-600 dark:text-white">Pick the word that best fits the blank (like an LLM would predict).</p>
      <div className="flex flex-wrap gap-2">
        {step.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => !showFeedback && setSelected(i)}
            disabled={showFeedback}
            className={`py-3 px-4 rounded-xl border-2 font-semibold transition text-gray-800 dark:text-white ${
              selected === i ? "border-indigo-500 bg-indigo-50 text-gray-900 dark:text-gray-900" : "border-gray-200 hover:border-indigo-300 dark:border-slate-500"
            } ${showFeedback && i === step.correctIndex ? "border-green-500 bg-green-50 text-gray-900 dark:text-gray-900" : ""} ${showFeedback && selected === i && i !== step.correctIndex ? "border-red-300 bg-red-50 text-gray-900 dark:text-gray-900" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>
      {!showFeedback ? (
        <button type="button" onClick={() => selected != null && setShowFeedback(true)} disabled={selected == null} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold disabled:opacity-50">
          Check
        </button>
      ) : (
        <>
          <p className={correct ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>{correct ? "Nice! That's how prediction works." : "The best fit was: " + step.options[step.correctIndex]}</p>
          <button type="button" onClick={() => onComplete(correct)} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
            Next →
          </button>
        </>
      )}
    </div>
  );
}
