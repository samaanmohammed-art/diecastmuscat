"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ALL_BRANDS, ALL_SCALES } from "@/lib/sample-products";
import { createClient } from "@/lib/supabase/client";
import type { Product, ProductCategory, ProductScale } from "@/types/database";

const CATEGORIES: ProductCategory[] = ["cars", "planes", "trucks", "bikes"];
const CONDITIONS = ["mint", "new", "sealed"] as const;

const featureSchema = z.object({
  key: z.string().min(1, "Required"),
  value: z.string().min(1, "Required"),
});

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().min(2, "SKU is required"),
  category: z.enum(["cars", "planes", "trucks", "bikes"]),
  scale: z.enum(["1:64", "1:43", "1:24", "1:18", "1:12"]),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock must be 0 or higher"),
  is_limited_edition: z.boolean(),
  is_featured: z.boolean(),
  condition: z.enum(["mint", "new", "sealed"]),
  features: z.array(featureSchema),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
});

export type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initial?: Product | null;
  mode: "create" | "edit";
}

function featuresToArray(features: Record<string, unknown>) {
  return Object.entries(features ?? {}).map(([key, value]) => ({
    key,
    value: typeof value === "string" ? value : JSON.stringify(value),
  }));
}

function arrayToFeatures(arr: { key: string; value: string }[]) {
  const out: Record<string, unknown> = {};
  for (const { key, value } of arr) {
    if (!key) continue;
    if (value === "true") out[key] = true;
    else if (value === "false") out[key] = false;
    else if (!Number.isNaN(Number(value)) && value.trim() !== "") {
      out[key] = Number(value);
    } else out[key] = value;
  }
  return out;
}

export function ProductForm({ initial, mode }: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initial?.name ?? "",
      sku: initial?.sku ?? "",
      category: (initial?.category as ProductCategory) ?? "cars",
      scale: (initial?.scale as ProductScale) ?? "1:18",
      brand: initial?.brand ?? "",
      description: initial?.description ?? "",
      price: initial?.price ?? 0,
      stock: initial?.stock ?? 0,
      is_limited_edition: initial?.is_limited_edition ?? false,
      is_featured: initial?.is_featured ?? false,
      condition: initial?.condition ?? "mint",
      features: featuresToArray(initial?.features ?? {}),
      images: initial?.images ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const images = watch("images");

  const handleUpload = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;
      setUploading(true);
      setError(null);
      try {
        const supabase = createClient();
        const urls: string[] = [];
        for (const file of list) {
          const ext = file.name.split(".").pop() ?? "jpg";
          const path = `${crypto.randomUUID()}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from("products")
            .upload(path, file, { cacheControl: "3600", upsert: false });
          if (uploadErr) {
            // Fall back to local object URL so the form still works in dev
            urls.push(URL.createObjectURL(file));
            continue;
          }
          const { data } = supabase.storage.from("products").getPublicUrl(path);
          urls.push(data.publicUrl);
        }
        setValue("images", [...(images ?? []), ...urls], { shouldDirty: true });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [images, setValue]
  );

  function removeImage(idx: number) {
    setValue(
      "images",
      images.filter((_, i) => i !== idx),
      { shouldDirty: true }
    );
  }

  async function onSubmit(values: ProductFormValues, action: "save" | "save-add" | "save-continue") {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...values,
        features: arrayToFeatures(values.features),
      };
      const url =
        mode === "create" ? "/api/products" : `/api/products/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? `Request failed (${res.status})`);
      }
      if (action === "save-add") {
        router.push("/admin/products/new");
        router.refresh();
        return;
      }
      if (action === "save-continue" && mode === "create") {
        const data = await res.json().catch(() => ({}));
        if (data?.id) {
          router.push(`/admin/products/${data.id}/edit`);
          router.refresh();
          return;
        }
      }
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit((v) => onSubmit(v, "save"))}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Left column — fields */}
      <div className="lg:col-span-2 space-y-8">
        {/* Section: Basics */}
        <section className="rounded-lg border border-border bg-surface p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Basics</h2>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} className="mt-2" />
            {errors.name && <FieldError msg={errors.name.message} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register("sku")} className="mt-2 font-mono" />
              {errors.sku && <FieldError msg={errors.sku.message} />}
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                list="admin-brands"
                {...register("brand")}
                className="mt-2"
              />
              <datalist id="admin-brands">
                {ALL_BRANDS.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
              {errors.brand && <FieldError msg={errors.brand.message} />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                {...register("category")}
                className="mt-2 h-11 w-full rounded-md border border-input bg-surface px-3 text-sm text-text focus:outline-none focus:border-gold capitalize"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="scale">Scale</Label>
              <select
                id="scale"
                {...register("scale")}
                className="mt-2 h-11 w-full rounded-md border border-input bg-surface px-3 text-sm text-text focus:outline-none focus:border-gold"
              >
                {ALL_SCALES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              className="mt-2"
              rows={5}
            />
            {errors.description && <FieldError msg={errors.description.message} />}
          </div>
        </section>

        {/* Section: Pricing & stock */}
        <section className="rounded-lg border border-border bg-surface p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Pricing & stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (OMR)</Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                {...register("price", { valueAsNumber: true })}
                className="mt-2"
              />
              {errors.price && <FieldError msg={errors.price.message} />}
            </div>
            <div>
              <Label htmlFor="stock">Stock units</Label>
              <Input
                id="stock"
                type="number"
                step="1"
                {...register("stock", { valueAsNumber: true })}
                className="mt-2"
              />
              {errors.stock && <FieldError msg={errors.stock.message} />}
            </div>
          </div>
        </section>

        {/* Section: Flags */}
        <section className="rounded-lg border border-border bg-surface p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Flags & condition</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleField
              label="Limited edition"
              hint="Marked numbered / collector pieces"
              control={control}
              name="is_limited_edition"
            />
            <ToggleField
              label="Featured"
              hint="Show on the home page curator's selection"
              control={control}
              name="is_featured"
            />
          </div>

          <div>
            <Label>Condition</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {CONDITIONS.map((c) => (
                <label
                  key={c}
                  className={cn(
                    "relative flex items-center justify-center h-11 rounded-md border bg-surface cursor-pointer transition-colors",
                    "border-border-strong text-text-muted hover:border-gold-muted hover:text-text",
                    "has-[:checked]:border-gold has-[:checked]:text-gold has-[:checked]:bg-gold/5"
                  )}
                >
                  <input
                    type="radio"
                    value={c}
                    {...register("condition")}
                    className="sr-only"
                  />
                  <span className="text-xs uppercase tracking-[0.16em] capitalize">
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Features */}
        <section className="rounded-lg border border-border bg-surface p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Features</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ key: "", value: "" })}
            >
              <Plus className="h-4 w-4" />
              Add feature
            </Button>
          </div>
          <div className="space-y-2">
            {fields.length === 0 && (
              <p className="text-sm text-text-muted">
                Add key-value pairs like doors_open / true, numbered / 0042/0500.
              </p>
            )}
            {fields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input
                  placeholder="Key (e.g. doors_open)"
                  {...register(`features.${idx}.key` as const)}
                />
                <Input
                  placeholder="Value (e.g. true)"
                  {...register(`features.${idx}.value` as const)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(idx)}
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right column — images */}
      <div className="lg:col-span-1">
        <section className="rounded-lg border border-border bg-surface p-6 space-y-4 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Images</h2>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
            }}
            className={cn(
              "block cursor-pointer rounded-lg border-2 border-dashed transition-colors text-center px-6 py-10",
              dragOver
                ? "border-gold bg-gold/5"
                : "border-border-strong hover:border-gold-muted"
            )}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.length) handleUpload(e.target.files);
              }}
            />
            <Upload className="h-6 w-6 text-gold mx-auto" />
            <div className="mt-3 text-sm text-text">
              {uploading ? "Uploading…" : "Drag & drop, or click to browse"}
            </div>
            <div className="mt-1 text-xs text-text-muted">
              JPG, PNG or WebP up to 5 MB.
            </div>
          </label>

          {errors.images && <FieldError msg={errors.images.message as string} />}

          {images.length > 0 && (
            <ul className="grid grid-cols-2 gap-2">
              {images.map((src, idx) => (
                <li
                  key={`${src}-${idx}`}
                  className="relative aspect-square rounded-md overflow-hidden border border-border bg-surface-elevated"
                >
                  <Image
                    src={src}
                    alt={`Image ${idx + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1.5 right-1.5 h-6 w-6 inline-flex items-center justify-center rounded-full bg-black/70 text-text hover:bg-error/80 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Footer actions — span full width */}
      <div className="lg:col-span-3 sticky bottom-0 -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 py-4 bg-bg/85 backdrop-blur-md border-t border-border">
        {error && (
          <div className="mb-3 rounded-md border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
            {error}
          </div>
        )}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/products")}
            disabled={submitting}
          >
            Cancel
          </Button>
          {mode === "create" && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleSubmit((v) => onSubmit(v, "save-add"))}
                disabled={submitting}
              >
                Save & add another
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSubmit((v) => onSubmit(v, "save-continue"))}
                disabled={submitting}
              >
                Save & continue editing
              </Button>
            </>
          )}
          <Button type="submit" disabled={submitting || (mode === "edit" && !isDirty)}>
            {submitting ? "Saving…" : mode === "create" ? "Save product" : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-xs text-error">{msg}</p>;
}

interface ToggleFieldProps {
  label: string;
  hint?: string;
  control: ReturnType<typeof useForm<ProductFormValues>>["control"];
  name: "is_limited_edition" | "is_featured";
}

function ToggleField({ label, hint, control, name }: ToggleFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <button
          type="button"
          onClick={() => field.onChange(!field.value)}
          className={cn(
            "flex items-start gap-3 rounded-md border p-4 text-left transition-colors",
            field.value
              ? "border-gold bg-gold/5"
              : "border-border-strong hover:border-gold-muted"
          )}
        >
          <span
            className={cn(
              "mt-0.5 h-5 w-9 rounded-full border transition-colors flex items-center px-0.5",
              field.value ? "bg-gold border-gold justify-end" : "bg-surface border-border-strong justify-start"
            )}
          >
            <span
              className={cn(
                "h-3.5 w-3.5 rounded-full transition-colors",
                field.value ? "bg-black" : "bg-text-muted"
              )}
            />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-medium text-text">{label}</span>
            {hint && <span className="block text-xs text-text-muted mt-0.5">{hint}</span>}
          </span>
        </button>
      )}
    />
  );
}
