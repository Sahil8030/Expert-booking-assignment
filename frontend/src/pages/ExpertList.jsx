import { useEffect, useMemo, useState } from 'react';
import ExpertCard from '../components/ExpertCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { useExperts } from '../hooks/useExperts.js';

const CATEGORIES = [
  'Technology',
  'Business',
  'Design',
  'Marketing',
  'Finance',
  'Legal',
  'Health',
  'Education',
];

export default function ExpertList() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const query = useExperts({
    page,
    limit: 9,
    search: debouncedSearch || undefined,
    category: category || undefined,
  });

  const { data, isLoading, isError, refetch, isFetching } = query;

  const experts = data?.experts ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const rangeLabel = useMemo(() => {
    if (!total) return '0 results';
    const start = (page - 1) * 9 + 1;
    const end = Math.min(page * 9, total);
    return `${start}–${end} of ${total}`;
  }, [page, total]);

  const showEmpty = !isLoading && !isError && experts.length === 0;

  return (
    <div className="py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-[32px] font-semibold leading-tight text-text-primary">
          Find Your Expert
        </h1>
        <p className="text-text-secondary">
          Book 1-on-1 sessions with top professionals
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-11 w-full min-w-0 rounded-[10px] border border-border bg-bg-card px-3.5 text-sm text-text-primary outline-none ring-accent focus:ring-2 sm:max-w-xs"
          />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="h-11 w-full rounded-[10px] border border-border bg-bg-card px-3.5 text-sm text-text-primary outline-none ring-accent focus:ring-2 sm:w-56"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <p className="whitespace-nowrap text-sm text-text-secondary">{rangeLabel}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-text-primary">Failed to load experts</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="h-11 rounded-[10px] bg-accent px-6 font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Retry
          </button>
        </div>
      ) : null}

      {showEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <p className="text-text-secondary">
            No experts found matching your search
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              setDebouncedSearch('');
              setCategory('');
              setPage(1);
            }}
            className="h-11 rounded-[10px] border border-border px-6 font-semibold text-text-primary transition-colors hover:bg-bg-elevated"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && experts.length > 0 ? (
        <div
          className={`grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 ${isFetching ? 'opacity-70' : ''}`}
        >
          {experts.map((expert) => (
            <ExpertCard key={expert._id} expert={expert} />
          ))}
        </div>
      ) : null}

      {!isLoading && !isError && experts.length > 0 ? (
        <Pagination
          page={page}
          pages={pages}
          onPageChange={setPage}
          disabled={isFetching}
        />
      ) : null}
    </div>
  );
}

function Pagination({ page, pages, onPageChange, disabled }) {
  const nums = useMemo(() => {
    const list = [];
    for (let i = 1; i <= pages; i += 1) list.push(i);
    return list;
  }, [pages]);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-text-primary hover:bg-bg-elevated disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        ‹
      </button>
      {nums.map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onPageChange(n)}
          className={[
            'flex h-10 min-w-[2.5rem] items-center justify-center rounded-[10px] px-3 text-sm font-semibold',
            n === page
              ? 'bg-accent text-white'
              : 'border border-border text-text-primary hover:bg-bg-elevated',
          ].join(' ')}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled || page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-border text-text-primary hover:bg-bg-elevated disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
}
