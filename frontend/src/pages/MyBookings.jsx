import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.js';
import BookingCard from '../components/BookingCard.jsx';

function BookingSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-bg-card p-5">
      <div className="mb-4 flex justify-between gap-3">
        <div className="flex gap-3">
          <div className="h-11 w-11 rounded-full bg-bg-elevated" />
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-bg-elevated" />
            <div className="h-3 w-24 rounded bg-bg-elevated" />
          </div>
        </div>
        <div className="h-6 w-20 rounded-full bg-bg-elevated" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded bg-bg-elevated" />
        <div className="h-4 w-1/2 rounded bg-bg-elevated" />
      </div>
    </div>
  );
}

function InboxIllustration() {
  return (
    <div
      className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-2xl border border-border bg-bg-elevated"
      aria-hidden
    >
      <svg
        className="h-14 w-14 text-accent"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 6h16v12H4z" />
        <path d="M4 8l8 6 8-6" />
      </svg>
    </div>
  );
}

export default function MyBookings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const emailFromUrl = (searchParams.get('email') || '').trim();
  const [emailInput, setEmailInput] = useState(emailFromUrl);

  useEffect(() => {
    setEmailInput(emailFromUrl);
  }, [emailFromUrl]);

  const query = useQuery({
    queryKey: ['bookings', emailFromUrl],
    queryFn: async () => {
      const { data } = await api.get('/bookings', {
        params: { email: emailFromUrl },
      });
      return data.bookings;
    },
    enabled: Boolean(emailFromUrl),
  });

  const { data: bookings, isLoading, isError, refetch, isFetching } = query;

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = emailInput.trim().toLowerCase();
    if (!next) return;
    setSearchParams({ email: next });
  };

  const hasEmailLookup = Boolean(emailFromUrl);
  const showEmptyResults =
    hasEmailLookup &&
    !isLoading &&
    !isError &&
    Array.isArray(bookings) &&
    bookings.length === 0;

  return (
    <div className="py-8">
      <h1 className="mb-8 text-[32px] font-semibold text-text-primary">
        My Bookings
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          className="h-11 min-w-0 flex-1 rounded-[10px] border border-border bg-bg-card px-3.5 text-sm text-text-primary outline-none ring-accent focus:ring-2"
        />
        <button
          type="submit"
          className="h-11 shrink-0 rounded-[10px] bg-accent px-6 font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Find Bookings
        </button>
      </form>

      {!hasEmailLookup ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <InboxIllustration />
          <p className="max-w-md text-sm text-text-secondary">
            Enter your email to view bookings
          </p>
        </div>
      ) : null}

      {hasEmailLookup && isLoading ? (
        <div className="flex flex-col gap-3">
          <BookingSkeleton />
          <BookingSkeleton />
          <BookingSkeleton />
        </div>
      ) : null}

      {hasEmailLookup && isError ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-text-primary">Failed to fetch bookings</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="h-11 rounded-[10px] bg-accent px-6 font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Retry
          </button>
        </div>
      ) : null}

      {hasEmailLookup && !isLoading && !isError && showEmptyResults ? (
        <p className="py-12 text-center text-text-secondary">
          No bookings found for this email
        </p>
      ) : null}

      {hasEmailLookup &&
      !isLoading &&
      !isError &&
      bookings &&
      bookings.length > 0 ? (
        <div
          className={`flex flex-col gap-3 ${isFetching ? 'opacity-70' : ''}`}
        >
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
