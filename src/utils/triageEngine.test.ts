import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeCivicComplaint,
  assignComplaintDepartment,
  computeDashboardMetrics,
  computeDepartmentReports,
  computeDepartmentWorkload,
  filterComplaints,
  generateNextComplaintId,
  nextComplaintStatus,
  updateComplaintStatus,
} from './triageEngine';
import type { CivicComplaint } from '../types/civic';

const MOCK_COMPLAINTS: CivicComplaint[] = [
  {
    id: 'SHV-1041',
    category: 'Pothole',
    ward: 'Gandhi Bazaar (Ward 14)',
    citizenDescription: 'Deep pothole near bus stop.',
    imageUrl: '/sample1.jpg',
    imageName: 'sample1.jpg',
    status: 'Reported',
    assignedDepartment: 'Road & Infrastructure Department',
    reportedAt: '2026-11-23',
    analysis: analyzeCivicComplaint({
      category: 'Pothole',
      description: 'Deep pothole near bus stop.',
      ward: 'Gandhi Bazaar (Ward 14)',
    }),
  },
  {
    id: 'SHV-1042',
    category: 'Garbage',
    ward: 'Vinoba Nagar (Ward 22)',
    citizenDescription: 'Small litter pile near park gate.',
    imageUrl: '/sample2.jpg',
    imageName: 'sample2.jpg',
    status: 'In Progress',
    assignedDepartment: 'Solid Waste Management Department',
    reportedAt: '2026-11-22',
    analysis: analyzeCivicComplaint({
      category: 'Garbage',
      description: 'Small litter pile near park gate.',
      ward: 'Vinoba Nagar (Ward 22)',
    }),
  },
  {
    id: 'SHV-1043',
    category: 'Damaged Road',
    ward: 'Kuvempu Nagar (Ward 19)',
    citizenDescription: 'Cracked shoulder asphalt.',
    imageUrl: '/sample3.jpg',
    imageName: 'sample3.jpg',
    status: 'Fixed',
    assignedDepartment: 'Road & Infrastructure Department',
    reportedAt: '2026-11-20',
    analysis: analyzeCivicComplaint({
      category: 'Damaged Road',
      description: 'Cracked shoulder asphalt.',
      ward: 'Kuvempu Nagar (Ward 19)',
    }),
  },
];

test('analyzeCivicComplaint always marks output as simulated and assigns requested Shivamogga department', () => {
  const result = analyzeCivicComplaint({
    category: 'Water Leakage',
    description: 'Burst main pipe causing road flooding near school',
    ward: 'Vidya Nagar (Ward 11)',
    imageName: 'leak.jpg',
  });

  assert.equal(result.isSimulated, true);
  assert.equal(result.severity, 'High');
  assert.equal(result.recommendedDepartment, 'Water Supply Department');
  assert.match(result.reasonForSeverity, /burst|flood/i);
  assert.match(result.generatedDescription, /Vidya Nagar/);
});

test('analyzeCivicComplaint routes Drainage Blockage, Streetlight Issue, and Pollution accurately', () => {
  const drain = analyzeCivicComplaint({
    category: 'Drainage Blockage',
    description: 'Blocked culvert drain',
    ward: 'Kuvempu Nagar (Ward 19)',
  });
  const light = analyzeCivicComplaint({
    category: 'Streetlight Issue',
    description: 'Pole light out',
    ward: 'Durgigudi (Ward 08)',
  });
  const pollution = analyzeCivicComplaint({
    category: 'Pollution',
    description: 'Smoke burning',
    ward: 'Savalanga Road (Ward 12)',
  });

  assert.equal(drain.recommendedDepartment, 'Drainage Department');
  assert.equal(light.recommendedDepartment, 'Electrical Department');
  assert.equal(light.severity, 'Medium');
  assert.equal(pollution.recommendedDepartment, 'Environmental Department');
});

test('analyzeCivicComplaint downgrades localized minor non-water issues to Low severity', () => {
  const result = analyzeCivicComplaint({
    category: 'Garbage',
    description: 'Small single bag left outside corner',
    ward: 'Jayanagar (Ward 16)',
  });

  assert.equal(result.severity, 'Low');
  assert.equal(result.isSimulated, true);
});

test('computeDashboardMetrics calculates totals, status counts, high-severity, and category breakdown', () => {
  const metrics = computeDashboardMetrics(MOCK_COMPLAINTS);

  assert.equal(metrics.total, 3);
  assert.equal(metrics.reported, 1);
  assert.equal(metrics.inProgress, 1);
  assert.equal(metrics.fixed, 1);
  assert.equal(metrics.highSeverity, 1);

  const potholeMetric = metrics.byCategory.find((c) => c.category === 'Pothole');
  assert.equal(potholeMetric?.count, 1);
  assert.equal(potholeMetric?.highSeverityCount, 1);
  assert.equal(potholeMetric?.percentage, 33);
});

test('filterComplaints filters accurately by status, severity, category, and search query', () => {
  const byStatus = filterComplaints(MOCK_COMPLAINTS, {
    status: 'Fixed',
    severity: 'All',
    category: 'All',
    searchQuery: '',
  });
  assert.equal(byStatus.length, 1);
  assert.equal(byStatus[0].id, 'SHV-1043');

  const byQuery = filterComplaints(MOCK_COMPLAINTS, {
    status: 'All',
    severity: 'All',
    category: 'All',
    searchQuery: 'gandhi',
  });
  assert.equal(byQuery.length, 1);
  assert.equal(byQuery[0].id, 'SHV-1041');
});

test('nextComplaintStatus and generateNextComplaintId behave deterministically', () => {
  assert.equal(nextComplaintStatus('Reported'), 'In Progress');
  assert.equal(nextComplaintStatus('In Progress'), 'Fixed');
  assert.equal(nextComplaintStatus('Fixed'), 'Reported');
  assert.equal(generateNextComplaintId(MOCK_COMPLAINTS), 'SHV-1044');
});

test('assignComplaintDepartment, updateComplaintStatus, and computeDepartmentWorkload work end-to-end', () => {
  const reassigned = assignComplaintDepartment(
    MOCK_COMPLAINTS,
    'SHV-1041',
    'Water Supply Department',
  );
  assert.equal(reassigned[0].assignedDepartment, 'Water Supply Department');

  const updated = updateComplaintStatus(reassigned, 'SHV-1041', 'Fixed');
  assert.equal(updated[0].status, 'Fixed');

  const workload = computeDepartmentWorkload(updated);
  const waterDept = workload.find((w) => w.department === 'Water Supply Department');
  assert.equal(waterDept?.totalCount, 1);
  assert.equal(waterDept?.openCount, 0);
});

test('computeDepartmentReports calculates per-department status, high-severity, and resolution rates', () => {
  const reports = computeDepartmentReports(MOCK_COMPLAINTS);
  assert.equal(reports.length, 7);

  const road = reports.find((r) => r.department === 'Road & Infrastructure Department');
  assert.equal(road?.total, 2);
  assert.equal(road?.reported, 1);
  assert.equal(road?.fixed, 1);
  assert.equal(road?.highSeverity, 1);
  assert.equal(road?.resolutionRate, 50);
});
