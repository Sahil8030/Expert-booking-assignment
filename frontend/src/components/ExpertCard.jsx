import { Link } from 'react-router-dom';

export default function ExpertCard({ expert }) {
  const reviews =
    typeof expert.reviewCount === 'number' ? expert.reviewCount : 0;

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-bg-card p-5 transition-colors duration-200 hover:border-accent">
      <div className="mb-4 flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-base font-semibold text-accent"
          aria-hidden
        >
          {expert.avatar || '?'}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-text-primary">
            {expert.name}
          </h3>
          <span className="mt-1 inline-flex rounded-full bg-bg-elevated px-2.5 py-0.5 text-[11px] font-medium text-accent">
            {expert.category}
          </span>
        </div>
      </div>
      <p className="mb-3 text-[13px] text-text-secondary">
        {expert.experience} years exp
      </p>
      <p className="mb-5 flex items-center gap-1 text-sm">
        <span className="text-warning" aria-hidden>
          ★
        </span>
        <span className="font-medium text-warning">{expert.rating}</span>
        <span className="text-text-secondary">({reviews} reviews)</span>
      </p>
      <Link
        to={`/experts/${expert._id}`}
        className="mt-auto flex h-11 w-full items-center justify-center rounded-[10px] border border-border bg-transparent font-semibold text-text-primary transition-colors hover:bg-bg-elevated"
      >
        View Profile
      </Link>
    </article>
  );
}
