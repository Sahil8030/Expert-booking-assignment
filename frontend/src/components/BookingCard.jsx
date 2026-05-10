import StatusBadge from './StatusBadge.jsx';

const stripColors = {
  pending: 'bg-warning',
  confirmed: 'bg-success',
  completed: 'bg-accent',
};

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-text-secondary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-text-secondary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-text-secondary"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M7 17h3l1-7H6v5h1v2zm8 0h3l1-7h-5v5h1v2z" />
    </svg>
  );
}

export default function BookingCard({ booking }) {
  const expert = booking.expertId;
  const name = expert?.name ?? 'Expert';
  const category = expert?.category ?? '';
  const avatar = expert?.avatar ?? '?';
  const notes = booking.notes?.trim();

  const dateLabel = formatLongDate(booking.date);

  const strip = stripColors[booking.status] || 'bg-text-secondary';

  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-bg-card">
      <span
        className={`absolute bottom-0 left-0 top-0 w-[3px] ${strip}`}
        aria-hidden
      />
      <div className="p-5 pl-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-sm font-semibold text-accent">
              {avatar}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-text-primary">{name}</p>
              <p className="truncate text-xs text-text-secondary">{category}</p>
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-text-primary">
            <CalendarIcon />
            <span>{dateLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-text-primary">
            <ClockIcon />
            <span>{booking.timeSlot}</span>
          </div>
          {notes ? (
            <div className="flex gap-2 text-text-secondary">
              <QuoteIcon />
              <p className="line-clamp-2 flex-1 text-sm leading-relaxed">
                {notes}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function formatLongDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
