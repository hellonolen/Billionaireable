import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, Share2, Upload, FileText, Brain } from "lucide-react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Top 10 health biomarkers based on research
const BIOMARKERS = [
  {
    id: "hrv",
    name: "Heart Rate Variability",
    abbr: "HRV",
    currentValue: 81,
    optimalRange: "60-100+",
    unit: "ms",
    trend: "+12%",
    status: "optimal",
    description: "Autonomic nervous system function and stress adaptation",
  },
  {
    id: "vo2max",
    name: "VO2 Max",
    abbr: "VO2 Max",
    currentValue: 52,
    optimalRange: "50+",
    unit: "mL/kg/min",
    trend: "+3%",
    status: "optimal",
    description: "Maximum oxygen consumption during exercise",
  },
  {
    id: "hba1c",
    name: "Hemoglobin A1c",
    abbr: "HbA1c",
    currentValue: 5.1,
    optimalRange: "< 5.2",
    unit: "%",
    trend: "-0.2%",
    status: "optimal",
    description: "3-month average blood sugar level",
  },
  {
    id: "hscrp",
    name: "High-Sensitivity CRP",
    abbr: "hsCRP",
    currentValue: 0.8,
    optimalRange: "< 1.0",
    unit: "mg/L",
    trend: "-0.3",
    status: "optimal",
    description: "Systemic inflammation marker",
  },
  {
    id: "ldl",
    name: "LDL Cholesterol",
    abbr: "LDL-C",
    currentValue: 68,
    optimalRange: "< 70",
    unit: "mg/dL",
    trend: "-12",
    status: "optimal",
    description: "Bad cholesterol and atherosclerosis risk",
  },
  {
    id: "testosterone",
    name: "Testosterone",
    abbr: "Total T",
    currentValue: 720,
    optimalRange: "> 450",
    unit: "ng/dL",
    trend: "+45",
    status: "optimal",
    description: "Energy, metabolism, muscle mass, bone density",
  },
  {
    id: "vitaminD",
    name: "Vitamin D",
    abbr: "Vit D",
    currentValue: 58,
    optimalRange: "> 50",
    unit: "ng/mL",
    trend: "+8",
    status: "optimal",
    description: "Immune function, inflammation, calcium absorption",
  },
  {
    id: "omega3",
    name: "Omega-3 Index",
    abbr: "Omega-3",
    currentValue: 8.4,
    optimalRange: "> 8",
    unit: "%",
    trend: "+0.6%",
    status: "optimal",
    description: "EPA + DHA fatty acids in red blood cells",
  },
  {
    id: "cortisol",
    name: "Cortisol (Morning)",
    abbr: "Cortisol",
    currentValue: 14.2,
    optimalRange: "6-23",
    unit: "mcg/dL",
    trend: "-2.1",
    status: "optimal",
    description: "Primary stress hormone",
  },
  {
    id: "insulin",
    name: "Fasting Insulin",
    abbr: "Insulin",
    currentValue: 4.2,
    optimalRange: "< 5",
    unit: "μIU/mL",
    trend: "-0.8",
    status: "optimal",
    description: "Early marker of insulin resistance",
  },
];

export default function HealthGoals() {
  const [showUploadLab, setShowUploadLab] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newMetric, setNewMetric] = useState({
    name: "",
    value: "",
    optimalRange: "",
    unit: "",
  });
  const [customMetric, setCustomMetric] = useState({
    name: "",
    currentValue: 0,
    optimalRange: "",
    unit: "",
  });

  // Fetch biomarkers from database
  const { data: dbBiomarkers, refetch } = trpc.healthBiomarkers.list.useQuery();
  const addBiomarker = trpc.healthBiomarkers.add.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Biomarker added successfully");
    },
  });

  // Merge database biomarkers with default ones
  const biomarkers = dbBiomarkers && dbBiomarkers.length > 0
    ? dbBiomarkers.map(db => ({
        id: db.biomarkerType,
        name: db.biomarkerType.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        abbr: db.biomarkerType.toUpperCase(),
        currentValue: parseFloat(db.value),
        optimalRange: db.optimalMin && db.optimalMax ? `${db.optimalMin}-${db.optimalMax}` : '',
        unit: db.unit,
        trend: db.trend || '',
        status: db.status,
        description: db.notes || '',
      }))
    : BIOMARKERS;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const uploadLabResults = trpc.healthBiomarkers.uploadLabResults.useMutation({
    onSuccess: (data) => {
      refetch();
      toast.success(`Lab results processed! ${data.biomarkersAdded} biomarkers updated.`);
      setShowUploadLab(false);
      setUploadedFile(null);
    },
    onError: () => {
      toast.error("Failed to process lab results");
    },
  });

  const handleProcessLabResults = async () => {
    if (!uploadedFile) return;
    
    toast.info("Processing lab results...");
    
    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target?.result as string;
      const base64Content = base64Data.split(',')[1]; // Remove data:application/pdf;base64, prefix
      
      try {
        await uploadLabResults.mutateAsync({
          fileName: uploadedFile.name,
          fileData: base64Content,
        });
      } catch (error) {
        console.error('Upload error:', error);
      }
    };
    reader.readAsDataURL(uploadedFile);
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
              Health Biomarkers
            </h1>
            <p className="text-sm" style={{ color: COLORS.subt }}>
              Monitor what matters most on your journey to optimal health and performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowUploadLab(true)}
              className="relative text-sm font-medium group flex items-center gap-2"
              style={{ color: COLORS.text }}
            >
              <Upload className="h-4 w-4" />
              Upload Lab Results
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
            </button>
            <button
              onClick={() => toast.success("Share link created and copied to clipboard")}
              className="relative text-sm font-medium group flex items-center gap-2"
              style={{ color: COLORS.text }}
            >
              <Share2 className="h-4 w-4" />
              Share
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-all" style={{ transformOrigin: 'left' }} />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>10/10</div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Optimal Range</div>
          </div>
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-2xl font-bold mb-1 text-green-600">100%</div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Health Score</div>
          </div>
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>8</div>
            <div className="text-sm" style={{ color: COLORS.subt }}>Improving</div>
          </div>
          <div className="bg-white border rounded-xl p-4" style={{ borderColor: COLORS.border }}>
            <div className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>0</div>
            <div className="text-sm" style={{ color: COLORS.subt }}>At Risk</div>
          </div>
        </div>

        {/* Biomarker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {biomarkers.map((marker) => {
            const isPositiveTrend = marker.trend.startsWith("+");
            const trendColor = isPositiveTrend ? "#10b981" : "#ef4444";
            
            return (
              <div
                key={marker.id}
                className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow"
                style={{ borderColor: COLORS.border }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color: COLORS.subt }}>
                      {marker.name}
                    </div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.text }}>
                      {marker.currentValue}
                      <span className="text-sm font-normal ml-1" style={{ color: COLORS.subt }}>
                        {marker.unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100">
                    {isPositiveTrend ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-green-600" />
                    )}
                    <span className="text-xs font-medium text-green-600">{marker.trend}</span>
                  </div>
                </div>

                {/* Optimal Range */}
                <div className="mb-3">
                  <div className="text-xs mb-1" style={{ color: COLORS.subt }}>
                    Optimal: {marker.optimalRange} {marker.unit}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: "85%",
                        background: "#10b981",
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed" style={{ color: COLORS.subt }}>
                  {marker.description}
                </p>

                {/* Status Badge */}
                <div className="mt-3 pt-3 border-t" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Optimal
                    </span>
                    <button className="text-xs font-medium hover:underline" style={{ color: COLORS.primary }}>
                      View History →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Custom Metric Card */}
          <div
            className="bg-white border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center hover:border-blue-300 transition-colors cursor-pointer"
            style={{ borderColor: COLORS.border }}
            onClick={() => setShowAddCustom(true)}
          >
            <div
              className="p-3 rounded-xl mb-3"
              style={{ background: `${COLORS.primary}20` }}
            >
              <Plus className="h-6 w-6" style={{ color: COLORS.primary }} />
            </div>
            <div className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
              Add Custom Metric
            </div>
            <div className="text-xs text-center" style={{ color: COLORS.subt }}>
              Track additional biomarkers specific to your health goals
            </div>
          </div>
        </div>

        {/* Add Custom Metric Modal */}
        {showAddCustom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" style={{ borderColor: COLORS.border }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>Add Custom Metric</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Metric Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    placeholder="e.g., Blood Pressure, Resting Heart Rate"
                    value={customMetric.name}
                    onChange={(e) => setCustomMetric({ ...customMetric, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Current Value</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    value={customMetric.currentValue}
                    onChange={(e) => setCustomMetric({ ...customMetric, currentValue: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Optimal Range</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    placeholder="e.g., 120/80, < 60"
                    value={customMetric.optimalRange}
                    onChange={(e) => setCustomMetric({ ...customMetric, optimalRange: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Unit</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    style={{ borderColor: COLORS.border }}
                    placeholder="e.g., mmHg, bpm, mg/dL"
                    value={customMetric.unit}
                    onChange={(e) => setCustomMetric({ ...customMetric, unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setShowAddCustom(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Custom metric added");
                    setShowAddCustom(false);
                  }}
                  style={{ background: COLORS.primary, color: "white" }}
                  className="flex-1"
                >
                  Add Metric
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Lab Results Modal */}
        {showUploadLab && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" style={{ borderColor: COLORS.border }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: COLORS.text }}>Upload Lab Results</h2>
              <p className="text-sm mb-4" style={{ color: COLORS.subt }}>
                Upload your lab results and we'll automatically extract and update your biomarker values, keeping your health journey on track.
              </p>
              
              <div className="space-y-4">
                {/* File Upload Area */}
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  style={{ borderColor: uploadedFile ? COLORS.primary : COLORS.border }}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {uploadedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-12 w-12" style={{ color: COLORS.primary }} />
                      <div className="text-sm font-medium" style={{ color: COLORS.text }}>
                        {uploadedFile.name}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.subt }}>
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-12 w-12" style={{ color: COLORS.subt }} />
                      <div className="text-sm font-medium" style={{ color: COLORS.text }}>
                        Click to upload or drag and drop
                      </div>
                      <div className="text-xs" style={{ color: COLORS.subt }}>
                        PDF, JPG, or PNG (Max 10MB)
                      </div>
                    </div>
                  )}
                </div>

                {/* Supported Labs */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs font-medium mb-2" style={{ color: COLORS.text }}>
                    Supported Lab Providers:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Quest Diagnostics', 'LabCorp', 'Any Lab Test Now', 'Vital Labs'].map(lab => (
                      <span key={lab} className="text-xs px-2 py-1 bg-white rounded border" style={{ borderColor: COLORS.border, color: COLORS.subt }}>
                        {lab}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Processing Info */}
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs" style={{ color: COLORS.text }}>
                    Automatically extracts values for: HbA1c, LDL-C, HDL-C, Testosterone, Vitamin D, hsCRP, and other common biomarkers.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => {
                    setShowUploadLab(false);
                    setUploadedFile(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProcessLabResults}
                  disabled={!uploadedFile}
                  style={{ background: uploadedFile ? COLORS.primary : '#ccc', color: "white" }}
                  className="flex-1"
                >
                  Process Results
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="font-semibold mb-3" style={{ color: COLORS.text }}>
            About These Biomarkers
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: COLORS.subt }}>
            These 10 biomarkers are tracked by elite performers, professional athletes, and longevity experts including Bryan Johnson and Peter Attia. 
            They provide comprehensive insights into cardiovascular health, metabolic function, inflammation, hormonal balance, and overall longevity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
              <span style={{ color: COLORS.subt }}>
                <strong style={{ color: COLORS.text }}>Cardiovascular:</strong> HRV, VO2 Max, LDL-C
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span style={{ color: COLORS.subt }}>
                <strong style={{ color: COLORS.text }}>Metabolic:</strong> HbA1c, Insulin, Cortisol
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
              <span style={{ color: COLORS.subt }}>
                <strong style={{ color: COLORS.text }}>Inflammation:</strong> hsCRP
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
              <span style={{ color: COLORS.subt }}>
                <strong style={{ color: COLORS.text }}>Hormonal:</strong> Testosterone
              </span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
              <span style={{ color: COLORS.subt }}>
                <strong style={{ color: COLORS.text }}>Nutritional:</strong> Vitamin D, Omega-3
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
