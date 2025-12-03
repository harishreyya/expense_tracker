"use client";

import { useState, FormEvent } from "react";

interface ProfileNameEditorProps {
  initialName: string | null;
}

export default function ProfileNameEditor({ initialName }: ProfileNameEditorProps) {
  const [value, setValue] = useState(initialName ?? "");
  const [editing, setEditing] = useState(!initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/settings/name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Could not update name. Please try again.");
        return;
      }

      const data = await res.json();
      setValue(data.name || trimmed);
      setEditing(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!editing && !value) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-1 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-3 py-1.5 text-xs text-slate-500 hover:border-sky-400 hover:text-slate-800"
      >
        <span className="text-sm">＋</span>
        <span>Add a display name</span>
      </button>
    );
  }

  return (
    <div className="space-y-1">
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50/80 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            placeholder="Your name"
          />
          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-50 shadow-sm transition hover:bg-slate-800 disabled:opacity-70"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => {
                setEditing(false);
                setValue(initialName ?? "");
                setError(null);
              }}
              className="text-[11px] text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            {error && <span className="ml-2 text-[11px] text-rose-500">{error}</span>}
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2">
          <span className="truncate text-sm text-slate-900">{value}</span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-[11px] text-sky-500 hover:text-sky-600"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
