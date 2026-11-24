import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Building2,
  ClipboardList,
  Eye,
  LogOut,
  RotateCcw,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import {
  ISSUE_CATEGORIES,
  MUNICIPAL_DEPARTMENTS,
  type ActivityEvent,
  type AdminSection,
  type AdminUser,
  type CivicComplaint,
  type ComplaintStatus,
  type DashboardFilters,
  type DashboardMetrics,
  type IssueCategory,
  type SeverityLevel,
} from '../types/civic';
import {
  computeDepartmentReports,
  computeDepartmentWorkload,
  filterComplaints,
} from '../utils/triageEngine';
import { CivicImage } from './CivicImage';
import { SeverityIndicator, StatusIndicator } from './StatusIndicator';

interface AdminPortalViewProps {
  adminUser: AdminUser;
  complaints: readonly CivicComplaint[];
  metrics: DashboardMetrics;
  activityLog: readonly ActivityEvent[];
  onAssignDepartment: (id: string, department: string) => void;
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
  onSwitchToCitizen: () => void;
  onBackToSelection: () => void;
  onSignOut: () => void;
}

const STATUS_TABS: readonly (ComplaintStatus | 'All')[] = [
  'All',
  'Reported',
  'In Progress',
  'Fixed',
];

const ADMIN_SECTIONS: readonly {
  id: AdminSection;
  label: string;
  title: string;
}[] = [
  { id: 'complaints', label: 'All Complaints', title: 'Complaint Triage & Dispatch Queue' },
  { id: 'departments', label: 'Department Reports', title: 'Department-Wise Reports' },
  { id: 'analytics', label: 'Statistics & Analytics', title: 'Municipal Statistics & Activity' },
];

export function AdminPortalView({
  adminUser,
  complaints,
  metrics,
  activityLog,
  onAssignDepartment,
  onUpdateStatus,
  onSwitchToCitizen,
  onBackToSelection,
  onSignOut,
}: AdminPortalViewProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('complaints');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [filters, setFilters] = useState<DashboardFilters>({
    status: 'All',
    severity: 'All',
    category: 'All',
    searchQuery: '',
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredComplaints = useMemo(() => {
    const base = filterComplaints(complaints, filters);
    if (departmentFilter === 'All') {
      return base;
    }
    return base.filter((c) => c.assignedDepartment === departmentFilter);
  }, [complaints, filters, departmentFilter]);

  const departmentWorkload = useMemo(
    () => computeDepartmentWorkload(complaints),
    [complaints],
  );

  const departmentReports = useMemo(
    () => computeDepartmentReports(complaints),
    [complaints],
  );

  const selectedComplaint = useMemo(
    () => complaints.find((c) => c.id === selectedId) ?? null,
    [complaints, selectedId],
  );

  const maxCategoryCount = useMemo(
    () => Math.max(1, ...metrics.byCategory.map((c) => c.count)),
    [metrics.byCategory],
  );

  const hasActiveFilters =
    filters.status !== 'All' ||
    filters.severity !== 'All' ||
    filters.category !== 'All' ||
    departmentFilter !== 'All' ||
    filters.searchQuery.trim().length > 0;

  const resetFilters = () => {
    setDepartmentFilter('All');
    setFilters({
      status: 'All',
      severity: 'All',
      category: 'All',
      searchQuery: '',
    });
  };

  const handleInspectDepartmentQueue = (department: string) => {
    setDepartmentFilter(department);
    setActiveSection('complaints');
  };

  const activeSectionMeta =
    ADMIN_SECTIONS.find((s) => s.id === activeSection) ?? ADMIN_SECTIONS[0];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Dedicated Left Sidebar (Desktop) */}
      <aside
        aria-label="Municipal Admin Sidebar Navigation"
        className="w-64 shrink-0 bg-navy-900 text-white hidden lg:flex flex-col justify-between border-r border-navy-800"
      >
        <div className="p-6 space-y-8">
          <div className="space-y-1">
            <span className="text-lg font-display font-bold tracking-tight text-white">
              CivicLens
            </span>
            <p className="text-xs text-teal-300 font-medium">Municipal Admin Portal</p>
          </div>

          <nav aria-label="Admin Console Sections" className="space-y-1.5">
            {ADMIN_SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  {sec.id === 'complaints' && (
                    <ClipboardList className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  {sec.id === 'departments' && (
                    <Building2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  {sec.id === 'analytics' && (
                    <BarChart3 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span className="truncate">{sec.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-5 border-t border-navy-800 space-y-4 bg-navy-950">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-white truncate">{adminUser.name}</p>
            <p className="text-xs text-slate-400 truncate">{adminUser.designation}</p>
            <p className="text-xs font-mono text-teal-300">{adminUser.officerId}</p>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-navy-800">
            <button
              type="button"
              onClick={onSwitchToCitizen}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-teal-300 hover:bg-navy-900 rounded-lg transition-colors cursor-pointer text-left"
            >
              <Users className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Switch to Citizen Portal</span>
            </button>

            <button
              type="button"
              onClick={onBackToSelection}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-navy-900 hover:text-white rounded-lg transition-colors cursor-pointer text-left"
            >
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Back to Portal Selection</span>
            </button>

            <button
              type="button"
              onClick={onSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-navy-900 hover:text-white rounded-lg transition-colors cursor-pointer text-left"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Console Bar (Mobile + Desktop Breadcrumb & Quick Switch) */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <ShieldCheck className="w-5 h-5 text-navy-900 shrink-0 lg:hidden" aria-hidden="true" />
              <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
                <span className="font-display font-bold text-navy-900 lg:hidden whitespace-nowrap">
                  CivicLens Admin
                </span>
                <span className="hidden lg:inline text-slate-500 whitespace-nowrap">
                  Municipal Admin Portal
                </span>
                <span aria-hidden="true" className="hidden lg:inline text-slate-300">
                  /
                </span>
                <span className="hidden lg:inline font-semibold text-navy-900 truncate">
                  {activeSectionMeta.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={onSwitchToCitizen}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Users className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                <span className="hidden sm:inline">Switch to Citizen Portal</span>
                <span className="sm:hidden">Citizen Portal</span>
              </button>

              <button
                type="button"
                onClick={onBackToSelection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Back to Portal Selection</span>
                <span className="sm:hidden">Portals</span>
              </button>

              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign out of Municipal Admin Portal"
                className="lg:hidden inline-flex items-center justify-center w-9 h-9 text-slate-600 hover:text-navy-900 border border-slate-300 rounded-lg cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mobile Section Tabs (< lg) */}
          <nav
            aria-label="Mobile Admin Console Sections"
            className="lg:hidden px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto"
          >
            {ADMIN_SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-navy-900 text-white'
                      : 'text-slate-600 hover:text-navy-900 bg-white border border-slate-200'
                  }`}
                >
                  {sec.label}
                </button>
              );
            })}
          </nav>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Page Intro Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-teal-700">
                {adminUser.corporation} · Logged in as {adminUser.name}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
                {activeSectionMeta.title}
              </h1>
            </div>
          </div>

          {/* Complaint Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Total Complaints</p>
              <p
                data-testid="admin-kpi-total"
                className="mt-2 text-3xl font-display font-bold text-navy-900 font-mono tabular-nums"
              >
                {metrics.total}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Pending Triage (Reported)</p>
              <p
                data-testid="admin-kpi-reported"
                className="mt-2 text-3xl font-display font-bold text-navy-900 font-mono tabular-nums"
              >
                {metrics.reported}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Active Work (In Progress)</p>
              <p
                data-testid="admin-kpi-in-progress"
                className="mt-2 text-3xl font-display font-bold text-amber-700 font-mono tabular-nums"
              >
                {metrics.inProgress}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Resolved (Fixed)</p>
              <p
                data-testid="admin-kpi-fixed"
                className="mt-2 text-3xl font-display font-bold text-teal-700 font-mono tabular-nums"
              >
                {metrics.fixed}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">High-Severity Priority</p>
              <p
                data-testid="admin-kpi-high"
                className="mt-2 text-3xl font-display font-bold text-red-700 font-mono tabular-nums"
              >
                {metrics.highSeverity}
              </p>
            </div>
          </div>

          {activeSection === 'complaints' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Left 8 Cols: Filterable Complaints Management */}
              <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-200 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-display text-lg font-bold text-navy-900">
                      All Citizen Complaints{' '}
                      <span className="text-sm font-mono font-normal text-slate-500 tabular-nums">
                        ({filteredComplaints.length})
                      </span>
                    </h2>

                    <div
                      role="group"
                      aria-label="Filter admin complaints by status"
                      className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start md:self-auto"
                    >
                      {STATUS_TABS.map((status) => (
                        <button
                          key={status}
                          type="button"
                          aria-pressed={filters.status === status}
                          onClick={() => setFilters((prev) => ({ ...prev, status }))}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                            filters.status === status
                              ? 'bg-white text-navy-900 shadow-xs'
                              : 'text-slate-600 hover:text-navy-900'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4 relative">
                      <Search
                        className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        aria-hidden="true"
                      />
                      <label htmlFor="admin-search" className="sr-only">
                        Search complaints by ID, ward, or department
                      </label>
                      <input
                        id="admin-search"
                        type="search"
                        value={filters.searchQuery}
                        onChange={(e) =>
                          setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                        }
                        placeholder="Search ID, ward, department..."
                        className="w-full pl-9 pr-3 py-2 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="admin-filter-category" className="sr-only">
                        Filter by category
                      </label>
                      <select
                        id="admin-filter-category"
                        value={filters.category}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            category: e.target.value as IssueCategory | 'All',
                          }))
                        }
                        className="w-full px-3 py-2 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                      >
                        <option value="All">All Categories</option>
                        {ISSUE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="admin-filter-severity" className="sr-only">
                        Filter by severity
                      </label>
                      <select
                        id="admin-filter-severity"
                        value={filters.severity}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            severity: e.target.value as SeverityLevel | 'All',
                          }))
                        }
                        className="w-full px-3 py-2 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                      >
                        <option value="All">All Severities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={resetFilters}
                        disabled={!hasActiveFilters}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-45 disabled:cursor-not-allowed rounded-lg cursor-pointer whitespace-nowrap"
                      >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {departmentFilter !== 'All' && (
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-600">
                        Filtered by Department:{' '}
                        <span className="font-semibold text-navy-900">{departmentFilter}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setDepartmentFilter('All')}
                        className="font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                      >
                        Show all departments
                      </button>
                    </div>
                  )}
                </div>

                {filteredComplaints.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <p className="font-display text-base font-semibold text-navy-900">
                      No complaints match the selected admin filters
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-4 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {filteredComplaints.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 hover:bg-slate-50/70 transition-colors space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex items-start gap-4 min-w-0">
                            <div className="w-20 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                              <CivicImage
                                src={item.imageUrl}
                                alt={`Uploaded photo for ${item.id}`}
                                className="w-full h-full object-cover"
                                fallbackLabel={item.category}
                              />
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="font-mono font-semibold text-navy-900">
                                  {item.id}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{item.category}</span>
                                <span aria-hidden="true">·</span>
                                <span>{item.ward}</span>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono tabular-nums">{item.reportedAt}</span>
                              </div>
                              <h3 className="font-display text-sm sm:text-base font-bold text-navy-900">
                                {item.analysis.identifiedIssue}
                              </h3>
                              <p className="text-xs text-slate-600 line-clamp-2">
                                {item.analysis.generatedDescription}
                              </p>
                              <p className="text-xs text-slate-500">
                                AI Recommended:{' '}
                                <span className="font-medium text-teal-700">
                                  {item.analysis.recommendedDepartment}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                            <SeverityIndicator severity={item.analysis.severity} />
                            <StatusIndicator status={item.status} />
                          </div>
                        </div>

                        {/* Assignment & Status Update Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-100 items-end">
                          <div className="md:col-span-6">
                            <label
                              htmlFor={`dept-select-${item.id}`}
                              className="block text-xs font-medium text-slate-500 mb-1"
                            >
                              Assigned Municipal Department
                            </label>
                            <select
                              id={`dept-select-${item.id}`}
                              value={item.assignedDepartment}
                              onChange={(e) => onAssignDepartment(item.id, e.target.value)}
                              className="w-full px-3 py-1.5 text-xs font-medium text-navy-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                            >
                              {MUNICIPAL_DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept}>
                                  {dept}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-4">
                            <label
                              htmlFor={`status-select-${item.id}`}
                              className="block text-xs font-medium text-slate-500 mb-1"
                            >
                              Workflow Status
                            </label>
                            <select
                              id={`status-select-${item.id}`}
                              value={item.status}
                              onChange={(e) =>
                                onUpdateStatus(item.id, e.target.value as ComplaintStatus)
                              }
                              className="w-full px-3 py-1.5 text-xs font-semibold text-navy-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                            >
                              <option value="Reported">Reported</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Fixed">Fixed</option>
                            </select>
                          </div>

                          <div className="md:col-span-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => setSelectedId(item.id)}
                              aria-label={`View full details for ${item.id}`}
                              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-navy-900 bg-white border border-slate-300 hover:border-navy-900 rounded-lg cursor-pointer whitespace-nowrap"
                            >
                              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right 4 Cols: Recent Activity & Department Queue Load */}
              <aside className="xl:col-span-4 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-700" aria-hidden="true" />
                      <h2 className="font-display text-base font-bold text-navy-900">
                        Recent Activity
                      </h2>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-slate-500">
                      {activityLog.length} events
                    </span>
                  </div>

                  <ol className="divide-y divide-slate-100">
                    {activityLog.slice(0, 8).map((entry) => (
                      <li key={entry.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-navy-900">
                            {entry.actor} · {entry.complaintId}
                          </span>
                          <span className="font-mono tabular-nums">{entry.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{entry.action}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
                      <h2 className="font-display text-base font-bold text-navy-900">
                        Department Queue Load
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveSection('departments')}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                    >
                      Full Reports
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {departmentWorkload.map((dept) => (
                      <div
                        key={dept.department}
                        className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3"
                      >
                        <span className="text-xs text-slate-700 leading-snug">
                          {dept.department}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-navy-900 font-semibold whitespace-nowrap shrink-0">
                          {dept.openCount} open / {dept.totalCount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}

          {activeSection === 'departments' && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy-900">
                    Department-Wise Grievance Reports
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time grievance load, severity breakdown, and resolution rates across all
                    Shivamogga municipal departments.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                      <th scope="col" className="py-3 px-4 whitespace-nowrap">
                        Municipal Department
                      </th>
                      <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                        Total
                      </th>
                      <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                        Reported
                      </th>
                      <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                        In Progress
                      </th>
                      <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                        Fixed
                      </th>
                      <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                        High-Severity
                      </th>
                      <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                        Resolution Rate
                      </th>
                      <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                        Queue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {departmentReports.map((row) => (
                      <tr key={row.department} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-navy-900 min-w-[240px]">
                          {row.department}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-navy-900 font-semibold">
                          {row.total}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                          {row.reported}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-amber-700 font-medium">
                          {row.inProgress}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-teal-700 font-medium">
                          {row.fixed}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-red-700 font-medium">
                          {row.highSeverity}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700">
                          {row.resolutionRate}%
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleInspectDepartmentQueue(row.department)}
                            className="px-3 py-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-md cursor-pointer"
                          >
                            View Queue
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <div>
                  <h2 className="font-display text-lg font-bold text-navy-900">
                    Complaints by Category
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Distribution of logged civic grievances across Shivamogga categories.
                  </p>
                </div>

                <div className="space-y-3">
                  {metrics.byCategory.map((item) => {
                    const widthPct = Math.round((item.count / maxCategoryCount) * 100);
                    return (
                      <div
                        key={item.category}
                        className="grid grid-cols-12 items-center gap-3 py-1.5"
                      >
                        <span className="col-span-4 text-xs sm:text-sm font-medium text-navy-900 truncate">
                          {item.category}
                        </span>
                        <div className="col-span-6 h-3.5 bg-slate-100 rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-teal-600 rounded-sm transition-all duration-200"
                            style={{ width: `${item.count > 0 ? Math.max(widthPct, 4) : 0}%` }}
                          />
                        </div>
                        <span className="col-span-2 text-right text-xs font-mono tabular-nums text-slate-700">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg font-bold text-navy-900">
                    Full Audit Activity
                  </h2>
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    {activityLog.length} total
                  </span>
                </div>

                <ol className="divide-y divide-slate-100">
                  {activityLog.map((entry) => (
                    <li key={entry.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-navy-900">
                          {entry.actor} · {entry.complaintId}
                        </span>
                        <span className="font-mono tabular-nums">{entry.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{entry.action}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin Complaint Inspection & Assignment Modal */}
      {selectedComplaint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-modal-title"
          className="fixed inset-0 z-50 bg-navy-950/60 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white">
              <div>
                <p className="text-xs font-mono text-slate-500">
                  {selectedComplaint.id} · {selectedComplaint.ward}
                </p>
                <h3
                  id="admin-modal-title"
                  className="font-display text-lg font-bold text-navy-900"
                >
                  {selectedComplaint.analysis.identifiedIssue}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close admin complaint modal"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-navy-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="aspect-16/9 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <CivicImage
                  src={selectedComplaint.imageUrl}
                  alt={`Field photo for ${selectedComplaint.id}`}
                  className="w-full h-full object-cover"
                  fallbackLabel={selectedComplaint.imageName}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-y border-slate-200">
                <div>
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="text-sm font-semibold text-navy-900 mt-0.5">
                    {selectedComplaint.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Severity</p>
                  <SeverityIndicator severity={selectedComplaint.analysis.severity} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Status</p>
                  <StatusIndicator status={selectedComplaint.status} />
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    AI-Recommended Municipal Department
                  </p>
                  <p className="font-semibold text-teal-700 mt-0.5">
                    {selectedComplaint.analysis.recommendedDepartment}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    AI-Generated Complaint Description (Simulated)
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-1 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                    {selectedComplaint.analysis.generatedDescription}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">Citizen Note</p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {selectedComplaint.citizenDescription || 'No extra citizen note provided.'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Simulated AI Severity Rationale
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {selectedComplaint.analysis.reasonForSeverity}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="modal-dept-assign"
                    className="block text-xs font-medium text-slate-500 mb-1"
                  >
                    Assign Municipal Department
                  </label>
                  <select
                    id="modal-dept-assign"
                    value={selectedComplaint.assignedDepartment}
                    onChange={(e) =>
                      onAssignDepartment(selectedComplaint.id, e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  >
                    {MUNICIPAL_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">Update complaint status:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {(['Reported', 'In Progress', 'Fixed'] as const).map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => onUpdateStatus(selectedComplaint.id, statusOption)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                        selectedComplaint.status === statusOption
                          ? 'bg-navy-900 text-white border-navy-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-teal-600'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
