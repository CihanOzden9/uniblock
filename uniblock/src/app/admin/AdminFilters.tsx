"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

interface SelectField {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface AdminFiltersProps {
  searchKey?: string;
  searchPlaceholder?: string;
  selects?: SelectField[];
}

export default function AdminFilters({
  searchKey = "q",
  searchPlaceholder = "Ara...",
  selects = [],
}: AdminFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get(searchKey) || "");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRun = useRef(true);

  // URL'i her zaman taze konumdan güncelle
  const setParam = (key: string, value: string) => {
    const sp = new URLSearchParams(typeof window !== "undefined" ? window.location.search : params.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Aramayı debounce ile URL'e yaz (ilk render'da çalışmaz)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => setParam(searchKey, query.trim()), 300);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const hasAny = !!query || selects.some((s) => !!params.get(s.key));

  const clearAll = () => {
    setQuery("");
    router.replace(pathname, { scroll: false });
  };

  const fieldBase =
    "h-11 rounded-xl bg-surface-container-low border border-transparent text-[14px] text-on-surface outline-none transition-colors focus:bg-card focus:border-ring focus:ring-2 focus:ring-ring/40";

  return (
    <div className="flex flex-wrap items-center gap-2.5 mb-6">
      {/* Arama */}
      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-on-surface-variant pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className={`${fieldBase} w-full pl-10 pr-9 placeholder:text-on-surface-variant`}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Aramayı temizle"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Açılır filtreler */}
      {selects.map((s) => (
        <select
          key={s.key}
          value={params.get(s.key) || ""}
          onChange={(e) => setParam(s.key, e.target.value)}
          className={`${fieldBase} px-3.5 font-medium cursor-pointer shrink-0`}
        >
          <option value="">{s.label}</option>
          {s.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ))}

      {/* Filtreleri temizle — her zaman en sağda */}
      {hasAny && (
        <button
          type="button"
          onClick={clearAll}
          className="ml-auto flex items-center gap-1.5 h-11 px-4 rounded-xl text-[13px] font-semibold text-primary hover:bg-primary-fixed transition-colors shrink-0"
        >
          <X className="w-4 h-4" /> Filtreleri Temizle
        </button>
      )}
    </div>
  );
}
