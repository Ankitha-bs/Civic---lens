import { ArrowRight, Building2, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import type { DashboardMetrics } from '../types/civic';
import { CivicImage } from './CivicImage';

interface PortalSelectionViewProps {
  metrics: DashboardMetrics;
  onEnterCitizenPortal: () => void;
  onEnterAdminPortal: () => void;
}

export function PortalSelectionView({
  metrics,
  onEnterCitizenPortal,
  onEnterAdminPortal,
}: PortalSelectionViewProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Clean Single-Row Top Bar */}
      <header className="bg-navy-900 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <span className="text-lg font-display font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            CivicLens
          </span>

          <span className="hidden sm:inline text-xs text-slate-300 whitespace-nowrap">
            Shivamogga, Karnataka · Civic Grievance &amp; Infrastructure Triage
          </span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero / Portal Selection Header */}
        <section className="bg-navy-900 text-white border-b border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
                <div className="flex items-center gap-2 text-xs font-medium text-teal-300 tracking-wide">
                  <span>Shivamogga City Corporation</span>
                  <span aria-hidden="true">·</span>
                  <span>Portal Selection</span>
                </div>

                <h1
                  className="font-display font-bold tracking-tight text-white leading-[1.12] max-w-2xl"
                  style={{ fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', textWrap: 'balance' }}
                >
                  Choose Your CivicLens Access Portal
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                  Select the Citizen Portal to report street issues with AI image triage and track
                  resolutions, or enter the Municipal Admin Portal to manage complaints across
                  Shivamogga departments.
                </p>
              </div>

              <div className="lg:col-span-5 flex">
                <div className="relative w-full aspect-16/9 lg:aspect-auto lg:min-h-[260px] rounded-xl overflow-hidden border border-navy-800 bg-navy-950">
                  <CivicImage
                    src="/src/assets/images/hero_shivamogga_civic_1795512540829.jpg"
                    alt="Modern urban boulevard and civic infrastructure in Karnataka"
                    className="w-full h-full object-cover"
                    fallbackLabel="Shivamogga Civic Operations"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/85 via-navy-950/35 to-transparent"
                  />
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between gap-4 text-xs text-slate-200">
                    <span>Unified Municipal Complaint Ledger</span>
                    <span className="font-mono tabular-nums text-teal-300">
                      {metrics.total} Active &amp; Fixed Records
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two Separate Portal Entry Cards */}
        <section
          aria-label="Available CivicLens Portals"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Citizen Portal Entry */}
            <article className="bg-white border border-slate-200 rounded-xl p-7 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-11 h-11 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-teal-700" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-teal-700">
                    No Login Required
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-bold text-navy-900">
                    Citizen Portal
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    For residents and neighbourhood associations in Shivamogga who want to report
                    civic problems and follow repair progress.
                  </p>
                </div>

                <ul className="space-y-2.5 text-sm text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-teal-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>Upload or capture field photos of civic infrastructure issues</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-teal-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Preview simulated AI image analysis for issue type, severity, and routing
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-teal-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Track submitted complaints from Reported to In Progress and Fixed
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Includes Home, Report Issue, Tracker &amp; Public Dashboard
                </span>
                <button
                  type="button"
                  data-testid="enter-citizen-portal-btn"
                  onClick={onEnterCitizenPortal}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Enter Citizen Portal</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>

            {/* Municipal Admin Portal Entry */}
            <article className="bg-white border border-slate-200 rounded-xl p-7 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-navy-900" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-medium text-navy-900">
                    Officer Sign-In (Demo)
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-bold text-navy-900">
                    Municipal Admin Portal
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    For Shivamogga municipal authorities and department engineers managing incoming
                    grievances and work-order status.
                  </p>
                </div>

                <ul className="space-y-2.5 text-sm text-slate-700 pt-2 border-t border-slate-100">
                  <li className="flex items-start gap-2.5">
                    <Building2
                      className="w-4 h-4 text-navy-900 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Inspect uploaded photos, AI-generated summaries, and recommended departments
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Building2
                      className="w-4 h-4 text-navy-900 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Assign municipal wings and update workflow status (Reported, In Progress,
                      Fixed)
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Building2
                      className="w-4 h-4 text-navy-900 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>
                      Monitor city-wide statistics and department-wise resolution reports
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Mock municipal credentials provided on login screen
                </span>
                <button
                  type="button"
                  data-testid="enter-admin-portal-btn"
                  onClick={onEnterAdminPortal}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Enter Admin Portal</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* Live Metrics Strip */}
        <section aria-label="Shared Municipal Metrics" className="bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              <div className="pt-2 lg:pt-0 lg:pr-6">
                <p className="text-xs font-medium text-slate-500">Total Logged Grievances</p>
                <p className="mt-1 text-2xl font-display font-bold text-navy-900 font-mono tabular-nums">
                  {metrics.total}
                </p>
              </div>
              <div className="pt-2 lg:pt-0 lg:px-6">
                <p className="text-xs font-medium text-slate-500">Reported</p>
                <p className="mt-1 text-2xl font-display font-bold text-navy-900 font-mono tabular-nums">
                  {metrics.reported}
                </p>
              </div>
              <div className="pt-2 lg:pt-0 lg:px-6">
                <p className="text-xs font-medium text-slate-500">In Progress</p>
                <p className="mt-1 text-2xl font-display font-bold text-amber-700 font-mono tabular-nums">
                  {metrics.inProgress}
                </p>
              </div>
              <div className="pt-2 lg:pt-0 lg:pl-6">
                <p className="text-xs font-medium text-slate-500">Fixed</p>
                <p className="mt-1 text-2xl font-display font-bold text-teal-700 font-mono tabular-nums">
                  {metrics.fixed}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-navy-950 text-slate-400 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <span>
            CivicLens · AI Civic Grievance &amp; Infrastructure Triage System (Shivamogga,
            Karnataka)
          </span>
          <span>Simulated triage &amp; mock authentication for demonstration</span>
        </div>
      </footer>
    </div>
  );
}
