export type PortalMode = 'selection' | 'citizen' | 'admin-login' | 'admin';

export type CitizenPage = 'home' | 'report' | 'track' | 'dashboard' | 'about';

export type AdminSection = 'complaints' | 'departments' | 'analytics';

export type AppPage = 'home' | 'report' | 'citizen' | 'admin' | 'dashboard' | 'about';

export interface AdminUser {
  officerId: string;
  name: string;
  designation: string;
  corporation: string;
}

export interface DepartmentReportRow {
  department: string;
  total: number;
  reported: number;
  inProgress: number;
  fixed: number;
  highSeverity: number;
  resolutionRate: number;
}

export type IssueCategory =
  | 'Pothole'
  | 'Damaged Road'
  | 'Garbage'
  | 'Water Leakage'
  | 'Drainage Blockage'
  | 'Streetlight Issue'
  | 'Pollution'
  | 'Other';

export type SeverityLevel = 'Low' | 'Medium' | 'High';

export type ComplaintStatus = 'Reported' | 'In Progress' | 'Fixed';

export interface SimulatedAiAnalysis {
  identifiedIssue: string;
  severity: SeverityLevel;
  reasonForSeverity: string;
  recommendedDepartment: string;
  generatedDescription: string;
  isSimulated: true;
}

export interface ImageAnalysisInput {
  imageUrl: string;
  imageName: string;
  ward: string;
  citizenDescription?: string;
  categoryOverride?: IssueCategory;
  visualHints?: {
    brightness?: number;
    dominantTone?: 'dark' | 'blue-wet' | 'earth-warm' | 'neutral';
  };
}

export interface ImageAnalysisResult extends SimulatedAiAnalysis {
  detectedCategory: IssueCategory;
  analyzerName: string;
  confidenceLabel: 'High Confidence (Sample)' | 'Moderate Confidence (Sample)';
  visualSignals: string[];
}

export interface ImageAnalysisProvider {
  readonly id: string;
  readonly label: string;
  readonly isSimulated: boolean;
  analyzeImage(input: ImageAnalysisInput): Promise<ImageAnalysisResult>;
}

export interface CivicComplaint {
  id: string;
  category: IssueCategory;
  ward: string;
  citizenDescription: string;
  imageUrl: string;
  imageName: string;
  status: ComplaintStatus;
  assignedDepartment: string;
  reportedAt: string;
  analysis: SimulatedAiAnalysis;
}

export interface ActivityEvent {
  id: string;
  complaintId: string;
  actor: 'Citizen' | 'Municipal Admin';
  action: string;
  timestamp: string;
}

export interface DashboardFilters {
  status: ComplaintStatus | 'All';
  severity: SeverityLevel | 'All';
  category: IssueCategory | 'All';
  searchQuery: string;
}

export interface CategoryMetric {
  category: IssueCategory;
  count: number;
  highSeverityCount: number;
  percentage: number;
}

export interface DashboardMetrics {
  total: number;
  reported: number;
  inProgress: number;
  fixed: number;
  highSeverity: number;
  byCategory: CategoryMetric[];
}

export const ISSUE_CATEGORIES: readonly IssueCategory[] = [
  'Pothole',
  'Damaged Road',
  'Garbage',
  'Water Leakage',
  'Drainage Blockage',
  'Streetlight Issue',
  'Pollution',
  'Other',
] as const;

export const MUNICIPAL_DEPARTMENTS: readonly string[] = [
  'Road & Infrastructure Department',
  'Solid Waste Management Department',
  'Water Supply Department',
  'Drainage Department',
  'Electrical Department',
  'Environmental Department',
  'General Civic Amenities Department',
] as const;

export const SHIVAMOGGA_WARDS: readonly string[] = [
  'Gandhi Bazaar (Ward 14)',
  'Vinoba Nagar (Ward 22)',
  'Kuvempu Nagar (Ward 19)',
  'Gopal Gowda Extension (Ward 27)',
  'Vidya Nagar (Ward 11)',
  'Durgigudi (Ward 08)',
  'B.H. Road Central (Ward 05)',
  'Jayanagar (Ward 16)',
  'Savalanga Road (Ward 12)',
  'Kote Road (Ward 03)',
] as const;
