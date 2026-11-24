import { ArrowRight, Building2, CheckCircle2, Info, Users } from 'lucide-react';
import type { CitizenPage } from '../types/civic';
import { CivicImage } from './CivicImage';

interface AboutViewProps {
  onNavigate: (page: CitizenPage) => void;
}

export function AboutView({ onNavigate }: AboutViewProps) {
  return (
    <div className="bg-slate-50">
      {/* Header Band */}
      <section className="bg-navy-900 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-medium text-teal-300">
              About CivicLens · Shivamogga, Karnataka
            </p>
            <h1
              className="font-display font-bold text-white tracking-tight"
              style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)', textWrap: 'balance' }}
            >
              Structured Civic Triage for Responsive City Governance
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              CivicLens is a citizen-first grievance intake and municipal prioritization interface
              designed for Shivamogga’s urban wards—bridging street-level issue reporting with
              transparent, department-level resolution tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 space-y-5 flex flex-col justify-center">
            <h2 className="font-display text-2xl font-bold text-navy-900 tracking-tight">
              Why CivicLens Exists
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Municipal helplines often receive fragmented descriptions without standardized
              severity grading or clear departmental ownership. Routine requests compete with
              urgent public hazards like burst drinking-water mains or deep monsoon potholes.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              CivicLens structures every citizen submission at the point of intake—pairing visual
              evidence with consistent severity reasoning, municipal wing assignment, and an open
              dashboard visible to both residents and city engineers across Shivamogga.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-navy-900">
              <CivicImage
                src="/src/assets/images/civic_triage_inspection_1795512541724.jpg"
                alt="Municipal engineer inspecting road surface and storm drain infrastructure in Karnataka"
                className="w-full h-full object-cover"
                fallbackLabel="Municipal Field Inspection"
              />
            </div>
          </div>
        </div>

        {/* Citizen vs Municipal Authority Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-xl p-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-700" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-navy-900">How It Helps Citizens</h3>
                <p className="text-xs text-slate-500">Residents &amp; neighbourhood associations</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Frictionless reporting without account registration—attach a photo, pick a ward,
                  and submit in seconds.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Instant clarity on which Shivamogga municipal department handles the complaint and
                  why it received its priority level.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Public dashboard visibility showing whether grievances are Reported, In Progress,
                  or Fixed.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-7 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-navy-900" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-navy-900">
                  How It Helps Municipal Authorities
                </h3>
                <p className="text-xs text-slate-500">
                  Engineering, sanitation &amp; water supply wings
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Standardized work-order descriptions reduce time spent interpreting incomplete
                  phone complaints.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  High-severity flags surface safety hazards such as deep potholes or burst water
                  mains ahead of routine maintenance.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Category breakdown and ward metrics help allocate field crews and equipment across
                  Shivamogga’s zones.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Simulated AI Disclosure Banner */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-10 h-10 rounded-lg bg-navy-900 text-teal-300 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-display text-base font-bold text-navy-900">
                Simulated AI Triage Transparency Notice
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                This application runs entirely in your browser using deterministic sample data and
                predefined triage rules. When you submit an issue, the generated severity level,
                reasoning, and department routing represent a simulated AI analysis—no external AI
                APIs, paid services, or cloud databases are invoked.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('report')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Try Issue Reporting</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
