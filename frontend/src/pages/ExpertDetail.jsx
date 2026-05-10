import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import SlotPicker from '../components/SlotPicker.jsx';
import { useExpert } from '../hooks/useExperts.js';
import { useSocket } from '../hooks/useSocket.js';

function getNextSevenDateStrings() {
  const out = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const nextSeven = useMemo(() => new Set(getNextSevenDateStrings()), []);

  const { data: expert, isLoading, isError, refetch } = useExpert(id);

  const tabDates = useMemo(() => {
    if (!expert?.availableSlots?.length) return [];
    const uniq = [
      ...new Set(
        expert.availableSlots
          .map((s) => s.date)
          .filter((d) => nextSeven.has(d))
      ),
    ];
    uniq.sort();
    return uniq;
  }, [expert, nextSeven]);

  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (tabDates.length === 0) {
      setSelectedDate(null);
      return;
    }
    if (!selectedDate || !tabDates.includes(selectedDate)) {
      setSelectedDate(tabDates[0]);
    }
  }, [tabDates, selectedDate]);

  const slotsForDay = useMemo(() => {
    if (!expert?.availableSlots || !selectedDate) return [];
    return expert.availableSlots.filter((s) => s.date === selectedDate);
  }, [expert, selectedDate]);

  const onSlotBooked = useCallback(
    (payload) => {
      if (payload.expertId !== id) return;
      queryClient.setQueryData(['expert', id], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          availableSlots: prev.availableSlots.map((s) =>
            s.date === payload.date && s.time === payload.timeSlot
              ? { ...s, isBooked: true }
              : s
          ),
        };
      });
    },
    [id, queryClient]
  );

  useSocket(onSlotBooked);

  const handleBookSlot = (slot) => {
    if (!expert) return;
    navigate('/book', {
      state: {
        expertId: expert._id,
        expertName: expert.name,
        category: expert.category,
        date: slot.date,
        timeSlot: slot.time,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-5 w-40 rounded bg-bg-elevated" />
          <div className="flex gap-4">
            <div className="h-20 w-20 rounded-full bg-bg-elevated" />
            <div className="flex-1 space-y-3">
              <div className="h-8 w-2/3 max-w-md rounded bg-bg-elevated" />
              <div className="h-4 w-1/3 rounded bg-bg-elevated" />
              <div className="h-4 w-1/2 rounded bg-bg-elevated" />
            </div>
          </div>
          <div className="h-24 w-full rounded-xl bg-bg-elevated" />
        </div>
      </div>
    );
  }

  if (isError || !expert) {
    return (
      <div className="py-8">
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-text-primary">Failed to load expert</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="h-11 rounded-[10px] bg-accent px-6 font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Retry
          </button>
          <Link
            to="/"
            className="text-sm font-medium text-accent hover:underline"
          >
            ← Back to Experts
          </Link>
        </div>
      </div>
    );
  }

  const reviews =
    typeof expert.reviewCount === 'number' ? expert.reviewCount : 0;

  const noTabs = tabDates.length === 0;

  return (
    <div className="py-8">
      <Link
        to="/"
        className="mb-8 inline-flex items-center text-sm font-medium text-accent hover:underline"
      >
        ← Back to Experts
      </Link>

      <section className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-2xl font-semibold text-accent"
          aria-hidden
        >
          {expert.avatar || '?'}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[28px] font-semibold leading-tight text-text-primary">
              {expert.name}
            </h1>
            <span className="inline-flex rounded-full bg-bg-elevated px-2.5 py-0.5 text-[11px] font-medium text-accent">
              {expert.category}
            </span>
          </div>
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-warning" aria-hidden>
              ★
            </span>
            <span className="font-medium text-warning">{expert.rating}</span>
            <span className="text-text-secondary">({reviews} reviews)</span>
            <span className="text-text-secondary">·</span>
            <span className="text-text-secondary">
              {expert.experience} years experience
            </span>
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
            {expert.bio}
          </p>
        </div>
      </section>

      <div className="my-8 h-px w-full bg-border" />

      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-text-primary">
          Available Sessions
        </h2>

        {noTabs ? (
          <p className="text-sm text-text-secondary">
            No sessions available in the next 7 days.
          </p>
        ) : (
          <SlotPicker
            tabDates={tabDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            slots={slotsForDay}
            onBookSlot={handleBookSlot}
          />
        )}
      </section>
    </div>
  );
}
