import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full font-display font-medium transition-colors ${
      isActive ? 'bg-mango-500 text-teal-900' : 'text-cream hover:bg-teal-800'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-teal-900 shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-2xl">🥤</span>
          <span className="font-display text-lg font-bold text-cream leading-tight">
            Mohan Krishna
            <span className="block text-xs font-medium text-mango-400">Juice & Fried Rice</span>
          </span>
        </NavLink>

        <div className="hidden gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <a href="tel:+917386262182" className="hidden md:inline-flex btn-primary !py-2">
          📞 73862 62182
        </a>

        <button
          className="text-cream md:hidden text-2xl"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-1 bg-teal-900 px-4 pb-4 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <a href="tel:+917386262182" className="btn-primary mt-2 !py-2">
            📞 Call 73862 62182
          </a>
        </div>
      )}
    </header>
  );
}
