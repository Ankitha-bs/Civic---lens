import type { CitizenPage } from '../types/civic';

interface FooterProps {
  onNavigate: (page: CitizenPage) => void;
  onBackToSelection: () => void;
  onSwitchToAdmin: () => void;
}

export function Footer({ onNavigate, onBackToSelection, onSwitchToAdmin }: FooterProps) {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="font-display font-bold text-white text-base">CivicLens</div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            AI Civic Grievance &amp; Infrastructure Triage Prototype for Shivamogga, Karnataka.
            Triage outputs shown on this site are generated using predefined simulated rules for
            demonstration purposes.
          </p>
        </div>

        <nav aria-label="Citizen Footer Navigation" className="flex flex-wrap items-center gap-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-slate-300 hover:text-teal-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate('report')}
            className="text-slate-300 hover:text-teal-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            Report Issue
          </button>
          <button
            type="button"
            onClick={() => onNavigate('track')}
            className="text-slate-300 hover:text-teal-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            Track Complaints
          </button>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-slate-300 hover:text-teal-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            Public Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="text-slate-300 hover:text-teal-300 transition-colors cursor-pointer whitespace-nowrap"
          >
            About
          </button>
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="text-teal-300 hover:text-teal-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            Admin Portal
          </button>
          <button
            type="button"
            onClick={onBackToSelection}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Portal Selection
          </button>
        </nav>
      </div>
    </footer>
  );
}
