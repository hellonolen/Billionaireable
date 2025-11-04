import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Link } from "wouter";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

export default function DataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setImporting(true);
    
    // Simulate import process
    setTimeout(() => {
      toast.success(`Successfully imported data from ${file.name}`);
      setImporting(false);
      setFile(null);
    }, 2000);
  };

  const downloadTemplate = () => {
    const csvContent = `date,metric,value,unit,notes
2024-01-01,net_worth,1200000,USD,Q1 valuation
2024-01-01,hrv,65,ms,Morning measurement
2024-01-01,sleep,7.5,hours,Good quality
2024-01-01,revenue,450000,USD,Monthly recurring
2024-01-01,steps,12500,count,Daily average`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Import Card */}
          <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl" style={{ background: `${COLORS.primary}20` }}>
                <Upload className="h-6 w-6" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <h2 className="font-semibold text-lg" style={{ color: COLORS.text }}>Import Data</h2>
                <p className="text-sm" style={{ color: COLORS.subt }}>Upload CSV or Excel files</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-xl p-8 text-center" style={{ borderColor: COLORS.border }}>
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-3" style={{ color: COLORS.subt }} />
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>
                    {file ? file.name : "Click to upload or drag and drop"}
                  </div>
                  <div className="text-xs" style={{ color: COLORS.subt }}>CSV, XLSX up to 10MB</div>
                </label>
              </div>

              <Button
                onClick={handleImport}
                disabled={!file || importing}
                className="w-full"
                style={{ background: COLORS.primary, color: "white" }}
              >
                {importing ? "Importing..." : "Import Data"}
              </Button>

              <button
                onClick={downloadTemplate}
                className="w-full text-sm font-medium py-2 hover:underline"
                style={{ color: COLORS.primary }}
              >
                Download CSV Template
              </button>
            </div>
          </div>

          {/* Export Card */}
          <div className="bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl" style={{ background: `${COLORS.accent}20` }}>
                <Download className="h-6 w-6" style={{ color: COLORS.accent }} />
              </div>
              <div>
                <h2 className="font-semibold text-lg" style={{ color: COLORS.text }}>Export Data</h2>
                <p className="text-sm" style={{ color: COLORS.subt }}>Download your dashboard data</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.success("Exporting all data as CSV...")}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export All Data (CSV)
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.success("Exporting financial data...")}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Financial Data Only
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.success("Exporting health data...")}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Health Data Only
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.success("Exporting business metrics...")}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Business Metrics
              </Button>
            </div>
          </div>
        </div>

        {/* Import Guide */}
        <div className="mt-8 bg-blue-50 border rounded-xl p-6" style={{ borderColor: COLORS.primary }}>
          <h3 className="font-semibold text-lg mb-3" style={{ color: COLORS.text }}>Import Format Guide</h3>
          <div className="space-y-2 text-sm" style={{ color: COLORS.text }}>
            <p><strong>Required columns:</strong> date, metric, value</p>
            <p><strong>Optional columns:</strong> unit, notes, category</p>
            <p><strong>Date format:</strong> YYYY-MM-DD (e.g., 2024-01-15)</p>
            <p><strong>Supported metrics:</strong> net_worth, cash, hrv, sleep, workout, weight, steps, revenue, expenses, and more</p>
            <p className="pt-2" style={{ color: COLORS.subt }}>
              Download the template above to see the exact format required for successful imports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
