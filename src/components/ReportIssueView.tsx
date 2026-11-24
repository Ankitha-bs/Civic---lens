import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  FileText,
  Info,
  RotateCcw,
  Sparkles,
  Upload,
} from 'lucide-react';
import { SAMPLE_ISSUE_PHOTOS } from '../data/sampleComplaints';
import {
  ISSUE_CATEGORIES,
  SHIVAMOGGA_WARDS,
  type CivicComplaint,
  type ImageAnalysisResult,
  type IssueCategory,
  type SimulatedAiAnalysis,
} from '../types/civic';
import { createImageAnalyzer } from '../utils/imageAnalyzer';
import { CivicImage } from './CivicImage';
import { SeverityIndicator, StatusIndicator } from './StatusIndicator';

interface ReportIssueViewProps {
  initialCategory?: IssueCategory;
  onSubmitComplaint: (input: {
    category: IssueCategory;
    ward: string;
    description: string;
    imageUrl: string;
    imageName: string;
    confirmedAnalysis?: SimulatedAiAnalysis;
  }) => CivicComplaint;
  onGoToDashboard: () => void;
  onTrackInCitizenPortal?: (complaintId: string) => void;
}

export function ReportIssueView({
  initialCategory,
  onSubmitComplaint,
  onGoToDashboard,
  onTrackInCitizenPortal,
}: ReportIssueViewProps) {
  const imageAnalyzer = useMemo(() => createImageAnalyzer(), []);
  const [category, setCategory] = useState<IssueCategory>(initialCategory ?? 'Pothole');
  const [ward, setWard] = useState<string>(SHIVAMOGGA_WARDS[0]);
  const [description, setDescription] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [preAnalysis, setPreAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [hasManualCategoryEdit, setHasManualCategoryEdit] = useState<boolean>(
    Boolean(initialCategory),
  );
  const [validationError, setValidationError] = useState<string>('');
  const [submittedComplaint, setSubmittedComplaint] = useState<CivicComplaint | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const analysisRequestIdRef = useRef<number>(0);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
      setHasManualCategoryEdit(true);
      setSubmittedComplaint(null);
    }
  }, [initialCategory]);

  // Run modular image analysis whenever an image is attached or form context changes
  useEffect(() => {
    if (!imageUrl) {
      setPreAnalysis(null);
      setIsAnalyzing(false);
      return;
    }

    const requestId = ++analysisRequestIdRef.current;
    setIsAnalyzing(true);

    let cancelled = false;
    imageAnalyzer
      .analyzeImage({
        imageUrl,
        imageName: imageName || 'uploaded_civic_photo.jpg',
        ward,
        citizenDescription: description,
        categoryOverride: hasManualCategoryEdit ? category : undefined,
      })
      .then((result) => {
        if (cancelled || requestId !== analysisRequestIdRef.current) return;
        setPreAnalysis(result);
        if (!hasManualCategoryEdit) {
          setCategory(result.detectedCategory);
        }
        setIsAnalyzing(false);
      })
      .catch(() => {
        if (cancelled || requestId !== analysisRequestIdRef.current) return;
        setIsAnalyzing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [imageAnalyzer, imageUrl, imageName, ward, description, category, hasManualCategoryEdit]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file (JPG, PNG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setHasManualCategoryEdit(false);
        setImageUrl(reader.result);
        setImageName(file.name);
        setValidationError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSamplePhoto = (presetId: string) => {
    const preset = SAMPLE_ISSUE_PHOTOS.find((p) => p.id === presetId);
    if (!preset) return;
    setHasManualCategoryEdit(false);
    setImageUrl(preset.imageUrl);
    setImageName(preset.imageName);
    setCategory(preset.suggestedCategory);
    setDescription(preset.sampleDescription);
    setValidationError('');
  };

  const handleClearImage = () => {
    setImageUrl('');
    setImageName('');
    setPreAnalysis(null);
    setHasManualCategoryEdit(Boolean(initialCategory));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const handleSelectCategory = (nextCategory: IssueCategory) => {
    setHasManualCategoryEdit(true);
    setCategory(nextCategory);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!imageUrl) {
      setValidationError(
        'Please upload or capture an issue photograph, or select a sample field photo below before confirming.',
      );
      return;
    }
    setValidationError('');
    const confirmedCategory = preAnalysis && !hasManualCategoryEdit ? preAnalysis.detectedCategory : category;
    const created = onSubmitComplaint({
      category: confirmedCategory,
      ward,
      description,
      imageUrl,
      imageName: imageName || 'uploaded_civic_photo.jpg',
      confirmedAnalysis: preAnalysis ?? undefined,
    });
    setSubmittedComplaint(created);
  };

  const handleResetForNewReport = () => {
    setSubmittedComplaint(null);
    setDescription('');
    handleClearImage();
    setValidationError('');
  };

  if (submittedComplaint) {
    const { analysis } = submittedComplaint;

    return (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Confirmation Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-teal-700" aria-hidden="true" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-semibold text-navy-900">
                  {submittedComplaint.id}
                </span>
                <span aria-hidden="true">·</span>
                <span>{submittedComplaint.ward}</span>
                <span aria-hidden="true">·</span>
                <span>{submittedComplaint.reportedAt}</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-navy-900 mt-1">
                Complaint Confirmed &amp; Routed to Department
              </h1>
            </div>
          </div>

          <div className="shrink-0">
            <StatusIndicator status={submittedComplaint.status} />
          </div>
        </div>

        {/* Explicit Simulated AI Disclaimer */}
        <div
          role="note"
          aria-label="Simulated AI Analysis Notice"
          className="bg-navy-900 text-white rounded-xl p-5 sm:p-6 flex items-start gap-4"
        >
          <Info className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-display text-sm font-semibold text-white">
              Sample AI Image Analysis — Predefined Logic (Not a Real AI Model)
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your complaint was automatically routed to{' '}
              <span className="font-semibold text-white">
                {submittedComplaint.assignedDepartment}
              </span>{' '}
              using simulated visual triage rules and is now live in the Municipal Admin Portal.
            </p>
          </div>
        </div>

        {/* Simulated AI Analysis Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 bg-slate-100 border-b lg:border-b-0 lg:border-r border-slate-200 overflow-hidden">
              <div className="w-full aspect-4/3 lg:aspect-auto lg:h-full lg:min-h-[420px] overflow-hidden">
                <CivicImage
                  src={submittedComplaint.imageUrl}
                  alt={`Submitted civic issue photo for ${submittedComplaint.category}`}
                  className="w-full h-full object-cover"
                  fallbackLabel={submittedComplaint.imageName}
                />
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <p className="text-xs font-medium text-slate-500">Identified Issue</p>
                  <h2 className="font-display text-xl font-bold text-navy-900 mt-1">
                    {analysis.identifiedIssue}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Category: {submittedComplaint.category}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs font-medium text-slate-500 mb-1">Assessed Severity</p>
                  <SeverityIndicator severity={analysis.severity} />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Reason for Severity</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {analysis.reasonForSeverity}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>Assigned Municipal Department</span>
                  </p>
                  <p className="text-sm font-semibold text-navy-900">
                    {submittedComplaint.assignedDepartment}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>AI-Generated Complaint Description</span>
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-4">
                    {analysis.generatedDescription}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                {onTrackInCitizenPortal && (
                  <button
                    type="button"
                    onClick={() => onTrackInCitizenPortal(submittedComplaint.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Track Status in Citizen Portal</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={onGoToDashboard}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    onTrackInCitizenPortal
                      ? 'text-navy-900 bg-white border border-slate-300 hover:bg-slate-50'
                      : 'text-white bg-teal-600 hover:bg-teal-500'
                  }`}
                >
                  <span>View in Public Dashboard</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={handleResetForNewReport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-navy-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Submit Another Issue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mb-8 space-y-2">
        <p className="text-xs font-medium text-teal-700">
          Shivamogga Citizen Intake · Automated Image Triage
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
          Report a Civic Issue
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Upload or capture a photograph of the civic problem. CivicLens immediately runs sample
          image analysis to identify the issue, assess severity, draft a complaint summary, and
          route to the right municipal department before you confirm submission.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6"
        >
          {validationError && (
            <div
              role="alert"
              className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. Image Upload / Capture */}
          <div className="space-y-3">
            <label
              htmlFor="issue-image-upload"
              className="block text-sm font-semibold text-navy-900"
            >
              1. Upload or Capture Issue Image
            </label>

            <div className="border border-dashed border-slate-300 rounded-xl p-5 bg-slate-50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-navy-900">
                    {imageName ? `Selected: ${imageName}` : 'Attach a street or infrastructure photo'}
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports JPG, PNG, or WebP · Triggers automatic pre-submission image analysis.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <label
                    htmlFor="issue-image-upload"
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="w-4 h-4" aria-hidden="true" />
                    <span>{imageUrl ? 'Replace Photo' : 'Choose Photo'}</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    id="issue-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />

                  <label
                    htmlFor="issue-camera-capture"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-navy-900 bg-white border border-slate-300 hover:border-teal-600 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Camera className="w-4 h-4 text-teal-700" aria-hidden="true" />
                    <span>Capture</span>
                  </label>
                  <input
                    ref={cameraInputRef}
                    id="issue-camera-capture"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="sr-only"
                  />

                  {imageUrl && (
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-navy-900 bg-white border border-slate-300 rounded-lg cursor-pointer whitespace-nowrap"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-600 mb-2">
                  Or test immediately with a sample Shivamogga field photo:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_ISSUE_PHOTOS.map((preset) => {
                    const isSelected = imageUrl === preset.imageUrl && imageName === preset.imageName;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectSamplePhoto(preset.id)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-teal-600 hover:text-navy-900'
                        }`}
                      >
                        Use Sample: {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Category Selection */}
          <fieldset className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <legend className="text-sm font-semibold text-navy-900">
                2. Confirm or Adjust Issue Category
              </legend>
              {preAnalysis && (
                <span className="text-xs text-teal-700 font-medium">
                  AI Detected: {preAnalysis.detectedCategory}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ISSUE_CATEGORIES.map((item) => {
                const selected = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleSelectCategory(item)}
                    className={`px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-lg border text-left transition-colors cursor-pointer whitespace-nowrap truncate ${
                      selected
                        ? 'bg-navy-900 text-white border-navy-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-teal-600 hover:text-navy-900'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* 3. Ward / Locality */}
          <div className="space-y-2">
            <label htmlFor="ward-select" className="block text-sm font-semibold text-navy-900">
              3. Shivamogga Locality / Ward
            </label>
            <select
              id="ward-select"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
            >
              {SHIVAMOGGA_WARDS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Optional Description */}
          <div className="space-y-2">
            <label
              htmlFor="issue-description"
              className="block text-sm font-semibold text-navy-900"
            >
              4. Additional Citizen Notes <span className="font-normal text-slate-500">(Optional)</span>
            </label>
            <textarea
              id="issue-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe landmarks, traffic impact, or urgency (e.g., 'Burst main pipe near school gate causing flooding')..."
              className="w-full px-3.5 py-2.5 text-sm text-navy-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-teal-600"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              {preAnalysis
                ? `Review the sample analysis and confirm routing to ${preAnalysis.recommendedDepartment}.`
                : 'Attach an image to preview AI issue analysis and automatic department routing.'}
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{preAnalysis ? 'Confirm & Submit Complaint' : 'Submit Complaint'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </form>

        {/* Right Column: Live Photo Preview & Pre-Submission AI Image Analysis */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-navy-900">
                Attached Photo Preview
              </h2>
              <span className="text-xs font-mono text-slate-500">{category}</span>
            </div>

            <div className="aspect-4/3 bg-slate-100">
              {imageUrl ? (
                <CivicImage
                  src={imageUrl}
                  alt={`Preview of ${category} issue at ${ward}`}
                  className="w-full h-full object-cover"
                  fallbackLabel={imageName || 'Uploaded Issue Photo'}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                  <Upload className="w-7 h-7 text-slate-400" aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-700">No photo attached yet</p>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Upload or capture a photo on the left—or click a sample field photo—to run
                    pre-submission AI image analysis.
                  </p>
                </div>
              )}
            </div>
          </div>

          {preAnalysis ? (
            <div
              data-testid="pre-submission-analysis"
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              <div className="bg-navy-900 text-white px-5 py-3.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-300 shrink-0" aria-hidden="true" />
                  <h2 className="font-display text-sm font-semibold text-white">
                    Pre-Submission Image Analysis
                  </h2>
                </div>
                <span className="text-xs text-teal-300 font-medium">Sample / Simulated</span>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Simulated preview from{' '}
                  <span className="font-medium text-navy-900">{preAnalysis.analyzerName}</span> (no
                  live AI model connected). Review before confirming submission.
                </p>

                <div className="flex items-start justify-between gap-3 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Identified Civic Issue</p>
                    <p className="text-sm font-bold text-navy-900 mt-0.5">
                      {preAnalysis.identifiedIssue}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Category: {category} · {preAnalysis.confidenceLabel}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <SeverityIndicator severity={preAnalysis.severity} />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>Automatic Department Routing</span>
                  </p>
                  <p
                    data-testid="pre-analysis-department"
                    className="text-sm font-semibold text-navy-900 mt-1"
                  >
                    {preAnalysis.recommendedDepartment}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500">Severity Rationale</p>
                  <p className="text-xs text-slate-700 leading-relaxed mt-1">
                    {preAnalysis.reasonForSeverity}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                    <span>AI-Generated Short Description</span>
                  </p>
                  <p
                    data-testid="pre-analysis-description"
                    className="text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-3"
                  >
                    {preAnalysis.generatedDescription}
                  </p>
                </div>

                {isAnalyzing && (
                  <p className="text-xs text-teal-700 font-medium">
                    Updating visual triage preview...
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-navy-900">
                <Info className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
                <h2 className="font-display text-sm font-semibold">
                  Sample AI Image Analysis &amp; Routing
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                As soon as you attach or capture a photo, CivicLens runs a modular simulated image
                analysis to detect the issue category, grade severity (Low, Medium, High), generate
                a complaint description, and map the responsible Shivamogga municipal department
                before you confirm submission.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
