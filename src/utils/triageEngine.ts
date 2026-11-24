import {
  ISSUE_CATEGORIES,
  MUNICIPAL_DEPARTMENTS,
  type CivicComplaint,
  type ComplaintStatus,
  type DashboardFilters,
  type DashboardMetrics,
  type DepartmentReportRow,
  type IssueCategory,
  type SeverityLevel,
  type SimulatedAiAnalysis,
} from '../types/civic';

interface CategoryRuleTemplate {
  identifiedIssue: string;
  defaultSeverity: SeverityLevel;
  department: string;
  baseReason: string;
  summaryAction: string;
}

const CATEGORY_TEMPLATES: Record<IssueCategory, CategoryRuleTemplate> = {
  Pothole: {
    identifiedIssue: 'Deep Carriageway Pothole Hazard',
    defaultSeverity: 'High',
    department: 'Road & Infrastructure Department',
    baseReason:
      'Open asphalt cavity along active two-wheeler and commuter lanes creates immediate skidding, axle-damage, and waterlogging risk.',
    summaryAction:
      'Urgent cold-mix patching, sub-base compaction, and temporary reflector barricading requested.',
  },
  'Damaged Road': {
    identifiedIssue: 'Severe Road Surface & Shoulder Deterioration',
    defaultSeverity: 'Medium',
    department: 'Road & Infrastructure Department',
    baseReason:
      'Cracked pavement edges and uneven tarmac reduce lane capacity and accelerate monsoon erosion along the corridor.',
    summaryAction:
      'Engineering surface assessment, bitumen resurfacing, and edge-drain reinforcement recommended.',
  },
  Garbage: {
    identifiedIssue: 'Uncollected Municipal Solid Waste Accumulation',
    defaultSeverity: 'Medium',
    department: 'Solid Waste Management Department',
    baseReason:
      'Overflowing waste bins and scattered organic refuse attract vectors, obstruct pedestrian footpaths, and risk stormwater drain blockage.',
    summaryAction:
      'Immediate compactor clearance, bin sanitization, and route collection frequency review advised.',
  },
  'Water Leakage': {
    identifiedIssue: 'Pressurized Municipal Water Pipeline Leakage',
    defaultSeverity: 'High',
    department: 'Water Supply Department',
    baseReason:
      'Continuous treated-water loss lowers neighbourhood supply pressure, undermines road sub-base stability, and creates slippery traffic patches.',
    summaryAction:
      'Valve isolation, joint leak repair, and road-cut restoration required on priority.',
  },
  'Drainage Blockage': {
    identifiedIssue: 'Stormwater & Roadside Drainage Blockage',
    defaultSeverity: 'High',
    department: 'Drainage Department',
    baseReason:
      'Clogged culvert grates and silt-filled side drains restrict stormwater flow, causing stagnant waterlogging and road-edge flooding.',
    summaryAction:
      'Desilting crew dispatch, grate clearance, and culvert flush inspection recommended.',
  },
  'Streetlight Issue': {
    identifiedIssue: 'Non-Functional Streetlight & Public Lighting Outage',
    defaultSeverity: 'Medium',
    department: 'Electrical Department',
    baseReason:
      'Darkened roadway segments reduce night-time pedestrian visibility and increase traffic safety risks at intersections.',
    summaryAction:
      'Pole circuit check, LED luminaire replacement, and feeder timer inspection advised.',
  },
  Pollution: {
    identifiedIssue: 'Localized Air, Smoke, or Effluent Pollution Incident',
    defaultSeverity: 'Medium',
    department: 'Environmental Department',
    baseReason:
      'Unregulated emissions, open waste burning, or untreated runoff degrade ambient neighbourhood air and waterway quality.',
    summaryAction:
      'Field inspection, particulate/effluent sampling, and municipal enforcement notice recommended.',
  },
  Other: {
    identifiedIssue: 'General Civic Infrastructure Maintenance Issue',
    defaultSeverity: 'Low',
    department: 'General Civic Amenities Department',
    baseReason:
      'Reported public-space defect affects local amenity usability and requires routine ward-level inspection.',
    summaryAction:
      'Ward engineer site verification and scheduled maintenance work order recommended.',
  },
};

export function getRecommendedDepartment(category: IssueCategory): string {
  return CATEGORY_TEMPLATES[category].department;
}

const HIGH_RISK_KEYWORDS = [
  'burst',
  'flood',
  'flooding',
  'school',
  'hospital',
  'highway',
  'main pipe',
  'water main',
  'deep',
  'accident',
  'collapse',
  'caved',
  'sparking',
  'toxic',
  'sewage',
  'chemical',
  'overflowing',
  'blocked',
  'emergency',
];

const LOW_RISK_KEYWORDS = [
  'minor',
  'small',
  'slow drip',
  'faded',
  'single',
  'slight',
  'light damage',
  'cosmetic',
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsKeyword(text: string, keywords: readonly string[]): string | null {
  for (const kw of keywords) {
    const pattern = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i');
    if (pattern.test(text)) {
      return kw;
    }
  }
  return null;
}

export function analyzeCivicComplaint(params: {
  category: IssueCategory;
  description: string;
  ward: string;
  imageName?: string;
}): SimulatedAiAnalysis {
  const { category, description, ward, imageName } = params;
  const trimmedDesc = description.trim();
  const combinedSignals = `${trimmedDesc} ${imageName ?? ''}`;
  const template = CATEGORY_TEMPLATES[category];

  let severity: SeverityLevel = template.defaultSeverity;
  let reasonForSeverity = template.baseReason;

  const highKeyword = containsKeyword(combinedSignals, HIGH_RISK_KEYWORDS);
  const lowKeyword = containsKeyword(combinedSignals, LOW_RISK_KEYWORDS);

  if (highKeyword) {
    severity = 'High';
    reasonForSeverity = `Elevated to High severity due to critical risk indicator ("${highKeyword}") reported at ${ward}. ${template.baseReason}`;
  } else if (lowKeyword && category !== 'Water Leakage') {
    severity = 'Low';
    reasonForSeverity = `Classified as Low severity based on localized scope ("${lowKeyword}") noted in the report; suitable for scheduled ward maintenance.`;
  }

  const contextPhrase =
    trimmedDesc.length > 0
      ? `Citizen observation notes: "${trimmedDesc}".`
      : `Submitted with photographic evidence (${imageName || 'field image'}) for visual verification.`;

  const generatedDescription = `[Simulated Triage Summary — ${ward}] ${template.identifiedIssue} logged under ${category}. ${contextPhrase} ${template.summaryAction}`;

  return {
    identifiedIssue: template.identifiedIssue,
    severity,
    reasonForSeverity,
    recommendedDepartment: template.department,
    generatedDescription,
    isSimulated: true,
  };
}

export function computeDashboardMetrics(complaints: readonly CivicComplaint[]): DashboardMetrics {
  const total = complaints.length;
  let reported = 0;
  let inProgress = 0;
  let fixed = 0;
  let highSeverity = 0;

  const categoryCounts = new Map<IssueCategory, { count: number; high: number }>();
  for (const cat of ISSUE_CATEGORIES) {
    categoryCounts.set(cat, { count: 0, high: 0 });
  }

  for (const item of complaints) {
    if (item.status === 'Reported') reported += 1;
    else if (item.status === 'In Progress') inProgress += 1;
    else if (item.status === 'Fixed') fixed += 1;

    if (item.analysis.severity === 'High') {
      highSeverity += 1;
    }

    const bucket = categoryCounts.get(item.category);
    if (bucket) {
      bucket.count += 1;
      if (item.analysis.severity === 'High') {
        bucket.high += 1;
      }
    }
  }

  const byCategory = ISSUE_CATEGORIES.map((category) => {
    const bucket = categoryCounts.get(category) ?? { count: 0, high: 0 };
    const percentage = total > 0 ? Math.round((bucket.count / total) * 100) : 0;
    return {
      category,
      count: bucket.count,
      highSeverityCount: bucket.high,
      percentage,
    };
  });

  return {
    total,
    reported,
    inProgress,
    fixed,
    highSeverity,
    byCategory,
  };
}

export function filterComplaints(
  complaints: readonly CivicComplaint[],
  filters: DashboardFilters,
): CivicComplaint[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return complaints.filter((item) => {
    if (filters.status !== 'All' && item.status !== filters.status) {
      return false;
    }
    if (filters.severity !== 'All' && item.analysis.severity !== filters.severity) {
      return false;
    }
    if (filters.category !== 'All' && item.category !== filters.category) {
      return false;
    }
    if (query.length > 0) {
      const searchable = [
        item.id,
        item.category,
        item.ward,
        item.citizenDescription,
        item.assignedDepartment,
        item.analysis.identifiedIssue,
        item.analysis.recommendedDepartment,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(query)) {
        return false;
      }
    }
    return true;
  });
}

export function nextComplaintStatus(current: ComplaintStatus): ComplaintStatus {
  if (current === 'Reported') return 'In Progress';
  if (current === 'In Progress') return 'Fixed';
  return 'Reported';
}

export function assignComplaintDepartment(
  complaints: readonly CivicComplaint[],
  id: string,
  department: string,
): CivicComplaint[] {
  return complaints.map((item) =>
    item.id === id ? { ...item, assignedDepartment: department } : item,
  );
}

export function updateComplaintStatus(
  complaints: readonly CivicComplaint[],
  id: string,
  status: ComplaintStatus,
): CivicComplaint[] {
  return complaints.map((item) => (item.id === id ? { ...item, status } : item));
}

export function computeDepartmentWorkload(
  complaints: readonly CivicComplaint[],
): Array<{ department: string; openCount: number; totalCount: number }> {
  const map = new Map<string, { openCount: number; totalCount: number }>();
  for (const item of complaints) {
    const existing = map.get(item.assignedDepartment) ?? { openCount: 0, totalCount: 0 };
    existing.totalCount += 1;
    if (item.status !== 'Fixed') {
      existing.openCount += 1;
    }
    map.set(item.assignedDepartment, existing);
  }
  return Array.from(map.entries())
    .map(([department, counts]) => ({
      department,
      openCount: counts.openCount,
      totalCount: counts.totalCount,
    }))
    .sort((a, b) => b.openCount - a.openCount || b.totalCount - a.totalCount);
}

export function computeDepartmentReports(
  complaints: readonly CivicComplaint[],
): DepartmentReportRow[] {
  const buckets = new Map<
    string,
    { total: number; reported: number; inProgress: number; fixed: number; highSeverity: number }
  >();

  for (const dept of MUNICIPAL_DEPARTMENTS) {
    buckets.set(dept, { total: 0, reported: 0, inProgress: 0, fixed: 0, highSeverity: 0 });
  }

  for (const item of complaints) {
    const existing = buckets.get(item.assignedDepartment) ?? {
      total: 0,
      reported: 0,
      inProgress: 0,
      fixed: 0,
      highSeverity: 0,
    };
    existing.total += 1;
    if (item.status === 'Reported') existing.reported += 1;
    else if (item.status === 'In Progress') existing.inProgress += 1;
    else if (item.status === 'Fixed') existing.fixed += 1;

    if (item.analysis.severity === 'High') {
      existing.highSeverity += 1;
    }
    buckets.set(item.assignedDepartment, existing);
  }

  return Array.from(buckets.entries())
    .map(([department, counts]) => ({
      department,
      total: counts.total,
      reported: counts.reported,
      inProgress: counts.inProgress,
      fixed: counts.fixed,
      highSeverity: counts.highSeverity,
      resolutionRate: counts.total > 0 ? Math.round((counts.fixed / counts.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total || b.highSeverity - a.highSeverity);
}

export function generateNextComplaintId(complaints: readonly CivicComplaint[]): string {
  let maxNumber = 1040;
  for (const c of complaints) {
    const match = /^SHV-(\d+)$/.exec(c.id);
    if (match) {
      const num = Number.parseInt(match[1], 10);
      if (num > maxNumber) {
        maxNumber = num;
      }
    }
  }
  return `SHV-${maxNumber + 1}`;
}
