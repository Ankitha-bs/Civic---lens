import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Eye,
  Plus,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import {
  ISSUE_CATEGORIES,
  type CivicComplaint,
  type ComplaintStatus,
  type DashboardFilters,
  type DashboardMetrics,
  type IssueCategory,
  type SeverityLevel,
} from '../types/civic';
import { filterComplaints, nextComplaintStatus } from '../utils/triageEngine';
import { CivicImage } from './CivicImage';
import { SeverityIndicator, StatusIndicator } from './StatusIndicator';

interface DashboardViewProps {
  complaints: readonly CivicComplaint[];
  metrics: DashboardMetrics;
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
  onReportNew: () => void;
}

const STATUS_TABS: readonly (ComplaintStatus | 'All')[] = [
  'All',
  'Reported',
  'In Progress',
  'Fixed',
];

export function DashboardView({
  complaints,
  metrics,
  onUpdateStatus,
  onReportNew,
}: DashboardViewProps) {
  const [filters, setFilters] = useState<DashboardFilters>({
    status: 'All',
    severity: 'All',
    category: 'All',
    searchQuery: '',
  });
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  const filteredComplaints = useMemo(
    () => filterComplaints(complaints, filters),
    [complaints, filters],
  );

  const selectedComplaint = useMemo(
    () => complaints.find((c) => c.id === selectedComplaintId) ?? null,
    [complaints, selectedComplaintId],
  );

  const maxCategoryCount = useMemo(
    () => Math.max(1, ...metrics.byCategory.map((c) => c.count)),
    [metrics.byCategory],
  );

  const hasActiveFilters =
    filters.status !== 'All' ||
    filters.severity !== 'All' ||
    filters.category !== 'All' ||
    filters.searchQuery.trim().length > 0;

  const clearFilters = () => {
    setFilters({
      status: 'All',
      severity: 'All',
      category: 'All',
      searchQuery: '',
    });
  };

  const toggleCategoryFilter = (cat: IssueCategory) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === cat ? 'All' : cat,
    }));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-teal-700">
            Shivamogga City Corporation · Public Transparency Log
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
            Public Grievance Dashboard
          </h1>
        </div>

        <button
          type="button"
          onClick={onReportNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Report an Issue</span>
        </button>
      </div>

      {/* 5-Card KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Total Complaints</p>
          <p
            data-testid="kpi-total"
            className="mt-2 text-3xl font-display font-bold text-navy-900 font-mono tabular-nums"
          >
            {metrics.total}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Reported</p>
          <p
            data-testid="kpi-reported"
            className="mt-2 text-3xl font-display font-bold text-navy-900 font-mono tabular-nums"
          >
            {metrics.reported}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">In Progress</p>
          <p
            data-testid="kpi-in-progress"
            className="mt-2 text-3xl font-display font-bold text-amber-700 font-mono tabular-nums"
          >
            {metrics.inProgress}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Fixed</p>
          <p
            data-testid="kpi-fixed"
            className="mt-2 text-3xl font-display font-bold text-teal-700 font-mono tabular-nums"
          >
            {metrics.fixed}
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">High-Severity</p>
          <p
            data-testid="kpi-high-severity"
            className="mt-2 text-3xl font-display font-bold text-red-700 font-mono tabular-nums"
          >
            {metrics.highSeverity}
          </p>
        </div>
      </div>

      {/* Category Chart + Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-navy-900">
              Complaints by Category
            </h2>
            <p className="text-xs text-slate-500">
              Click any category bar below to filter the recent complaints table.
            </p>
          </div>
          {filters.category !== 'All' && (
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, category: 'All' }))}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer self-start sm:self-auto"
            >
              Show all categories
            </button>
          )}
        </div>

        <div className="space-y-3" role="list" aria-label="Complaint Category Distribution Chart">
          {metrics.byCategory.map((item) => {
            const widthPct = Math.round((item.count / maxCategoryCount) * 100);
            const isSelected = filters.category === item.category;

            return (
              <button
                key={item.category}
                type="button"
                onClick={() => toggleCategoryFilter(item.category)}
                aria-pressed={isSelected}
                className={`w-full text-left grid grid-cols-12 items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isSelected ? 'bg-teal-50' : 'hover:bg-slate-50'
                }`}
              >
                <span className="col-span-4 sm:col-span-3 text-xs sm:text-sm font-medium text-navy-900 truncate">
                  {item.category}
                </span>

                <div className="col-span-6 sm:col-span-7 h-3.5 bg-slate-100 rounded-sm overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 rounded-sm ${
                      isSelected ? 'bg-navy-900' : 'bg-teal-600'
                    }`}
                    style={{ width: `${item.count > 0 ? Math.max(widthPct, 4) : 0}%` }}
                  />
                </div>

                <span className="col-span-2 text-right text-xs font-mono tabular-nums text-slate-700">
                  {item.count} ({item.percentage}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar & Recent Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-navy-900">
              Recent Complaints{' '}
              <span className="text-sm font-mono font-normal text-slate-500 tabular-nums">
                ({filteredComplaints.length})
              </span>
            </h2>

            {/* Segmented Status Tabs */}
            <div
              role="group"
              aria-label="Filter by complaint status"
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto"
            >
              {STATUS_TABS.map((status) => {
                const active = filters.status === status;
                return (
                  <button
                    key={status}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilters((prev) => ({ ...prev, status }))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-white text-navy-900 shadow-xs'
                        : 'text-slate-600 hover:text-navy-900'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5 relative">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <label htmlFor="dashboard-search" className="sr-only">
                Search complaints by ID, ward, or description
              </label>
              <input
                id="dashboard-search"
                type="search"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Search ID, Shivamogga ward, or issue..."
                className="w-full pl-9 pr-3 py-2 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="filter-category" className="sr-only">
                Filter by category
              </label>
              <select
                id="filter-category"
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

            <div className="sm:col-span-2">
              <label htmlFor="filter-severity" className="sr-only">
                Filter by severity
              </label>
              <select
                id="filter-severity"
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
                <option value="High">High Severity</option>
                <option value="Medium">Medium Severity</option>
                <option value="Low">Low Severity</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-45 disabled:cursor-not-allowed rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table or Empty State */}
        {filteredComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="font-display text-base font-semibold text-navy-900">
              No complaints match your current filters
            </p>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Adjust your search terms or reset filters to view all logged Shivamogga civic
              grievances.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Complaint ID
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Category &amp; Issue
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Ward / Locality
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Severity
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Status
                  </th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">
                    Reported
                  </th>
                  <th scope="col" className="py-3 px-4 text-right whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredComplaints.map((item) => {
                  const nextStatus = nextComplaintStatus(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-navy-900 whitespace-nowrap">
                        {item.id}
                      </td>
                      <td className="py-3.5 px-4 min-w-[210px]">
                        <div className="font-medium text-navy-900">{item.category}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[260px]">
                          {item.analysis.identifiedIssue}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {item.ward}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <SeverityIndicator severity={item.analysis.severity} />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusIndicator status={item.status} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
                        {item.reportedAt}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedComplaintId(item.id)}
                            aria-label={`Inspect complaint ${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-navy-900 bg-white border border-slate-300 hover:border-navy-900 rounded-md cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Inspect</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(item.id, nextStatus)}
                            aria-label={`Change status of ${item.id} to ${nextStatus}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-md cursor-pointer"
                          >
                            <span>Mark {nextStatus}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaint Inspection Modal */}
      {selectedComplaint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-complaint-title"
          className="fixed inset-0 z-50 bg-navy-950/60 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white">
              <div>
                <p className="text-xs font-mono text-slate-500">
                  {selectedComplaint.id} · {selectedComplaint.ward}
                </p>
                <h3
                  id="modal-complaint-title"
                  className="font-display text-lg font-bold text-navy-900"
                >
                  {selectedComplaint.analysis.identifiedIssue}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedComplaintId(null)}
                aria-label="Close complaint details"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-navy-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="aspect-16/9 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <CivicImage
                  src={selectedComplaint.imageUrl}
                  alt={`Field evidence for ${selectedComplaint.id}`}
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
                  <p className="text-xs text-slate-500 mb-0.5">Current Status</p>
                  <StatusIndicator status={selectedComplaint.status} />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Recommended Municipal Department
                  </p>
                  <p className="font-semibold text-navy-900 mt-0.5">
                    {selectedComplaint.analysis.recommendedDepartment}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Reason for Severity (Simulated AI Triage)
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {selectedComplaint.analysis.reasonForSeverity}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Generated Complaint Description (Simulated)
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-1 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                    {selectedComplaint.analysis.generatedDescription}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Update grievance workflow status:
                </span>
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
                    onClick={() => setSelectedComplaintId(null)}
                    className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg cursor-pointer"
                  >
                    <span>Done</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
