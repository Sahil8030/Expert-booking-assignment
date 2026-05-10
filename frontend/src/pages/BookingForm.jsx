import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios.js';
import { useToast } from '../components/Toast.jsx';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  notes: z.string().max(500, 'Notes must be at most 500 characters'),
});

function formatLongDate(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export default function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [summary, setSummary] = useState(null);

  const state = location.state;

  useEffect(() => {
    if (!state?.expertId || !state?.date || !state?.timeSlot) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  const notesVal = watch('notes') ?? '';

  const phoneReg = register('phone');

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/bookings', payload);
      return data;
    },
    onSuccess: (_, variables) => {
      setSummary({
        expertName: state.expertName,
        dateLabel: formatLongDate(variables.date),
        time: variables.timeSlot,
      });
      setShowSuccess(true);
    },
    onError: (err) => {
      if (err.isSlotConflict) {
        showToast(
          '⚡ Slot Taken — Someone just booked this slot. Redirecting...'
        );
        setTimeout(() => {
          navigate(`/experts/${state.expertId}`, { replace: true });
        }, 2000);
        return;
      }
      showToast(err.message || 'Could not complete booking');
    },
  });

  if (!state?.expertId) {
    return null;
  }

  const onSubmit = (values) => {
    mutation.mutate({
      expertId: state.expertId,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone,
      date: state.date,
      timeSlot: state.timeSlot,
      notes: values.notes?.trim() ?? '',
    });
  };

  const inputClass =
    'h-11 w-full rounded-[10px] border bg-bg-card px-3.5 text-sm text-text-primary outline-none ring-accent focus:ring-2';

  return (
    <div className="py-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <aside className="rounded-2xl border border-border bg-bg-card p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Your Session
          </p>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated text-sm font-semibold text-accent">
              {(state.expertName || 'E')
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-text-primary">
                {state.expertName}
              </p>
              <p className="text-xs text-text-secondary">{state.category}</p>
            </div>
          </div>
          <p className="text-sm text-text-primary">
            {formatLongDate(state.date)}
          </p>
          <p className="mt-1 text-sm text-text-primary">{state.timeSlot}</p>
          <div className="my-6 h-px bg-border" />
          <p className="text-xs text-text-secondary">
            Secured by ExpertBook
          </p>
        </aside>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-2xl border border-border bg-bg-card p-6"
          noValidate
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Full name
            </label>
            <input
              type="text"
              autoComplete="name"
              className={`${inputClass} ${errors.name ? 'border-danger' : 'border-border'}`}
              {...register('name')}
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              className={`${inputClass} ${errors.email ? 'border-danger' : 'border-border'}`}
              {...register('email')}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Phone
            </label>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              className={`${inputClass} ${errors.phone ? 'border-danger' : 'border-border'}`}
              name={phoneReg.name}
              ref={phoneReg.ref}
              onBlur={phoneReg.onBlur}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, '').slice(0, 10);
                e.target.value = next;
                phoneReg.onChange(e);
              }}
            />
            {errors.phone ? (
              <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Date
            </label>
            <div className="flex h-11 items-center rounded-[10px] border border-border bg-bg-elevated px-3.5 text-sm text-text-secondary">
              {formatLongDate(state.date)}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Time
            </label>
            <div className="flex h-11 items-center rounded-[10px] border border-border bg-bg-elevated px-3.5 text-sm text-text-secondary">
              {state.timeSlot}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Notes (optional)
            </label>
            <textarea
              rows={4}
              className={`min-h-[120px] w-full rounded-[10px] border px-3.5 py-3 text-sm text-text-primary outline-none ring-accent focus:ring-2 ${errors.notes ? 'border-danger' : 'border-border'} bg-bg-card`}
              {...register('notes')}
            />
            <div className="mt-1 flex justify-between text-xs text-text-secondary">
              <span>
                {errors.notes ? (
                  <span className="text-danger">{errors.notes.message}</span>
                ) : null}
              </span>
              <span>{notesVal.length}/500</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || mutation.isPending}
            className="flex h-11 w-full items-center justify-center rounded-[10px] bg-accent font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner />
                Booking...
              </span>
            ) : (
              'Confirm booking'
            )}
          </button>
        </form>
      </div>

      {showSuccess && summary ? (
        <SuccessModal
          summary={summary}
          onViewBookings={() => navigate('/my-bookings')}
        />
      ) : null}
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
      aria-hidden
    />
  );
}

function SuccessModal({ summary, onViewBookings }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-border bg-bg-card p-8 text-center shadow-xl"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#0A2A20] text-3xl text-success">
          ✓
        </div>
        <h2 className="mb-2 text-xl font-semibold text-text-primary">
          Booking Confirmed!
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-text-secondary">
          Your session with {summary.expertName} on {summary.dateLabel} at{' '}
          {summary.time} is confirmed.
        </p>
        <button
          type="button"
          onClick={onViewBookings}
          className="h-11 w-full rounded-[10px] bg-accent font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
}
