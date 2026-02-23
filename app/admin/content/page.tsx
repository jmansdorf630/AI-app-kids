"use client";

import { useState, useCallback } from "react";
import { lessons } from "@/data/lessons";

export default function AdminContentPage() {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(lessons, null, 2));
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">🛠 Admin – Lesson content</h1>
      <p className="text-sm text-gray-600">
        View and edit lesson JSON. Export to download, or upload a JSON file to import. Changes here are for export only — the app still uses the code in <code className="bg-gray-200 px-1 rounded">/data/lessons.ts</code>.
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
