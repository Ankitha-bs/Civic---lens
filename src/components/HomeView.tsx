import {
  AlertOctagon,
  ArrowRight,
  Construction,
  Droplets,
  HelpCircle,
  Lightbulb,
  Trash2,
  Waves,
  Wind,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { CitizenPage, DashboardMetrics, IssueCategory } from '../types/civic';
import { CivicImage } from './CivicImage';

interface HomeViewProps {
  metrics: DashboardMetrics;
  onNavigate: (page: CitizenPage) => void;
  onReportCategory: (category: IssueCategory) => void;
}

interface CategoryCardMeta {
  category: IssueCategory;
  department: string;
  summary: string;
  icon: ReactNode;
}

const CATEGORY_CARDS: readonly CategoryCardMeta[] = [
  {
    category: 'Pothole',
    department: 'Road & Infrastructure Department',
    summary:
      'Deep carriageway cavities, rainwater-filled road depressions, and commuter lane hazards.',
    icon: <AlertOctagon className="w-5 h-5 text-teal-700" aria-hidden="true" />,
  },
  {
    category: 'Damaged Road',
    department: 'Road & Infrastructure Department',
    summary:
      'Eroded road shoulders, cracked asphalt corridors, and surface trenching damage.',
    icon: <Construction className="w-5 h-5 text-teal-700" aria-hidden="true" />,
  },
  {
    category: 'Garbage',
    department: 'Solid Waste Management Department',
    summary:
      'Overflowing roadside waste containers, uncollected market refuse, and blocked footpaths.',
    icon: <Trash2 className="w-5 h-5 text-teal-700" aria-hidden="true" />,
  },
  {
    category: 'Water Leakage',
    department: 'Water Supply Department',
    summary:
      'Burst treated-water mains, leaking feeder valves, and continuous street water wastage.',
    icon: <Droplets className="w-5 h-5 text-teal-700" aria-hidden="true" />,
  },
  {
    category: 'Drainage Blockage',
    department: 'Drainage Department',
    summary:
      'Clogged stormwater culvert grates, silted side drains, and stagnant waterlogging.',
    icon: <Waves className="w-5 h-5 text-teal-700" aria-hidden="true" />,
  },
  {
    category: 'Streetlight Issue',
    department: 'Electrical Department',
    summary:
      'Non-functional LED streetlights, flickering feeder poles, and dark pedestrian crossings.',
    icon: <Lightbulb className="w-5 h-5 text-teal-700" aria-hidden="true" />,
  },
  {
    category: 'Pollution',
    department: 'Environmental Department',
    summary:
      'Open waste burning, dense commercial smoke, and untreated runoff near storm culverts.',
    icon: <Wind className="w-5 h-5 text-teal-700" aria-hidden="true" />,
  },
  {
    category: 'Other',
    department: 'General Civic Amenities Department',
    summary:
      'Damaged pedestrian bollards, faded crosswalks, and general public park maintenance.',
    icon: <HelpCircle className="w-5 h-5 text-teal-700" aria-hidden="true" />,
  },
];

export function HomeView({ metrics, onNavigate, onReportCategory }: HomeViewProps) {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-teal-300 tracking-wide">
                <span>Shivamogga, Karnataka</span>
                <span aria-hidden="true">·</span>
                <span>Municipal Civic Grievance Platform</span>
              </div>

              <h1
                className="font-display font-bold tracking-tight text-white leading-[1.12] max-w-2xl"
                style={{ fontSize: 'clamp(2.15rem, 3.8vw, 3.4rem)', textWrap: 'balance' }}
              >
                Building Smarter, Cleaner and Safer Cities
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                CivicLens connects residents of Shivamogga directly with municipal engineering and
                sanitation teams. Upload a field photo, review automated triage priority, and track
                public resolution progress across every ward.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('report')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
                >
                  <span>Report an Issue</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-navy-800 hover:bg-navy-700 border border-navy-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
                >
                  <span>View Dashboard</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <div className="relative w-full aspect-16/9 lg:aspect-auto lg:min-h-[360px] rounded-xl overflow-hidden border border-navy-800 bg-navy-950">
                <CivicImage
                  src="/src/assets/images/hero_shivamogga_civic_1795512540829.jpg"
                  alt="Modern urban boulevard and municipal infrastructure corridor in Karnataka at golden hour"
                  className="w-full h-full object-cover"
                  fallbackLabel="Shivamogga Urban Infrastructure"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-950/85 via-navy-950/35 to-transparent"
                />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-4 text-xs text-slate-200">
                  <span className="font-medium">Shivamogga Ward Operations Network</span>
                  <span className="font-mono tabular-nums text-teal-300">
                    {metrics.total} Active &amp; Resolved Records
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Live Proof Strip */}
      <section aria-label="Live Civic Metrics Summary" className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="pt-2 lg:pt-0 lg:pr-6">
              <p className="text-xs font-medium text-slate-500">Total Logged Grievances</p>
              <p className="mt-1 text-2xl font-display font-bold text-navy-900 font-mono tabular-nums">
                {metrics.total}
              </p>
            </div>
            <div className="pt-2 lg:pt-0 lg:px-6">
              <p className="text-xs font-medium text-slate-500">Awaiting Dispatch (Reported)</p>
              <p className="mt-1 text-2xl font-display font-bold text-navy-900 font-mono tabular-nums">
                {metrics.reported}
              </p>
            </div>
            <div className="pt-2 lg:pt-0 lg:px-6">
              <p className="text-xs font-medium text-slate-500">Work Underway (In Progress)</p>
              <p className="mt-1 text-2xl font-display font-bold text-amber-700 font-mono tabular-nums">
                {metrics.inProgress}
              </p>
            </div>
            <div className="pt-2 lg:pt-0 lg:pl-6">
              <p className="text-xs font-medium text-slate-500">Verified Resolved (Fixed)</p>
              <p className="mt-1 text-2xl font-display font-bold text-teal-700 font-mono tabular-nums">
                {metrics.fixed}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Civic Issue Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
              Civic Issue Categories
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Select an infrastructure or sanitation category below to launch a pre-configured
              grievance report with simulated municipal department routing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Explore category analytics</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORY_CARDS.map((item) => {
            const count =
              metrics.byCategory.find((c) => c.category === item.category)?.count ?? 0;

            return (
              <button
                key={item.category}
                type="button"
                onClick={() => onReportCategory(item.category)}
                className="group text-left bg-white border border-slate-200 hover:border-teal-600 rounded-xl p-6 transition-colors flex flex-col justify-between gap-5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-xs font-mono tabular-nums text-slate-500">
                      {count} {count === 1 ? 'report' : 'reports'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-semibold text-navy-900 group-hover:text-teal-700 transition-colors">
                      {item.category}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.department}</p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{item.summary}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-700">
                  <span>Report {item.category}</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* How CivicLens Works (Editorial 3-Step Flow) */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mb-10 space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
              Transparent Citizen-to-Corporation Workflow
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Designed for rapid neighbourhood reporting without login barriers, paired with
              structured triage for Shivamogga municipal wings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <p className="text-xs font-mono font-semibold text-teal-700">01. Capture &amp; Submit</p>
              <h3 className="font-display text-lg font-semibold text-navy-900">
                Upload Field Evidence
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Citizens attach a street photo, pick a category and Shivamogga ward, and add brief
                context in under a minute.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <p className="text-xs font-mono font-semibold text-teal-700">
                02. Simulated AI Triage
              </p>
              <h3 className="font-display text-lg font-semibold text-navy-900">
                Severity &amp; Department Routing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Predefined triage rules classify urgency (Low, Medium, High), explain the safety
                rationale, and draft an official summary.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <p className="text-xs font-mono font-semibold text-teal-700">
                03. Public Accountability
              </p>
              <h3 className="font-display text-lg font-semibold text-navy-900">
                Open Status Tracking
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every logged grievance updates the public dashboard immediately—tracking transitions
                from Reported to In Progress and Fixed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
