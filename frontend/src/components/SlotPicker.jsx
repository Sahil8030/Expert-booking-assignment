export default function SlotPicker({
  tabDates,
  selectedDate,
  onSelectDate,
  slots,
  onBookSlot,
}) {
  return (
    <div className="space-y-6">
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
        {tabDates.map((dateStr) => {
          const active = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-white'
                  : 'bg-bg-elevated text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {formatTabDate(dateStr)}
            </button>
          );
        })}
      </div>

      {slots.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No time slots for this date.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {slots.map((slot) => (
            <button
              key={`${slot.date}-${slot.time}`}
              type="button"
              disabled={slot.isBooked}
              onClick={() => !slot.isBooked && onBookSlot(slot)}
              className={[
                'flex min-h-[72px] flex-col items-center justify-center rounded-[10px] border px-3 py-3 text-center text-sm font-medium transition-colors',
                slot.isBooked
                  ? 'cursor-not-allowed border-dashed border-border bg-bg-primary text-[#444455]'
                  : 'border border-border bg-bg-card text-text-primary hover:border-accent active:border-2 active:border-accent',
              ].join(' ')}
            >
              <span>{slot.time}</span>
              {slot.isBooked && (
                <span className="mt-1 text-[10px] font-medium text-[#444455]">
                  Booked
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTabDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d);
}
