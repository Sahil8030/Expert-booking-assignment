import { Link, NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  [
    'text-sm font-medium transition-colors',
    isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary',
  ].join(' ');

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-bg-primary">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
        <Link to="/" className="font-semibold text-accent">
          ExpertBook
        </Link>
        <nav className="flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>
            Experts
          </NavLink>
          <NavLink to="/my-bookings" className={linkClass}>
            My Bookings
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
