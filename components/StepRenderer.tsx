"use client";

import { useState } from "react";
import type { Step, InfoStep, McqStep, MatchStep, OrderStep, SpotStep } from "@/types";

interface StepRendererProps {
  step: Step;
  onComplete: (correct: boolean) => void;
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
    default:
      return null;
  }
}

function InfoStepBlock({ step, onComplete }: { step: InfoStep; onComplete: (c: boolean) => void }) {
  return (
    <div className="space-y-4">
      {step.emoji && <div className="text-5xl text-center">{step.emoji}</div>}
      <h2 className="text-xl font-bold text-gray-800">{step.title}</h2>
      <p className="text-gray-700 leading-relaxed">{step.text}</p>
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

function McqStepBlock({ step, onComplete }: { step: McqStep; onComplete: (c: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const chosen = selected != null ? step.options.find((o) => o.id === selected) : null;

  const handleSubmit = () => {
    if (selected == null) return;
    setShowFeedback(true);
  };

  const handleNext = () => {
    onComplete(chosen?.correct ?? false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">{step.question}</h2>
      <div className="space-y-2">
        {step.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            data-choice
            onClick={() => !showFeedback && setSelected(opt.id)}
            disabled={showFeedback}
            className={`w-full text-left py-3 px-4 rounded-xl border-2 font-semibold transition ${
              selected === opt.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300"
            } ${showFeedback && opt.correct ? "border-green-500 bg-green-50" : ""} ${showFeedback && selected === opt.id && !opt.correct ? "border-red-300 bg-red-50" : ""}`}
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
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-gray-700">
              {chosen.explain}
            </div>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-green-500 text-white font-bold"
          >
            Next →
          </button>
        </>
      )}
    </div>
  );
}

function MatchStepBlock({ step, onComplete }: { step: MatchStep; onComplete: (c: boolean) => void }) {
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [pairs, setPairs] = useState<{ left: string; right: string }[]>([]);
  const lefts = step.pairs.map((p) => p.left);
  const rights = step.pairs.map((p) => p.right);
  const [shuffledRight] = useState(() => [...rights].sort(() => Math.random() - 0.5));

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

  const checkCorrect = () => {
    const correctOrder = step.pairs.map((p) => p.left);
    const userOrder = pairs.map((p) => p.left);
    const correct = correctOrder.length === userOrder.length && correctOrder.every((l, i) => userOrder[i] === l && step.pairs.find((x) => x.left === l)?.right === pairs[i].right);
    return correct;
  };

  const allPaired = pairs.length === step.pairs.length;
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleCheck = () => {
    const c = checkCorrect();
    setCorrect(c);
    setChecked(true);
  };

  const handleNext = () => {
    onComplete(correct);
  };

  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-800">{step.instruction}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          {lefts.map((left) => (
            <div
              key={left}
              onClick={() => !checked && handleLeft(left)}
              className={`py-2 px-3 rounded-xl border-2 cursor-pointer ${
                leftSelected === left ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
              } ${pairs.some((p) => p.left === left) ? "opacity-60" : ""}`}
            >
              {left}
            </div>
          ))}
        </div>
        <div className="flex-1 space-y-2">
          {shuffledRight.map((right) => (
            <div
              key={right}
              onClick={() => !checked && leftSelected && handleRight(right)}
              className={`py-2 px-3 rounded-xl border-2 cursor-pointer ${
                pairs.some((p) => p.right === right) ? "opacity-60 border-green-200 bg-green-50" : "border-gray-200"
              }`}
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

function OrderStepBlock({ step, onComplete }: { step: OrderStep; onComplete: (c: boolean) => void }) {
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

  const handleCheck = () => setChecked(true);
  const handleNext = () => onComplete(isCorrect);

  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-800">{step.instruction}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="flex items-center gap-2 p-3 rounded-xl border-2 border-gray-200 bg-white"
          >
            <span className="text-gray-500 font-bold w-6">{i + 1}.</span>
            <span className="flex-1">{item}</span>
            <div className="flex gap-1">
              {i > 0 && (
                <button type="button" onClick={() => move(i, i - 1)} className="px-2 py-1 rounded bg-gray-200 font-bold">
                  ↑
                </button>
              )}
              {i < items.length - 1 && (
                <button type="button" onClick={() => move(i, i + 1)} className="px-2 py-1 rounded bg-gray-200 font-bold">
                  ↓
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {!checked ? (
        <button type="button" onClick={handleCheck} className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold">
          Check order
        </button>
      ) : (
        <>
          <p className={isCorrect ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
            {isCorrect ? "Correct order!" : "Not quite. Re-read the lesson to see the right order."}
          </p>
          <button type="button" onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
            Next →
          </button>
        </>
      )}
    </div>
  );
}

function SpotStepBlock({ step, onComplete }: { step: SpotStep; onComplete: (c: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const chosen = selected != null ? step.options.find((o) => o.id === selected) : null;

  const handleSubmit = () => {
    if (selected == null) return;
    setShowFeedback(true);
  };

  const handleNext = () => {
    onComplete(chosen?.correct ?? false);
  };

  return (
    <div className="space-y-4">
      <p className="font-semibold text-gray-700">{step.instruction}</p>
      <div className="p-4 rounded-xl bg-gray-100 border-2 border-gray-200 italic text-gray-700">
        {step.aiAnswer}
      </div>
      <h2 className="text-lg font-bold text-gray-800">{step.question}</h2>
      <div className="space-y-2">
        {step.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            data-choice
            onClick={() => !showFeedback && setSelected(opt.id)}
            disabled={showFeedback}
            className={`w-full text-left py-3 px-4 rounded-xl border-2 font-semibold transition ${
              selected === opt.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
            } ${showFeedback && opt.correct ? "border-green-500 bg-green-50" : ""} ${showFeedback && selected === opt.id && !opt.correct ? "border-red-300 bg-red-50" : ""}`}
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
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-gray-700">
              {chosen.explain}
            </div>
          )}
          <button type="button" onClick={handleNext} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold">
            Next →
          </button>
        </>
      )}
    </div>
  );
}
