import { useMemo, useState } from 'react';
import { AboutView } from './components/AboutView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminPortalView } from './components/AdminPortalView';
import { CitizenPortalView } from './components/CitizenPortalView';
import { DashboardView } from './components/DashboardView';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { Navbar } from './components/Navbar';
import { PortalSelectionView } from './components/PortalSelectionView';
import { ReportIssueView } from './components/ReportIssueView';
import { INITIAL_ACTIVITY_LOG, INITIAL_COMPLAINTS } from './data/sampleComplaints';
import type {
  ActivityEvent,
  AdminUser,
  CitizenPage,
  CivicComplaint,
  ComplaintStatus,
  IssueCategory,
  PortalMode,
  SimulatedAiAnalysis,
} from './types/civic';
import {
  analyzeCivicComplaint,
  assignComplaintDepartment,
  computeDashboardMetrics,
  generateNextComplaintId,
  updateComplaintStatus,
} from './utils/triageEngine';

function formatCurrentTimestamp(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10);
  const timePart = now.toTimeString().slice(0, 5);
  return `${datePart} · ${timePart}`;
}

export default function App() {
  const [portalMode, setPortalMode] = useState<PortalMode>('selection');
  const [citizenPage, setCitizenPage] = useState<CitizenPage>('home');
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  const [complaints, setComplaints] = useState<CivicComplaint[]>(INITIAL_COMPLAINTS);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(INITIAL_ACTIVITY_LOG);
  const [citizenSubmittedIds, setCitizenSubmittedIds] = useState<string[]>([]);
  const [preselectedCategory, setPreselectedCategory] = useState<IssueCategory | undefined>(
    undefined,
  );

  const metrics = useMemo(() => computeDashboardMetrics(complaints), [complaints]);

  const appendActivity = (
    complaintId: string,
    actor: ActivityEvent['actor'],
    action: string,
  ) => {
    setActivityLog((prev) => [
      {
        id: `ACT-${Date.now()}-${prev.length}`,
        complaintId,
        actor,
        action,
        timestamp: formatCurrentTimestamp(),
      },
      ...prev,
    ]);
  };

  const handleEnterCitizenPortal = (targetPage: CitizenPage = 'home') => {
    setCitizenPage(targetPage);
    setPortalMode('citizen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterAdminPortal = () => {
    setPortalMode(adminUser ? 'admin' : 'admin-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSelection = () => {
    setPortalMode('selection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCitizenNavigate = (page: CitizenPage) => {
    if (page !== 'report') {
      setPreselectedCategory(undefined);
    }
    setCitizenPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportCategory = (category: IssueCategory) => {
    setPreselectedCategory(category);
    setCitizenPage('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitComplaint = (input: {
    category: IssueCategory;
    ward: string;
    description: string;
    imageUrl: string;
    imageName: string;
    confirmedAnalysis?: SimulatedAiAnalysis;
  }): CivicComplaint => {
    const newId = generateNextComplaintId(complaints);
    const analysis =
      input.confirmedAnalysis ??
      analyzeCivicComplaint({
        category: input.category,
        description: input.description,
        ward: input.ward,
        imageName: input.imageName,
      });

    const today = new Date().toISOString().slice(0, 10);
    const created: CivicComplaint = {
      id: newId,
      category: input.category,
      ward: input.ward,
      citizenDescription: input.description.trim(),
      imageUrl: input.imageUrl,
      imageName: input.imageName,
      status: 'Reported',
      assignedDepartment: analysis.recommendedDepartment,
      reportedAt: today,
      analysis,
    };

    setComplaints((prev) => [created, ...prev]);
    setCitizenSubmittedIds((prev) => [newId, ...prev]);
    appendActivity(
      newId,
      'Citizen',
      `Submitted ${input.category} report at ${input.ward} (auto-routed to ${analysis.recommendedDepartment})`,
    );
    return created;
  };

  const handleUpdateStatus = (id: string, status: ComplaintStatus) => {
    setComplaints((prev) => updateComplaintStatus(prev, id, status));
    appendActivity(id, 'Municipal Admin', `Updated ${id} status to ${status}`);
  };

  const handleAssignDepartment = (id: string, department: string) => {
    setComplaints((prev) => assignComplaintDepartment(prev, id, department));
    appendActivity(id, 'Municipal Admin', `Assigned ${id} to ${department}`);
  };

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setPortalMode('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminSignOut = () => {
    setAdminUser(null);
    setPortalMode('admin-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (portalMode === 'selection') {
    return (
      <PortalSelectionView
        metrics={metrics}
        onEnterCitizenPortal={() => handleEnterCitizenPortal('home')}
        onEnterAdminPortal={handleEnterAdminPortal}
      />
    );
  }

  if (portalMode === 'admin-login') {
    return (
      <AdminLoginView
        onLoginSuccess={handleAdminLoginSuccess}
        onBackToSelection={handleBackToSelection}
        onSwitchToCitizen={() => handleEnterCitizenPortal('home')}
      />
    );
  }

  if (portalMode === 'admin' && adminUser) {
    return (
      <AdminPortalView
        adminUser={adminUser}
        complaints={complaints}
        metrics={metrics}
        activityLog={activityLog}
        onAssignDepartment={handleAssignDepartment}
        onUpdateStatus={handleUpdateStatus}
        onSwitchToCitizen={() => handleEnterCitizenPortal('home')}
        onBackToSelection={handleBackToSelection}
        onSignOut={handleAdminSignOut}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        currentPage={citizenPage}
        onNavigate={handleCitizenNavigate}
        onBackToSelection={handleBackToSelection}
        onSwitchToAdmin={handleEnterAdminPortal}
      />

      <main className="flex-1">
        {citizenPage === 'home' && (
          <HomeView
            metrics={metrics}
            onNavigate={handleCitizenNavigate}
            onReportCategory={handleReportCategory}
          />
        )}

        {citizenPage === 'report' && (
          <ReportIssueView
            initialCategory={preselectedCategory}
            onSubmitComplaint={handleSubmitComplaint}
            onGoToDashboard={() => handleCitizenNavigate('dashboard')}
            onTrackInCitizenPortal={() => handleCitizenNavigate('track')}
          />
        )}

        {citizenPage === 'track' && (
          <CitizenPortalView
            complaints={complaints}
            citizenSubmittedIds={citizenSubmittedIds}
            initialCategory={preselectedCategory}
            initialTab="track"
            onSubmitComplaint={handleSubmitComplaint}
            onGoToDashboard={() => handleCitizenNavigate('dashboard')}
          />
        )}

        {citizenPage === 'dashboard' && (
          <DashboardView
            complaints={complaints}
            metrics={metrics}
            onUpdateStatus={handleUpdateStatus}
            onReportNew={() => handleCitizenNavigate('report')}
          />
        )}

        {citizenPage === 'about' && <AboutView onNavigate={handleCitizenNavigate} />}
      </main>

      <Footer
        onNavigate={handleCitizenNavigate}
        onBackToSelection={handleBackToSelection}
        onSwitchToAdmin={handleEnterAdminPortal}
      />
    </div>
  );
}
