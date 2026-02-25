"use client";

import { useState, useCallback, useEffect } from "react";
import { lessons } from "@/data/lessons";
import { isAdminMode, setAdminMode } from "@/lib/progress";

export default function AdminContentPage() {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(lessons, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [adminOn, setAdminOn] = useState(false);

  useEffect(() => {
    setAdminOn(isAdminMode());
  }, []);

  const validate = useCallback(() => {
    try {
      JSON.parse(jsonText);
      setError(null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      return false;
    }
  }, [jsonText]);

  const handleExport = () => {
    if (!validate()) return;
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-quest-lessons.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      try {
        JSON.parse(text);
        setJsonText(text);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid JSON");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetToDefault = () => {
    setJsonText(JSON.stringify(lessons, null, 2));
    setError(null);
  };

  const handleAdminToggle = () => {
    const next = !adminOn;
    setAdminMode(next);
    setAdminOn(next);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">🛠 Admin – Lesson content</h1>

      <section className="rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-4">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Admin privileges</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={adminOn}
            onChange={handleAdminToggle}
            className="w-4 h-4 rounded border-2 border-indigo-500 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          />
          <span className="text-gray-800 dark:text-gray-200 font-medium">Unlimited XP (unlock all avatar items)</span>
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          When on: 99,999 XP and all avatar shop items show as unlockable. Go to Avatar or Home to see it.
        </p>
      </section>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        View and edit lesson JSON. Export to download, or upload a JSON file to import. Changes here are for export only — the app still uses the code in <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">/data/lessons.ts</code>.
      </p>

      {error && (
        <div className="p-3 rounded-xl bg-red-100 text-red-800 text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="py-2 px-4 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600"
        >
          Export JSON
        </button>
        <label className="py-2 px-4 rounded-xl border-2 border-indigo-300 text-indigo-700 font-semibold cursor-pointer hover:bg-indigo-50">
          Import JSON
          <input type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>
        <button
          type="button"
          onClick={handleResetToDefault}
          className="py-2 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
        >
          Reset to default
        </button>
      </div>

      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        onBlur={validate}
        className="w-full h-[60vh] font-mono text-sm p-4 rounded-xl border-2 border-gray-200 bg-white"
        spellCheck={false}
      />
    </div>
  );
}
