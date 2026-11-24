import { useState } from 'react';
import { ArrowLeft, Menu, ShieldCheck, X } from 'lucide-react';
import type { CitizenPage } from '../types/civic';

interface NavbarProps {
  currentPage: CitizenPage;
  onNavigate: (page: CitizenPage) => void;
  onBackToSelection: () => void;
  onSwitchToAdmin: () => void;
}

const CITIZEN_NAV_ITEMS: readonly { id: CitizenPage; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'report', label: 'Report Issue' },
  { id: 'track', label: 'Track Complaints' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'about', label: 'About' },
];

export function Navbar({
  currentPage,
  onNavigate,
  onBackToSelection,
  onSwitchToAdmin,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelect = (page: CitizenPage) => {
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-navy-900 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => handleSelect('home')}
            className="text-lg font-display font-bold tracking-tight text-white hover:text-teal-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-400"
          >
            CivicLens
          </button>

          {/* Zone 2: 5 concise single-line Citizen navigation links */}
          <nav aria-label="Citizen Navigation" className="hidden md:flex items-center gap-7">
            {CITIZEN_NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-400 ${
                    isActive ? 'text-teal-300' : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-1 h-0.5 bg-teal-400 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + mobile menu toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleSelect('report')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
            >
              Report an Issue
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-200 hover:text-white hover:bg-navy-800 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-teal-400"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Citizen Navigation"
            className="md:hidden border-t border-navy-800 bg-navy-950 px-4 py-3 space-y-1"
          >
            {CITIZEN_NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-navy-800 text-teal-300'
                      : 'text-slate-200 hover:bg-navy-900 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-2 mt-2 border-t border-navy-800 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSwitchToAdmin();
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-teal-300 hover:bg-navy-900 cursor-pointer"
              >
                Switch to Admin Portal
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBackToSelection();
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-navy-900 cursor-pointer"
              >
                Back to Portal Selection
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Non-Sticky Citizen Portal Context Strip */}
      <div className="bg-navy-950 text-slate-300 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-teal-300">Citizen Portal</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Shivamogga Resident Intake &amp; Tracking</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onBackToSelection}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Portal Selection</span>
            </button>
            <span aria-hidden="true" className="text-navy-700">
              |
            </span>
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="inline-flex items-center gap-1.5 font-medium text-teal-300 hover:text-teal-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Switch to Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
