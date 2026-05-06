"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const profileSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter a valid phone number"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileForm({
  initialValues,
}: {
  initialValues: ProfileValues;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: ProfileValues) => {
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in again to update your profile.");
        return;
      }

      const upsertPayload = {
        user_id: user.id,
        email: values.email,
        name: values.name,
        phone: values.phone,
      };
      const { error } = await supabase
        .from("customers")
        .upsert(upsertPayload as never, { onConflict: "user_id" });

      if (error) throw error;

      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div className="flex flex-col gap-4">
        <DetailRow label="Full name" value={initialValues.name || "—"} />
        <DetailRow label="Email" value={initialValues.email || "—"} />
        <DetailRow label="Phone" value={initialValues.phone || "—"} />
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditing(true)}
          >
            <PencilLine className="h-3.5 w-3.5" />
            Edit profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Full name</Label>
          <Input {...register("name")} autoComplete="name" />
          {errors.name && (
            <p className="text-xs text-error">{errors.name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Email</Label>
          <Input
            {...register("email")}
            type="email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-error">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Phone</Label>
          <Input {...register("phone")} type="tel" autoComplete="tel" />
          {errors.phone && (
            <p className="text-xs text-error">{errors.phone.message}</p>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving
            </>
          ) : (
            "Save changes"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={saving}
          onClick={() => {
            reset(initialValues);
            setEditing(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 border-b border-border last:border-0 pb-3 last:pb-0">
      <span className="text-[10px] uppercase tracking-[0.2em] text-text-dim sm:w-28 shrink-0">
        {label}
      </span>
      <span className="text-sm text-text">{value}</span>
    </div>
  );
}
