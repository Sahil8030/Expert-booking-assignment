const styles = {
  pending: 'bg-[#2A2010] text-warning',
  confirmed: 'bg-[#0A2A20] text-success',
  completed: 'bg-[#1A1A3A] text-accent',
};

export default function StatusBadge({ status }) {
  const label =
    status === 'pending'
      ? 'Pending'
      : status === 'confirmed'
        ? 'Confirmed'
        : 'Completed';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${styles[status] || 'bg-bg-elevated text-text-secondary'}`}
    >
      {label}
    </span>
  );
}
