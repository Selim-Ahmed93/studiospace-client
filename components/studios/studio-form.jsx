"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Check,
  ImageIcon,
  LoaderCircle,
  Plus,
  Save,
  X,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import SafeImage from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api-error";
import { AMENITY_SUGGESTIONS, CATEGORY_VALUES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { createStudio, updateStudio } from "@/services/studios";

const studioSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  category: z.enum(CATEGORY_VALUES),
  hourlyRate: z.coerce
    .number({ message: "Enter a valid hourly rate." })
    .min(0, "Hourly rate cannot be negative."),
  securityDeposit: z.coerce
    .number({ message: "Enter a valid security deposit." })
    .min(0, "Security deposit cannot be negative."),
  maxCapacity: z.coerce
    .number({ message: "Enter a valid capacity." })
    .int("Capacity must be a whole number.")
    .min(1, "Capacity must be at least 1."),
  address: z.string().trim().min(1, "Address is required."),
  city: z.string().trim().min(1, "City is required."),
  country: z.string().trim().min(1, "Country is required."),
  imagesText: z
    .string()
    .trim()
    .min(1, "Add at least one image URL.")
    .refine(
      (value) =>
        value
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .every((url) => {
            try {
              const parsed = new URL(url);
              return parsed.protocol === "http:" || parsed.protocol === "https:";
            } catch {
              return false;
            }
          }),
      "Each image must be a valid http(s) URL."
    ),
  overview: z
    .string()
    .trim()
    .min(10, "Overview must be at least 10 characters."),
  amenities: z.array(z.string()).default([]),
});

function AmenityPicker({ value, onChange }) {
  const [customAmenity, setCustomAmenity] = useState("");
  const selected = value || [];

  const toggleAmenity = (amenity) => {
    if (selected.includes(amenity)) {
      onChange(selected.filter((item) => item !== amenity));
    } else {
      onChange([...selected, amenity]);
    }
  };

  const addCustomAmenity = () => {
    const amenity = customAmenity.trim();

    if (!amenity) return;

    if (!selected.includes(amenity)) {
      onChange([...selected, amenity]);
    }

    setCustomAmenity("");
  };

  const customSelected = selected.filter(
    (amenity) => !AMENITY_SUGGESTIONS.includes(amenity)
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {AMENITY_SUGGESTIONS.map((amenity) => {
          const active = selected.includes(amenity);

          return (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
              aria-pressed={active}
            >
              {active ? (
                <Check className="size-3" aria-hidden="true" />
              ) : (
                <Plus className="size-3" aria-hidden="true" />
              )}
              {amenity}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={customAmenity}
          onChange={(event) => setCustomAmenity(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCustomAmenity();
            }
          }}
          placeholder="Add a custom amenity"
          className="h-9"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={addCustomAmenity}
        >
          Add
        </Button>
      </div>

      {customSelected.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {customSelected.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {amenity}
              <button
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className="rounded-full p-0.5 hover:bg-background/60"
                aria-label={`Remove ${amenity}`}
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function StudioForm({ mode = "create", initialStudio, studioId }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studioSchema),
    defaultValues: {
      title: initialStudio?.title || "",
      category: initialStudio?.category || CATEGORY_VALUES[0],
      hourlyRate: initialStudio?.hourlyRate ?? "",
      securityDeposit: initialStudio?.securityDeposit ?? 0,
      maxCapacity: initialStudio?.maxCapacity ?? 1,
      address: initialStudio?.location?.address || "",
      city: initialStudio?.location?.city || "",
      country: initialStudio?.location?.country || "Bangladesh",
      imagesText: initialStudio?.images?.join("\n") || "",
      overview: initialStudio?.overview || "",
      amenities: initialStudio?.amenities || [],
    },
  });

  const amenities = useWatch({ control, name: "amenities" });
  const imagesText = useWatch({ control, name: "imagesText" });
  const previewImage = (imagesText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)[0];

  const onSubmit = async (values) => {
    const images = values.imagesText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      title: values.title.trim(),
      category: values.category,
      hourlyRate: Number(values.hourlyRate),
      securityDeposit: Number(values.securityDeposit || 0),
      maxCapacity: Number(values.maxCapacity),
      location: {
        address: values.address.trim(),
        city: values.city.trim(),
        country: values.country.trim(),
      },
      images,
      amenities: values.amenities,
      overview: values.overview.trim(),
    };

    try {
      if (isEdit) {
        await updateStudio(studioId, payload);
        toast.success("Studio updated successfully.");
      } else {
        await createStudio(payload);
        toast.success("Studio listed successfully.");
      }

      router.push("/my-listings");
      router.refresh();
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        router.push(
          `/login?redirect=${encodeURIComponent(
            isEdit ? `/studios/edit/${studioId}` : "/add-studio"
          )}`
        );
        return;
      }

      const message = getApiErrorMessage(
        requestError,
        "Could not save the studio. Please check the form and try again."
      );

      setError("root", { message });
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {errors.root?.message ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {errors.root.message}
        </p>
      ) : null}

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Studio details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The basics creators see when they browse your listing.
            </p>
          </div>
          <ImageIcon className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>

        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Studio title</Label>
            <Input
              id="title"
              placeholder="Lumen Photography Loft"
              className={cn("h-10", errors.title && "border-destructive")}
              aria-invalid={Boolean(errors.title)}
              {...register("title")}
            />
            {errors.title?.message ? (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                {...register("category")}
              >
                {CATEGORY_VALUES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxCapacity">Maximum capacity</Label>
              <Input
                id="maxCapacity"
                type="number"
                min="1"
                step="1"
                placeholder="8"
                className={cn(
                  "h-10",
                  errors.maxCapacity && "border-destructive"
                )}
                aria-invalid={Boolean(errors.maxCapacity)}
                {...register("maxCapacity")}
              />
              {errors.maxCapacity?.message ? (
                <p className="text-sm text-destructive">
                  {errors.maxCapacity.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="overview">Overview</Label>
            <Textarea
              id="overview"
              rows={5}
              placeholder="Describe the space, the light, the equipment, and what makes it useful for a shoot, recording, or workshop."
              className={cn(errors.overview && "border-destructive")}
              aria-invalid={Boolean(errors.overview)}
              {...register("overview")}
            />
            {errors.overview?.message ? (
              <p className="text-sm text-destructive">
                {errors.overview.message}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight">Pricing</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set an hourly rate and an optional refundable security deposit.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly rate (USD)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              placeholder="45"
              className={cn("h-10", errors.hourlyRate && "border-destructive")}
              aria-invalid={Boolean(errors.hourlyRate)}
              {...register("hourlyRate")}
            />
            {errors.hourlyRate?.message ? (
              <p className="text-sm text-destructive">
                {errors.hourlyRate.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityDeposit">Security deposit (USD)</Label>
            <Input
              id="securityDeposit"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              className={cn(
                "h-10",
                errors.securityDeposit && "border-destructive"
              )}
              aria-invalid={Boolean(errors.securityDeposit)}
              {...register("securityDeposit")}
            />
            {errors.securityDeposit?.message ? (
              <p className="text-sm text-destructive">
                {errors.securityDeposit.message}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight">Location</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Help creators find the space and plan their visit.
        </p>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street address</Label>
            <Input
              id="address"
              placeholder="12 Gulshan Avenue"
              className={cn("h-10", errors.address && "border-destructive")}
              aria-invalid={Boolean(errors.address)}
              {...register("address")}
            />
            {errors.address?.message ? (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Dhaka"
                className={cn("h-10", errors.city && "border-destructive")}
                aria-invalid={Boolean(errors.city)}
                {...register("city")}
              />
              {errors.city?.message ? (
                <p className="text-sm text-destructive">{errors.city.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Bangladesh"
                className={cn("h-10", errors.country && "border-destructive")}
                aria-invalid={Boolean(errors.country)}
                {...register("country")}
              />
              {errors.country?.message ? (
                <p className="text-sm text-destructive">
                  {errors.country.message}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight">Photos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste direct image URLs, one per line. The first image is used as the
          cover.
        </p>

        <div className="mt-5 space-y-2">
          <Label htmlFor="imagesText">Image URLs</Label>
          <Textarea
            id="imagesText"
            rows={4}
            placeholder="https://images.unsplash.com/photo-...&#10;https://images.unsplash.com/photo-..."
            className={cn(errors.imagesText && "border-destructive")}
            aria-invalid={Boolean(errors.imagesText)}
            {...register("imagesText")}
          />
          {errors.imagesText?.message ? (
            <p className="text-sm text-destructive">
              {errors.imagesText.message}
            </p>
          ) : null}
        </div>

        {previewImage ? (
          <div className="mt-4 overflow-hidden rounded-xl border bg-muted">
            <SafeImage
              src={previewImage}
              alt="Cover image preview"
              className="aspect-[16/9] h-full w-full object-cover"
            />
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight">Amenities</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select what the space includes, or add your own.
        </p>

        <div className="mt-5">
          <AmenityPicker
            value={amenities}
            onChange={(next) =>
              setValue("amenities", next, { shouldDirty: true })
            }
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to my listings
        </Link>

        <Button type="submit" className="h-11 px-6" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {isSubmitting
            ? "Saving..."
            : isEdit
            ? "Save changes"
            : "Publish studio"}
        </Button>
      </div>
    </form>
  );
}
