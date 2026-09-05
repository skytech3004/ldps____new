"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import SchemaForm from "@/components/admin/SchemaForm";
import type { CollectionDef } from "@/lib/collections-kit";

type Row = Record<string, unknown> & { _id?: string; id?: string };

function rowId(row: Row) {
  return String(row._id ?? row.id ?? row.slug ?? "");
}

function mutationEndpoint(endpoint: string) {
  const url = new URL(endpoint, "http://localhost");
  url.searchParams.delete("admin");
  url.searchParams.delete("all");
  const search = url.searchParams.toString();
  return `${url.pathname}${search ? `?${search}` : ""}`;
}

export default function CollectionTableEditor({
  def,
  onSaved,
}: {
  def: CollectionDef;
  onSaved?: () => void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(def.defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(() => {
    if (selectedId === "new") return null;
    return rows.find((row) => rowId(row) === selectedId) ?? null;
  }, [rows, selectedId]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(def.endpoint, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to load.");

      if (def.mode === "nested") {
        const items = Array.isArray(data?.[def.nestedKey ?? "items"]) ? data[def.nestedKey ?? "items"] : [];
        setRows(items.map((item: Row, index: number) => ({ ...item, _id: item._id ?? `row-${index}` })));
      } else if (def.mode === "singleton") {
        setRows(data ? [data as Row] : []);
      } else {
        setRows(Array.isArray(data) ? data : []);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.key]);

  useEffect(() => {
    if (selected) setForm({ ...def.defaults, ...selected });
  }, [selected, def.defaults]);

  function openNew() {
    setSelectedId("new");
    setForm({ ...def.defaults });
  }

  async function saveNested(nextRows: Row[]) {
    const payload = {
      ...def.nestedParent,
      [def.nestedKey ?? "items"]: nextRows.map(({ _id, ...rest }) => rest),
    };
    const response = await fetch(mutationEndpoint(def.endpoint), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Save failed.");
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      if (def.mode === "nested") {
        const cleaned = { ...form };
        delete cleaned._id;
        const next =
          selectedId === "new"
            ? [...rows, { ...cleaned, _id: `row-${Date.now()}` }]
            : rows.map((row) => (rowId(row) === selectedId ? { ...row, ...cleaned } : row));
        await saveNested(next);
      } else if (def.replaceList) {
        const next = selectedId === "new" ? [...rows, form] : rows.map((row) => (rowId(row) === selectedId ? { ...row, ...form } : row));
        const response = await fetch(mutationEndpoint(def.endpoint), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(next.map(({ _id, id, ...rest }) => rest)),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Save failed.");
      } else if (def.mode === "singleton" || def.key === "about-pages") {
        const method = def.createMethod ?? "POST";
        const body =
          def.key === "about-pages"
            ? { ...form, slug: form.slug }
            : { ...form, id: rowId(form as Row) || undefined };
        const response = await fetch(mutationEndpoint(def.endpoint), {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Save failed.");
      } else {
        const isNew = selectedId === "new" || !rowId(form as Row);
        const idKey = def.putIdKey ?? "id";
        const body = isNew ? form : { ...form, [idKey]: rowId(form as Row), id: rowId(form as Row), _id: rowId(form as Row) };
        const response = await fetch(mutationEndpoint(def.endpoint), {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Save failed.");
      }
      await load();
      setSelectedId(null);
      onSaved?.();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(row: Row) {
    if (!confirm("Delete this row?")) return;
    setError("");
    try {
      if (def.mode === "nested") {
        await saveNested(rows.filter((item) => rowId(item) !== rowId(row)));
      } else if (def.replaceList) {
        const response = await fetch(mutationEndpoint(def.endpoint), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rows.filter((item) => rowId(item) !== rowId(row)).map(({ _id, id, ...rest }) => rest)),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Delete failed.");
      } else if (def.deleteVia === "query") {
        const response = await fetch(`${mutationEndpoint(def.endpoint)}?id=${rowId(row)}`, { method: "DELETE" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Delete failed.");
      } else {
        const response = await fetch(mutationEndpoint(def.endpoint), {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: rowId(row), _id: rowId(row) }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "Delete failed.");
      }
      await load();
      setSelectedId(null);
      onSaved?.();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wide text-primary">{def.label}</h3>
          <p className="text-xs text-slate-500">{def.description}</p>
        </div>
        <button type="button" onClick={openNew} className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-bold uppercase text-primary">
          <Plus size={12} />
          Add
        </button>
      </div>
      {error ? <p className="text-xs font-semibold text-red-500">{error}</p> : null}
      {loading ? <p className="text-xs text-slate-500">Loading…</p> : null}
      <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200">
        {rows.map((row) => (
          <div key={rowId(row)} className="flex items-center justify-between border-b border-slate-100 px-3 py-2 last:border-0">
            <button type="button" onClick={() => setSelectedId(rowId(row))} className="truncate text-left text-sm font-semibold text-slate-700">
              {String(row[def.titleField] ?? rowId(row) ?? "Untitled")}
            </button>
            {!def.readOnly ? (
              <button type="button" onClick={() => void remove(row)} className="text-red-400 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            ) : null}
          </div>
        ))}
        {rows.length === 0 && !loading ? <p className="px-3 py-4 text-xs text-slate-400">No rows yet.</p> : null}
      </div>
      {(selectedId === "new" || selected) && (
        <div className="space-y-3 rounded-xl border border-slate-200 p-3">
          <SchemaForm schema={def.fields} value={form} onChange={setForm} />
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold uppercase text-white disabled:opacity-60"
          >
            <Save size={12} />
            {saving ? "Saving…" : "Save row"}
          </button>
        </div>
      )}
    </div>
  );
}
