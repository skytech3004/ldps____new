"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import type { FieldSchema } from "@/lib/cms-types";
import { defaultArrayItem } from "@/lib/ui-kit";

type SchemaFormProps = {
  schema: FieldSchema[];
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export default function SchemaForm({ schema, value, onChange }: SchemaFormProps) {
  function setField(key: string, next: unknown) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="space-y-4">
      {schema.map((field) => {
        const current = value[field.key];

        if (field.type === "array") {
          const items = Array.isArray(current) ? (current as Record<string, unknown>[]) : [];
          return (
            <div key={field.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{field.label}</p>
                <button
                  type="button"
                  onClick={() => setField(field.key, [...items, defaultArrayItem(field.itemFields)])}
                  className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary"
                >
                  <Plus size={12} />
                  Add {field.itemLabel ?? "item"}
                </button>
              </div>
              {items.map((item, index) => (
                <div key={`${field.key}-${index}`} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-slate-500">
                      {field.itemLabel ?? "Item"} {index + 1}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (index === 0) return;
                          const next = [...items];
                          [next[index - 1], next[index]] = [next[index], next[index - 1]];
                          setField(field.key, next);
                        }}
                        className="rounded p-1 text-slate-500 hover:bg-white"
                        aria-label="Move up"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (index === items.length - 1) return;
                          const next = [...items];
                          [next[index + 1], next[index]] = [next[index], next[index + 1]];
                          setField(field.key, next);
                        }}
                        className="rounded p-1 text-slate-500 hover:bg-white"
                        aria-label="Move down"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setField(field.key, items.filter((_, itemIndex) => itemIndex !== index))}
                        className="rounded p-1 text-red-500 hover:bg-white"
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <SchemaForm
                    schema={field.itemFields ?? []}
                    value={asRecord(item)}
                    onChange={(nextItem) => {
                      const next = [...items];
                      next[index] = nextItem;
                      setField(field.key, next);
                    }}
                  />
                </div>
              ))}
            </div>
          );
        }

        if (field.type === "image") {
          return (
            <ImageUploadField
              key={field.key}
              label={field.label}
              value={String(current ?? "")}
              onChange={(next) => setField(field.key, next)}
            />
          );
        }

        if (field.type === "boolean") {
          return (
            <label key={field.key} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={Boolean(current)}
                onChange={(event) => setField(field.key, event.target.checked)}
              />
              {field.label}
            </label>
          );
        }

        if (field.type === "select") {
          return (
            <label key={field.key} className="block space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{field.label}</span>
              <select
                value={String(current ?? "")}
                onChange={(event) => setField(field.key, event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {(field.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          );
        }

        if (field.type === "json") {
          return (
            <label key={field.key} className="block space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{field.label}</span>
              <textarea
                value={typeof current === "string" ? current : JSON.stringify(current ?? [], null, 2)}
                onChange={(event) => {
                  try {
                    setField(field.key, JSON.parse(event.target.value || "[]"));
                  } catch {
                    setField(field.key, event.target.value);
                  }
                }}
                rows={8}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs"
              />
            </label>
          );
        }

        if (field.type === "csv") {
          const text = Array.isArray(current) ? (current as unknown[]).map(String).join(", ") : String(current ?? "");
          return (
            <label key={field.key} className="block space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{field.label}</span>
              <input
                value={text}
                placeholder={field.placeholder ?? "Comma-separated values"}
                onChange={(event) =>
                  setField(
                    field.key,
                    event.target.value
                      .split(",")
                      .map((part) => part.trim())
                      .filter(Boolean)
                  )
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </label>
          );
        }

        if (field.type === "text") {
          return (
            <label key={field.key} className="block space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{field.label}</span>
              <textarea
                value={String(current ?? "")}
                onChange={(event) => setField(field.key, event.target.value)}
                rows={5}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </label>
          );
        }

        return (
          <label key={field.key} className="block space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{field.label}</span>
            <input
              type={field.type === "number" ? "number" : "text"}
              value={String(current ?? "")}
              placeholder={field.placeholder}
              onChange={(event) =>
                setField(field.key, field.type === "number" ? Number(event.target.value) : event.target.value)
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            />
          </label>
        );
      })}
    </div>
  );
}
