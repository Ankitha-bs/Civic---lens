import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  FilePlus2,
  FileWarning,
  Search,
  X,
} from 'lucide-react';
import type {
  CivicComplaint,
  ComplaintStatus,
  IssueCategory,
  SimulatedAiAnalysis,
} from '../types/civic';
import { filterComplaints } from '../utils/triageEngine';
import { CivicImage } from './CivicImage';
import { ReportIssueView } from './ReportIssueView';
import { SeverityIndicator, StatusIndicator } from './StatusIndicator';

interface CitizenPortalViewProps {
  complaints: readonly CivicComplaint[];
  citizenSubmittedIds: readonly string[];
  initialCategory?: IssueCategory;
  initialTab?: 'report' | 'track';
  onSubmitComplaint: (input: {
    category: IssueCategory;
    ward: string;
    description: string;
    imageUrl: string;
    imageName: string;
    confirmedAnalysis?: SimulatedAiAnalysis;
  }) => CivicComplaint;
  onGoToDashboard: () => void;
}

const STATUS_STEPS: readonly ComplaintStatus[] = ['Reported', 'In Progress', 'Fixed'];

function StatusProgressBar({ status }: { status: ComplaintStatus }) {
  const activeIndex = STATUS_STEPS.indexOf(status);

  return (
    <div
      aria-label={`Complaint progress: ${status}`}
      className="grid grid-cols-3 gap-2 pt-2"
    >
      {STATUS_STEPS.map((step, idx) => {
        const isReached = idx <= activeIndex;
        const isCurrent = idx === activeIndex;

        return (
          <div key={step} className="space-y-1.5">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                isReached
                  ? status === 'Fixed'
                    ? 'bg-teal-600'
                    : status === 'In Progress'
                      ? 'bg-amber-600'
                      : 'bg-navy-900'
                  : 'bg-slate-200'
              }`}
            />
            <div className="flex items-center gap-1 text-xs">
              {step === 'Reported' && (
                <FileWarning
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isReached ? 'text-navy-900' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              )}
              {step === 'In Progress' && (
                <Clock
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isReached ? 'text-amber-600' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              )}
              {step === 'Fixed' && (
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isReached ? 'text-teal-600' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`whitespace-nowrap ${
                  isCurrent
                    ? 'font-semibold text-navy-900'
                    : isReached
                      ? 'font-medium text-slate-700'
                      : 'text-slate-400'
                }`}
              >
                {step}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CitizenPortalView({
  complaints,
  citizenSubmittedIds,
  initialCategory,
  initialTab = 'report',
  onSubmitComplaint,
  onGoToDashboard,
}: CitizenPortalViewProps) {
  const [activeTab, setActiveTab] = useState<'report' | 'track'>(initialTab);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMineOnly, setShowMineOnly] = useState<boolean>(false);
  const [inspectedId, setInspectedId] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const trackedComplaints = useMemo(() => {
    const base = showMineOnly
      ? complaints.filter((c) => citizenSubmittedIds.includes(c.id))
      : complaints;

    return filterComplaints(base, {
      status: statusFilter,
      severity: 'All',
      category: 'All',
      searchQuery,
    });
  }, [complaints, citizenSubmittedIds, showMineOnly, statusFilter, searchQuery]);

  const citizenStats = useMemo(() => {
    const mine = complaints.filter((c) => citizenSubmittedIds.includes(c.id));
    const source = mine.length > 0 ? mine : complaints;
    return {
      isPersonal: mine.length > 0,
      total: source.length,
      reported: source.filter((c) => c.status === 'Reported').length,
      inProgress: source.filter((c) => c.status === 'In Progress').length,
      fixed: source.filter((c) => c.status === 'Fixed').length,
    };
  }, [complaints, citizenSubmittedIds]);

  const inspectedComplaint = useMemo(
    () => complaints.find((c) => c.id === inspectedId) ?? null,
    [complaints, inspectedId],
  );

  const handleTrackSubmitted = (complaintId: string) => {
    setSearchQuery(complaintId);
    setStatusFilter('All');
    setShowMineOnly(false);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50">
      {/* Citizen Portal Header Band */}
      <section className="bg-navy-900 text-white border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-medium text-teal-300">
                <span>Citizen Portal</span>
                <span aria-hidden="true">·</span>
                <span>Shivamogga Municipal Services</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Report &amp; Track Civic Grievances
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Submit street infrastructure or sanitation issues with photos and track live
                resolution progress across Reported, In Progress, and Fixed stages.
              </p>
            </div>

            {/* Segmented Portal Mode Switcher */}
            <div
              role="tablist"
              aria-label="Citizen Portal Sections"
              className="inline-flex items-center gap-1 p-1 bg-navy-950 border border-navy-800 rounded-lg self-start lg:self-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'report'}
                onClick={() => setActiveTab('report')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'report'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FilePlus2 className="w-4 h-4" aria-hidden="true" />
                <span>Report Issue</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'track'}
                onClick={() => setActiveTab('track')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'track'
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4" aria-hidden="true" />
                <span>
                  Track Complaints ({complaints.length})
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {activeTab === 'report' ? (
        <ReportIssueView
          initialCategory={initialCategory}
          onSubmitComplaint={onSubmitComplaint}
          onGoToDashboard={onGoToDashboard}
          onTrackInCitizenPortal={handleTrackSubmitted}
        />
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Citizen Status Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">
                {citizenStats.isPersonal ? 'Your Submitted Complaints' : 'Tracked Complaints'}
              </p>
              <p className="mt-2 text-3xl font-display font-bold text-navy-900 font-mono tabular-nums">
                {citizenStats.total}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Reported</p>
              <p className="mt-2 text-3xl font-display font-bold text-navy-900 font-mono tabular-nums">
                {citizenStats.reported}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">In Progress</p>
              <p className="mt-2 text-3xl font-display font-bold text-amber-700 font-mono tabular-nums">
                {citizenStats.inProgress}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-medium text-slate-500">Fixed</p>
              <p className="mt-2 text-3xl font-display font-bold text-teal-700 font-mono tabular-nums">
                {citizenStats.fixed}
              </p>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-navy-900">
                  Complaint Status Tracker{' '}
                  <span className="text-sm font-mono font-normal text-slate-500 tabular-nums">
                    ({trackedComplaints.length})
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Updates made by municipal authorities reflect here automatically across all
                  statuses.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {citizenSubmittedIds.length > 0 && (
                  <button
                    type="button"
                    aria-pressed={showMineOnly}
                    onClick={() => setShowMineOnly((prev) => !prev)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      showMineOnly
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-navy-900'
                    }`}
                  >
                    My Submissions Only ({citizenSubmittedIds.length})
                  </button>
                )}

                <div
                  role="group"
                  aria-label="Filter tracked complaints by status"
                  className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
                >
                  {(['All', 'Reported', 'In Progress', 'Fixed'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      aria-pressed={statusFilter === status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        statusFilter === status
                          ? 'bg-white text-navy-900 shadow-xs'
                          : 'text-slate-600 hover:text-navy-900'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <label htmlFor="citizen-track-search" className="sr-only">
                  Search by complaint ID, ward, or issue
                </label>
                <input
                  id="citizen-track-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Complaint ID (e.g., SHV-1048), ward, or issue..."
                  className="w-full pl-9 pr-3 py-2 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
                />
              </div>

              {(searchQuery.trim().length > 0 || statusFilter !== 'All' || showMineOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setShowMineOnly(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Tracked Complaints List */}
          {trackedComplaints.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
              <p className="font-display text-base font-semibold text-navy-900">
                No matching complaints found
              </p>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Clear your search or report a new civic issue in Shivamogga.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setShowMineOnly(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Show All Complaints
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('report')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg cursor-pointer"
                >
                  Report New Issue
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {trackedComplaints.map((item) => {
                const isCitizenSubmission = citizenSubmittedIds.includes(item.id);
                return (
                  <article
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between"
                  >
                    <div className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono font-semibold text-navy-900">
                              {item.id}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{item.ward}</span>
                            {isCitizenSubmission && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-semibold text-teal-700">Your Report</span>
                              </>
                            )}
                          </div>
                          <h3 className="font-display text-base font-bold text-navy-900">
                            {item.analysis.identifiedIssue}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {item.category} · Logged {item.reportedAt}
                          </p>
                        </div>

                        <SeverityIndicator severity={item.analysis.severity} />
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-24 h-18 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <CivicImage
                            src={item.imageUrl}
                            alt={`Issue photo for ${item.id}`}
                            className="w-full h-full object-cover"
                            fallbackLabel={item.category}
                          />
                        </div>
                        <div className="space-y-1.5 min-w-0">
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {item.citizenDescription || item.analysis.generatedDescription}
                          </p>
                          <p className="text-xs text-slate-500">
                            Assigned Wing:{' '}
                            <span className="font-medium text-navy-900">
                              {item.assignedDepartment}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* 3-Step Visual Progress */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">
                            Current Status
                          </span>
                          <StatusIndicator status={item.status} />
                        </div>
                        <StatusProgressBar status={item.status} />
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        Municipal Department Assigned
                      </span>
                      <button
                        type="button"
                        onClick={() => setInspectedId(item.id)}
                        aria-label={`View details for ${item.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Citizen Complaint Detail Modal */}
      {inspectedComplaint && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="citizen-modal-title"
          className="fixed inset-0 z-50 bg-navy-950/60 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 bg-white">
              <div>
                <p className="text-xs font-mono text-slate-500">
                  {inspectedComplaint.id} · {inspectedComplaint.ward}
                </p>
                <h3
                  id="citizen-modal-title"
                  className="font-display text-lg font-bold text-navy-900"
                >
                  {inspectedComplaint.analysis.identifiedIssue}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedId(null)}
                aria-label="Close complaint details"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-navy-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="aspect-16/9 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <CivicImage
                  src={inspectedComplaint.imageUrl}
                  alt={`Submitted photo for ${inspectedComplaint.id}`}
                  className="w-full h-full object-cover"
                  fallbackLabel={inspectedComplaint.imageName}
                />
              </div>

              <StatusProgressBar status={inspectedComplaint.status} />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-y border-slate-200">
                <div>
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="text-sm font-semibold text-navy-900 mt-0.5">
                    {inspectedComplaint.category}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Severity</p>
                  <SeverityIndicator severity={inspectedComplaint.analysis.severity} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Status</p>
                  <StatusIndicator status={inspectedComplaint.status} />
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Assigned Municipal Department
                  </p>
                  <p className="font-semibold text-navy-900 mt-0.5">
                    {inspectedComplaint.assignedDepartment}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Citizen Description
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {inspectedComplaint.citizenDescription ||
                      'Submitted with photographic evidence.'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Simulated AI Triage Summary
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-1 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                    {inspectedComplaint.analysis.generatedDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
