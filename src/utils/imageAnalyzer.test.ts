import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createImageAnalyzer,
  detectIssueCategoryFromImage,
  sampleImageAnalysisProvider,
} from './imageAnalyzer';

test('sampleImageAnalysisProvider detects civic issues from uploaded image cues and maps departments', async () => {
  const drainAnalysis = await sampleImageAnalysisProvider.analyzeImage({
    imageUrl: '/sample-drain.jpg',
    imageName: 'kuvempu_nagar_drain_blockage_sample.jpg',
    ward: 'Kuvempu Nagar (Ward 19)',
  });
  assert.equal(drainAnalysis.detectedCategory, 'Drainage Blockage');
  assert.equal(drainAnalysis.recommendedDepartment, 'Drainage Department');
  assert.equal(drainAnalysis.isSimulated, true);

  const lightAnalysis = await sampleImageAnalysisProvider.analyzeImage({
    imageUrl: '/sample-light.jpg',
    imageName: 'durgigudi_streetlight_outage_sample.jpg',
    ward: 'Durgigudi (Ward 08)',
  });
  assert.equal(lightAnalysis.detectedCategory, 'Streetlight Issue');
  assert.equal(lightAnalysis.recommendedDepartment, 'Electrical Department');

  const potholeAnalysis = await sampleImageAnalysisProvider.analyzeImage({
    imageUrl: '/sample-pothole.jpg',
    imageName: 'bh_road_pothole_sample.jpg',
    ward: 'B.H. Road Central (Ward 05)',
  });
  assert.equal(potholeAnalysis.detectedCategory, 'Pothole');
  assert.equal(potholeAnalysis.recommendedDepartment, 'Road & Infrastructure Department');
  assert.equal(potholeAnalysis.severity, 'High');
});

test('detectIssueCategoryFromImage uses visual brightness hints when filename is generic', () => {
  const darkDetection = detectIssueCategoryFromImage({
    imageName: 'IMG_20261124_2110.jpg',
    visualHints: { brightness: 42, dominantTone: 'dark' },
  });
  assert.equal(darkDetection.category, 'Streetlight Issue');

  const wetDetection = detectIssueCategoryFromImage({
    imageName: 'IMG_20261124_0900.jpg',
    visualHints: { brightness: 130, dominantTone: 'blue-wet' },
  });
  assert.equal(wetDetection.category, 'Water Leakage');
});

test('sampleImageAnalysisProvider respects manual category override and updates department routing', async () => {
  const overridden = await sampleImageAnalysisProvider.analyzeImage({
    imageUrl: '/sample.jpg',
    imageName: 'IMG_001.jpg',
    ward: 'Savalanga Road (Ward 12)',
    categoryOverride: 'Pollution',
    citizenDescription: 'Thick smoke from waste burning',
  });
  assert.equal(overridden.recommendedDepartment, 'Environmental Department');
  assert.ok(overridden.generatedDescription.includes('Savalanga Road'));
});

test('createImageAnalyzer supports swapping in a custom AI provider cleanly', async () => {
  const analyzer = createImageAnalyzer(sampleImageAnalysisProvider);
  assert.equal(analyzer.isSimulated, true);
  const res = await analyzer.analyzeImage({
    imageUrl: '/sample.jpg',
    imageName: 'garbage_overflow.jpg',
    ward: 'Gandhi Bazaar (Ward 14)',
  });
  assert.equal(res.recommendedDepartment, 'Solid Waste Management Department');
});
