"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/client";
import { Eyebrow } from "@/components/admin/SpecimenChrome";
import { BIOME_COLOR_VAR, BIOME_LABEL_VI, BIOME_OPTIONS, type Biome } from "@/lib/api/types";

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "tags" // input "a, b, c" -> string[]
  | "months" // input "3, 4, 5" -> number[]
  | "json" // textarea JSON.parse khi submit
  | "datetime";

export interface FieldConfig<T> {
  key: keyof T;
  label: string;
  type: FieldType;
  options?: string[]; // cho type "select"
  required?: boolean;
  hint?: string;
  /** Không cho sửa khi update (thường là khoá chính) */
  lockOnEdit?: boolean;
}

interface ResourceManagerProps<T extends object> {
  title: string;
  /** Mô tả ngắn dưới tiêu đề, giọng văn như description của EnvironmentSection trên trang khai thác */
  description: string;
  /** Eyebrow honey phía trên tiêu đề — ví dụ "Hồ sơ thực vật" */
  eyebrow: string;
  /** Danh từ số ít dùng trong câu trạng thái rỗng/xác nhận xoá, ví dụ "tiêu bản", "bài viết" */
  noun: string;
  primaryKey: keyof T;
  fields: FieldConfig<T>[];
  emptyItem: T;
  api: {
    list: () => Promise<T[]>;
    upsert: (payload: T) => Promise<void>;
    remove: (key: string) => Promise<void>;
  };
  /** Cột hiển thị ở bảng list, mặc định dùng primaryKey + field đầu tiên */
  listColumns?: (keyof T)[];
}

const selectClass =
  "flex h-12 w-full rounded-[var(--radius-card)] border border-line bg-canvas px-4 text-base text-ink outline-none transition-colors focus-visible:border-pine disabled:cursor-not-allowed disabled:opacity-50";

const textareaClass =
  "w-full rounded-[var(--radius-card)] border border-line bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus-visible:border-pine disabled:cursor-not-allowed disabled:opacity-50";

function toInputValue(value: unknown, type: FieldType): string {
  if (value === undefined || value === null) return "";
  if (type === "tags" || type === "months") {
    return Array.isArray(value) ? value.join(", ") : String(value);
  }
  if (type === "json") {
    return typeof value === "string" ? value : JSON.stringify(value, null, 2);
  }
  if (type === "datetime") {
    return String(value).slice(0, 10);
  }
  return String(value);
}

function fromInputValue(raw: string, type: FieldType): unknown {
  switch (type) {
    case "tags":
      return raw.split(",").map((s) => s.trim()).filter(Boolean);
    case "months":
      return raw.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n));
    case "number":
      return raw === "" ? 0 : Number(raw);
    case "json":
      return raw.trim() === "" ? null : JSON.parse(raw);
    case "datetime":
      return raw ? new Date(raw).toISOString() : null;
    default:
      return raw;
  }
}

function isBiomeValue(v: unknown): v is Biome {
  return typeof v === "string" && (BIOME_OPTIONS as string[]).includes(v);
}

/** Hiển thị giá trị 1 cột trong bảng — badge cho enum, text thường cho phần còn lại. */
function Cell<T extends object>({
  value,
  field,
  isPrimary,
}: {
  value: unknown;
  field?: FieldConfig<T>;
  isPrimary: boolean;
}) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-ink-faint">—</span>;
  }

  if (isBiomeValue(value)) {
    return (
      <Badge variant="biome" dotColor={BIOME_COLOR_VAR[value]}>
        {BIOME_LABEL_VI[value]}
      </Badge>
    );
  }

  if (field?.type === "select") {
    return <Badge variant="outline">{String(value)}</Badge>;
  }

  if (Array.isArray(value)) {
    return <span className="text-ink-soft">{value.join(", ")}</span>;
  }

  if (isPrimary) {
    return <span className="font-display text-ink">{String(value)}</span>;
  }

  return <span className="text-ink-soft">{String(value)}</span>;
}

export default function ResourceManager<T extends object>({
  title,
  description,
  eyebrow,
  noun,
  primaryKey,
  fields,
  emptyItem,
  api,
  listColumns,
}: ResourceManagerProps<T>) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const columns = (listColumns ?? [primaryKey, fields[0]?.key].filter(Boolean)) as (keyof T)[];
  const fieldByKey = new Map(fields.map((f) => [f.key, f]));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api.list();
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Không tải được dữ liệu.");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ chạy 1 lần lúc mount, api stable theo resource
  }, []);

  async function refresh() {
    setError(null);
    try {
      setItems(await api.list());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tải được dữ liệu.");
    }
  }

  function openCreate() {
    setEditing(emptyItem);
    const initial: Record<string, string> = {};
    fields.forEach((f) => (initial[f.key as string] = toInputValue(emptyItem[f.key], f.type)));
    setFormValues(initial);
    setFormError(null);
  }

  function openEdit(item: T) {
    setEditing(item);
    const initial: Record<string, string> = {};
    fields.forEach((f) => (initial[f.key as string] = toInputValue(item[f.key], f.type)));
    setFormValues(initial);
    setFormError(null);
  }

  async function handleDelete(item: T) {
    const key = String(item[primaryKey]);
    if (!confirm(`Xoá ${noun} "${key}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await api.remove(key);
      await refresh();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Xoá thất bại.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const payload = { ...editing } as Record<string, unknown>;
      for (const f of fields) {
        payload[f.key as string] = fromInputValue(formValues[f.key as string] ?? "", f.type);
      }
      await api.upsert(payload as T);
      setEditing(null);
      await refresh();
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : err instanceof SyntaxError
            ? "JSON không hợp lệ — kiểm tra lại cú pháp."
            : "Lưu thất bại."
      );
    } finally {
      setSaving(false);
    }
  }

  const isEditMode = !!editing && !!String(editing[primaryKey] ?? "");

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="max-w-xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-1 font-display text-2xl text-ink sm:text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{description}</p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="size-4" />
          Thêm {noun}
        </Button>
      </div>

      {error && (
        <p className="mb-4 rounded-[var(--radius-card)] border border-dashed border-honey-dark/40 bg-honey-soft px-4 py-2.5 text-sm text-honey-dark">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft shadow-card">
        <div className="biome-spectrum-bg h-1 w-full" />

        {items === null ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-sm italic text-ink-faint">Đang lục hồ sơ...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="m-5 rounded-[var(--radius-card)] border border-dashed border-line py-14 text-center">
            <p className="font-display text-base italic text-ink-faint">
              Chưa có {noun} nào được ghi nhận.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={openCreate}>
              <Plus className="size-4" />
              Thêm {noun} đầu tiên
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dashed border-line">
                {columns.map((c) => (
                  <th key={String(c)} className="px-5 py-3 text-left">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-honey-dark">
                      {fieldByKey.get(c)?.label ?? String(c)}
                    </span>
                  </th>
                ))}
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={String(item[primaryKey])}
                  className="border-b border-dashed border-line transition-colors last:border-b-0 hover:bg-pine-soft/40"
                >
                  {columns.map((c, i) => (
                    <td key={String(c)} className="max-w-[16rem] truncate px-5 py-3.5">
                      <Cell value={item[c]} field={fieldByKey.get(c)} isPrimary={i === 0} />
                    </td>
                  ))}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Sửa ${String(item[primaryKey])}`}
                      onClick={() => openEdit(item)}
                      className="size-8 text-pine hover:bg-pine-soft"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Xoá ${String(item[primaryKey])}`}
                      onClick={() => handleDelete(item)}
                      className="size-8 text-honey-dark hover:bg-honey-soft"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="max-h-[88vh] w-full max-w-lg overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft shadow-card"
          >
            <div className="biome-spectrum-bg h-1 w-full" />

            <div className="max-h-[calc(88vh-0.25rem)] overflow-y-auto p-6">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <Eyebrow>{isEditMode ? "Sửa hồ sơ" : `${noun[0].toUpperCase()}${noun.slice(1)} mới`}</Eyebrow>
                  <h2 className="mt-1 font-display text-lg text-ink">
                    {isEditMode ? String(editing[primaryKey]) : `Thêm ${noun}`}
                  </h2>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Đóng"
                  onClick={() => setEditing(null)}
                  className="size-8 shrink-0"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                {fields.map((f) => {
                  const isLocked = f.lockOnEdit && isEditMode;
                  return (
                    <div key={String(f.key)}>
                      <label className="mb-1.5 block text-sm font-medium text-ink">
                        {f.label}
                        {f.required && <span className="text-honey-dark"> *</span>}
                      </label>
                      {f.type === "select" ? (
                        <select
                          className={selectClass}
                          value={formValues[f.key as string] ?? ""}
                          onChange={(e) => setFormValues((v) => ({ ...v, [f.key as string]: e.target.value }))}
                          disabled={isLocked}
                          required={f.required}
                        >
                          <option value="">— Chọn —</option>
                          {f.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : f.type === "textarea" || f.type === "json" ? (
                        <textarea
                          className={cn(textareaClass, f.type === "json" && "font-mono text-xs")}
                          rows={f.type === "json" ? 8 : 3}
                          value={formValues[f.key as string] ?? ""}
                          onChange={(e) => setFormValues((v) => ({ ...v, [f.key as string]: e.target.value }))}
                          disabled={isLocked}
                          required={f.required}
                        />
                      ) : (
                        <Input
                          type={f.type === "number" ? "number" : f.type === "datetime" ? "date" : "text"}
                          className="bg-canvas"
                          value={formValues[f.key as string] ?? ""}
                          onChange={(e) => setFormValues((v) => ({ ...v, [f.key as string]: e.target.value }))}
                          disabled={isLocked}
                          required={f.required}
                        />
                      )}
                      {f.hint && <p className="mt-1 font-display text-xs italic text-ink-faint">{f.hint}</p>}
                    </div>
                  );
                })}
              </div>

              {formError && (
                <p className="mt-4 rounded-[var(--radius-card)] border border-dashed border-honey-dark/40 bg-honey-soft px-3 py-2 text-sm text-honey-dark">
                  {formError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-2 border-t border-dashed border-line pt-4">
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Hủy
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
