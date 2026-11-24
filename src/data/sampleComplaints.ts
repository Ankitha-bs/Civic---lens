import type { ActivityEvent, CivicComplaint, IssueCategory } from '../types/civic';
import { analyzeCivicComplaint } from '../utils/triageEngine';

export interface SamplePhotoPreset {
  id: string;
  label: string;
  suggestedCategory: IssueCategory;
  imageUrl: string;
  imageName: string;
  sampleDescription: string;
}

export const SAMPLE_ISSUE_PHOTOS: readonly SamplePhotoPreset[] = [
  {
    id: 'preset-pothole',
    label: 'Rainwater Pothole',
    suggestedCategory: 'Pothole',
    imageUrl: '/src/assets/images/sample_pothole_road_1795512542174.jpg',
    imageName: 'bh_road_pothole_sample.jpg',
    sampleDescription:
      'Deep water-filled pothole in the middle of the carriageway posing hazard to two-wheelers and autos.',
  },
  {
    id: 'preset-garbage',
    label: 'Garbage Overflow',
    suggestedCategory: 'Garbage',
    imageUrl: '/src/assets/images/sample_garbage_overflow_1795512542948.jpg',
    imageName: 'gandhi_bazaar_garbage_sample.jpg',
    sampleDescription:
      'Overflowing roadside municipal waste bin with scattered plastic bags obstructing the pedestrian curb.',
  },
  {
    id: 'preset-water',
    label: 'Pipeline Leak',
    suggestedCategory: 'Water Leakage',
    imageUrl: '/src/assets/images/sample_water_leakage_1795512542966.jpg',
    imageName: 'vinoba_nagar_water_leak_sample.jpg',
    sampleDescription:
      'Pressurized underground water main leak spraying onto the junction and flooding the road surface.',
  },
  {
    id: 'preset-drainage',
    label: 'Drainage Blockage',
    suggestedCategory: 'Drainage Blockage',
    imageUrl: '/src/assets/images/civic_triage_inspection_1795512541724.jpg',
    imageName: 'kuvempu_nagar_drain_blockage_sample.jpg',
    sampleDescription:
      'Clogged stormwater drain grate with silt and debris causing stagnant water along the road edge.',
  },
  {
    id: 'preset-streetlight',
    label: 'Streetlight Outage',
    suggestedCategory: 'Streetlight Issue',
    imageUrl: '/src/assets/images/hero_shivamogga_civic_1795512540829.jpg',
    imageName: 'durgigudi_streetlight_outage_sample.jpg',
    sampleDescription:
      'Two consecutive LED streetlight poles not illuminating after dusk along the pedestrian crossing.',
  },
] as const;

function buildComplaint(
  base: Omit<CivicComplaint, 'analysis' | 'assignedDepartment'>,
): CivicComplaint {
  const analysis = analyzeCivicComplaint({
    category: base.category,
    description: base.citizenDescription,
    ward: base.ward,
    imageName: base.imageName,
  });
  return {
    ...base,
    assignedDepartment: analysis.recommendedDepartment,
    analysis,
  };
}

export const INITIAL_COMPLAINTS: CivicComplaint[] = [
  buildComplaint({
    id: 'SHV-1048',
    category: 'Pothole',
    ward: 'B.H. Road Central (Ward 05)',
    citizenDescription:
      'Deep rainwater-filled crater near the private bus stand junction causing heavy traffic slowdown.',
    imageUrl: '/src/assets/images/sample_pothole_road_1795512542174.jpg',
    imageName: 'bh_road_junction_pothole.jpg',
    status: 'Reported',
    reportedAt: '2026-11-24',
  }),
  buildComplaint({
    id: 'SHV-1047',
    category: 'Water Leakage',
    ward: 'Vinoba Nagar (Ward 22)',
    citizenDescription:
      'Burst main feeder pipe near 60 Feet Road spraying potable water continuously since 6 AM.',
    imageUrl: '/src/assets/images/sample_water_leakage_1795512542966.jpg',
    imageName: 'vinoba_nagar_main_leak.jpg',
    status: 'In Progress',
    reportedAt: '2026-11-23',
  }),
  buildComplaint({
    id: 'SHV-1046',
    category: 'Garbage',
    ward: 'Gandhi Bazaar (Ward 14)',
    citizenDescription:
      'Overflowing community waste container beside market lane with spilled vegetable and plastic refuse.',
    imageUrl: '/src/assets/images/sample_garbage_overflow_1795512542948.jpg',
    imageName: 'gandhi_bazaar_garbage_bin.jpg',
    status: 'Reported',
    reportedAt: '2026-11-23',
  }),
  buildComplaint({
    id: 'SHV-1045',
    category: 'Drainage Blockage',
    ward: 'Kuvempu Nagar (Ward 19)',
    citizenDescription:
      'Blocked roadside stormwater culvert near school zone crossing causing waterlogging on shoulder.',
    imageUrl: '/src/assets/images/civic_triage_inspection_1795512541724.jpg',
    imageName: 'kuvempu_nagar_drainage.jpg',
    status: 'In Progress',
    reportedAt: '2026-11-22',
  }),
  buildComplaint({
    id: 'SHV-1044',
    category: 'Pollution',
    ward: 'Savalanga Road (Ward 12)',
    citizenDescription:
      'Open burning of commercial packaging waste near stormwater culvert causing dense smoke.',
    imageUrl: '/src/assets/images/sample_garbage_overflow_1795512542948.jpg',
    imageName: 'savalanga_smoke_report.jpg',
    status: 'Reported',
    reportedAt: '2026-11-21',
  }),
  buildComplaint({
    id: 'SHV-1043',
    category: 'Streetlight Issue',
    ward: 'Vidya Nagar (Ward 11)',
    citizenDescription:
      'Non-functional LED streetlight poles restored with new driver module along 3rd Cross.',
    imageUrl: '/src/assets/images/hero_shivamogga_civic_1795512540829.jpg',
    imageName: 'vidya_nagar_streetlight.jpg',
    status: 'Fixed',
    reportedAt: '2026-11-20',
  }),
  buildComplaint({
    id: 'SHV-1042',
    category: 'Other',
    ward: 'Durgigudi (Ward 08)',
    citizenDescription:
      'Small damaged pedestrian bollard and faded zebra crossing markings outside library gate.',
    imageUrl: '/src/assets/images/civic_triage_inspection_1795512541724.jpg',
    imageName: 'durgigudi_bollard.jpg',
    status: 'Fixed',
    reportedAt: '2026-11-19',
  }),
  buildComplaint({
    id: 'SHV-1041',
    category: 'Damaged Road',
    ward: 'Gopal Gowda Extension (Ward 27)',
    citizenDescription:
      'Uneven surface settlement following underground cable trenching along 2nd Main.',
    imageUrl: '/src/assets/images/hero_shivamogga_civic_1795512540829.jpg',
    imageName: 'gopal_gowda_road.jpg',
    status: 'Fixed',
    reportedAt: '2026-11-18',
  }),
];

export const INITIAL_ACTIVITY_LOG: ActivityEvent[] = [
  {
    id: 'ACT-104',
    complaintId: 'SHV-1048',
    actor: 'Citizen',
    action: 'Submitted Pothole report at B.H. Road Central (Ward 05)',
    timestamp: '2026-11-24 · 09:15',
  },
  {
    id: 'ACT-103',
    complaintId: 'SHV-1047',
    actor: 'Municipal Admin',
    action: 'Updated SHV-1047 status to In Progress (Water Supply Department)',
    timestamp: '2026-11-23 · 16:40',
  },
  {
    id: 'ACT-102',
    complaintId: 'SHV-1045',
    actor: 'Municipal Admin',
    action: 'Assigned SHV-1045 to Drainage Department',
    timestamp: '2026-11-22 · 11:20',
  },
  {
    id: 'ACT-101',
    complaintId: 'SHV-1043',
    actor: 'Municipal Admin',
    action: 'Marked SHV-1043 Fixed (Electrical Department)',
    timestamp: '2026-11-20 · 17:05',
  },
];
