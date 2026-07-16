import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/discs', label: 'Discs' },
  { to: '/bags', label: 'Bags' },
  { to: '/practice', label: 'Practice' },
  { to: '/', label: 'Progress', end: true },
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-white/10 bg-brand-bg/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md justify-around">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  isActive ? 'text-brand-green' : 'text-white/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
