"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  SlidersHorizontal,
  WifiOff,
  X,
} from "lucide-react";

import EmptyState from "@/components/shared/empty-state";
import StudioCard from "@/components/studios/studio-card";
import StudioGridSkeleton from "@/components/studios/studio-card-skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getApiErrorMessage } from "@/lib/api-error";
import { STUDIO_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { fetchStudios } from "@/services/studios";

const PAGE_SIZE = 9;

function FilterFields({
  category,
  city,
  minPrice,
  maxPrice,
  onCategoryChange,
  onApply,
  onClear,
}) {
  return (
    <form onSubmit={onApply} className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Category</h2>
        <div className="mt-3 space-y-1">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
              category === "all"
                ? "bg-primary/10 font-semibold text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            All categories
            {category === "all" ? (
              <span className="size-1.5 rounded-full bg-primary" />
            ) : null}
          </button>

          {STUDIO_CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onCategoryChange(item.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                category === item.value
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.value}
              {category === item.value ? (
                <span className="size-1.5 rounded-full bg-primary" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <label
          htmlFor="filter-city"
          className="text-sm font-semibold"
        >
          City
        </label>
        <Input
          id="filter-city"
          name="city"
          defaultValue={city}
          placeholder="e.g. Dhaka"
          className="mt-2 h-10"
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold">Hourly rate</h2>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="filter-min-price" className="sr-only">
              Minimum hourly rate
            </label>
            <Input
              id="filter-min-price"
              name="minPrice"
              type="number"
              min="0"
              step="1"
              defaultValue={minPrice}
              placeholder="Min $"
              className="h-10"
            />
          </div>
          <div>
            <label htmlFor="filter-max-price" className="sr-only">
              Maximum hourly rate
            </label>
            <Input
              id="filter-max-price"
              name="maxPrice"
              type="number"
              min="0"
              step="1"
              defaultValue={maxPrice}
              placeholder="Max $"
              className="h-10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" className="h-10 w-full">
          Apply filters
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-9 w-full"
          onClick={onClear}
        >
          Clear all
        </Button>
      </div>
    </form>
  );
}

export default function ExploreStudios() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const activeCategory = searchParams.get("category") || "all";
  const activeCity = searchParams.get("city") || "";
  const activeSearch = searchParams.get("search") || "";
  const activeMinPrice = searchParams.get("minPrice") || "";
  const activeMaxPrice = searchParams.get("maxPrice") || "";
  const requestedPage = Math.max(1, Number(searchParams.get("page") || 1));

  const [studios, setStudios] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(queryString);
    params.set("page", String(requestedPage));
    params.set("limit", String(PAGE_SIZE));

    async function loadStudios() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchStudios(Object.fromEntries(params.entries()));

        if (active) {
          setStudios(result.studios);
          setPagination(result.pagination);
        }
      } catch (requestError) {
        if (active) {
          setStudios([]);
          setPagination(null);
          setError(
            getApiErrorMessage(
              requestError,
              "We couldn't load studios right now. Please try again."
            )
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStudios();

    return () => {
      active = false;
    };
  }, [queryString, requestedPage, retryKey]);

  const pushFilters = (updates) => {
    const params = new URLSearchParams(queryString);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    params.set("page", "1");
    const nextQuery = params.toString();
    router.push(nextQuery ? `/studios?${nextQuery}` : "/studios");
  };

  const handleCategoryChange = (value) => {
    pushFilters({ category: value });
  };

  const handleApply = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const updates = {
      city: String(formData.get("city") || "").trim(),
      minPrice: String(formData.get("minPrice") || "").trim(),
      maxPrice: String(formData.get("maxPrice") || "").trim(),
      category: activeCategory,
    };

    if (
      updates.minPrice &&
      updates.maxPrice &&
      Number(updates.minPrice) > Number(updates.maxPrice)
    ) {
      pushFilters({
        city: updates.city,
        minPrice: updates.maxPrice,
        maxPrice: updates.minPrice,
        category: activeCategory,
      });
      return;
    }

    pushFilters(updates);
    setFiltersOpen(false);
  };

  const handleClear = () => {
    setFiltersOpen(false);
    router.push("/studios");
  };

  const removeFilter = (key) => {
    pushFilters({ [key]: null });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = String(formData.get("search") || "").trim();

    pushFilters({ search });
  };

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(queryString);
    params.set("page", String(nextPage));
    router.push(`/studios?${params.toString()}`);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.currentPage ?? requestedPage;
  const totalStudios = pagination?.totalStudios ?? studios.length;

  const pageNumbers = [];
  const windowStart = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const windowEnd = Math.min(totalPages, windowStart + 4);

  for (let page = windowStart; page <= windowEnd; page += 1) {
    pageNumbers.push(page);
  }

  const activeChips = [
    activeSearch ? { key: "search", label: `“${activeSearch}”` } : null,
    activeCity ? { key: "city", label: activeCity } : null,
    activeCategory !== "all" ? { key: "category", label: activeCategory } : null,
    activeMinPrice ? { key: "minPrice", label: `Min $${activeMinPrice}` } : null,
    activeMaxPrice ? { key: "maxPrice", label: `Max $${activeMaxPrice}` } : null,
  ].filter(Boolean);

  const hasFilters = activeChips.length > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" aria-hidden="true" />
            <h2 className="text-base font-semibold">Filters</h2>
          </div>

          <FilterFields
            key={`desktop-filters-${queryString}`}
            category={activeCategory}
            city={activeCity}
            minPrice={activeMinPrice}
            maxPrice={activeMaxPrice}
            onCategoryChange={handleCategoryChange}
            onApply={handleApply}
            onClear={handleClear}
          />
        </div>
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                key={activeSearch}
                name="search"
                defaultValue={activeSearch}
                placeholder="Search studios by name or keyword"
                className="h-11 pl-10"
                aria-label="Search studios"
              />
            </div>
            <Button type="submit" className="h-11 px-5">
              Search
            </Button>
          </form>

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-11 gap-2 lg:hidden"
              )}
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filters
              {activeChips.length > 0 ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground">
                  {activeChips.length}
                </span>
              ) : null}
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(22rem,90vw)] overflow-y-auto">
              <SheetHeader className="border-b">
                <SheetTitle>Filter studios</SheetTitle>
                <SheetDescription>
                  Narrow the list by category, city, and hourly rate.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <FilterFields
                  key={`mobile-filters-${queryString}`}
                  category={activeCategory}
                  city={activeCity}
                  minPrice={activeMinPrice}
                  maxPrice={activeMaxPrice}
                  onCategoryChange={handleCategoryChange}
                  onApply={handleApply}
                  onClear={handleClear}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {activeChips.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => removeFilter(chip.key)}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/30 hover:text-destructive"
              >
                {chip.label}
                <X className="size-3" aria-hidden="true" />
                <span className="sr-only">Remove filter</span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-4 border-b pb-4">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Finding studios..."
              : `${totalStudios} ${
                  totalStudios === 1 ? "studio" : "studios"
                } found`}
          </p>
          {totalPages > 1 && !loading ? (
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          ) : null}
        </div>

        <div className="mt-6">
          {loading ? (
            <StudioGridSkeleton count={PAGE_SIZE} />
          ) : error ? (
            <EmptyState
              icon={WifiOff}
              title="Couldn't load studios"
              description={error}
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRetryKey((key) => key + 1)}
                >
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Try again
                </Button>
              }
            />
          ) : studios.length === 0 ? (
            <EmptyState
              icon={Building2}
              title={
                hasFilters ? "No studios match those filters" : "No studios yet"
              }
              description={
                hasFilters
                  ? "Try a different category, city, or price range — or clear the filters to see every listing."
                  : "New spaces are added regularly. Check back soon, or be the first to list your studio."
              }
              action={
                hasFilters ? (
                  <Button type="button" variant="outline" onClick={handleClear}>
                    Clear filters
                  </Button>
                ) : (
                  <Link href="/add-studio" className={cn(buttonVariants())}>
                    List your studio
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                )
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {studios.map((studio) => (
                  <StudioCard key={studio._id} studio={studio} />
                ))}
              </div>

              {totalPages > 1 ? (
                <nav
                  className="mt-10 flex items-center justify-center gap-1.5"
                  aria-label="Pagination"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                  </Button>

                  {pageNumbers.map((page) => (
                    <Button
                      key={page}
                      type="button"
                      variant={page === currentPage ? "default" : "outline"}
                      size="icon"
                      onClick={() => goToPage(page)}
                      aria-label={`Page ${page}`}
                      aria-current={page === currentPage ? "page" : undefined}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </Button>
                </nav>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
