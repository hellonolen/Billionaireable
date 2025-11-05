import React, { useState, useRef } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Upload, File, Trash2, Download, FileText, Image as ImageIcon, FileSpreadsheet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Documents() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: documents, isLoading } = trpc.documents.list.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.documents.delete.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate();
      toast.success("Document deleted");
    },
  });

  const filteredDocs = selectedCategory === "all"
    ? documents
    : documents?.filter((d: any) => d.category === selectedCategory);

  const categories = [
    { value: "all", label: "All Documents" },
    { value: "contract", label: "Contracts" },
    { value: "report", label: "Reports" },
    { value: "legal", label: "Legal" },
    { value: "financial", label: "Financial" },
    { value: "other", label: "Other" },
  ];

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-8 w-8" />;
    if (mimeType.includes("pdf")) return <FileText className="h-8 w-8" />;
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return <FileSpreadsheet className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <DashboardHeader />

      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>Documents</h1>
            <p className="text-sm" style={{ color: COLORS.subt }}>Manage contracts, reports, and files</p>
          </div>

          <Button onClick={() => setUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-6 mb-6 overflow-x-auto border-b" style={{ borderColor: COLORS.border }}>
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className="relative px-2 py-2 text-sm font-medium whitespace-nowrap transition-colors group"
              style={{ color: COLORS.text }}
            >
              {cat.label}
              <span 
                className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${
                  selectedCategory === cat.value ? 'bg-blue-500' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'
                }`} 
                style={{ transformOrigin: 'left' }} 
              />
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="border rounded-lg p-4 animate-pulse" style={{ borderColor: COLORS.border }}>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredDocs && filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc: any) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={() => deleteMutation.mutate({ id: doc.id })}
                getFileIcon={getFileIcon}
                formatFileSize={formatFileSize}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border rounded-lg" style={{ borderColor: COLORS.border }}>
            <File className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.subt }} />
            <p className="text-lg font-medium mb-2" style={{ color: COLORS.text }}>No documents yet</p>
            <p className="text-sm mb-4" style={{ color: COLORS.subt }}>Upload your first document to get started</p>
            <Button onClick={() => setUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        )}
      </div>

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
}

function DocumentCard({ document, onDelete, getFileIcon, formatFileSize }: any) {
  const categoryColors: Record<string, string> = {
    contract: "bg-blue-100 text-blue-700",
    report: "bg-green-100 text-green-700",
    legal: "bg-red-100 text-red-700",
    financial: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow" style={{ borderColor: COLORS.border, background: "#fff" }}>
      <div className="flex items-start gap-3 mb-3">
        <div style={{ color: COLORS.subt }}>
          {getFileIcon(document.mimeType)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate" style={{ color: COLORS.text }}>{document.fileName}</h3>
          <p className="text-xs" style={{ color: COLORS.subt }}>{formatFileSize(document.fileSize)}</p>
        </div>
        {document.category && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[document.category] || 'bg-gray-100 text-gray-700'}`}>
            {document.category}
          </span>
        )}
      </div>

      {document.notes && (
        <p className="text-xs mb-3 line-clamp-2" style={{ color: COLORS.subt }}>
          {document.notes}
        </p>
      )}

      <div className="flex gap-2 pt-3 border-t" style={{ borderColor: COLORS.border }}>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
            <Download className="h-3 w-3 mr-1" />
            Download
          </a>
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("other");
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useUtils();

  const uploadMutation = trpc.documents.upload.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate();
      toast.success("Document uploaded successfully");
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast.error("Upload failed: " + error.message);
      setIsUploading(false);
    },
  });

  const resetForm = () => {
    setFile(null);
    setCategory("other");
    setNotes("");
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      
      uploadMutation.mutate({
        fileName: file.name,
        fileData: base64,
        mimeType: file.type,
        fileSize: file.size,
        category,
        notes,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              required
            />
            {file && (
              <p className="text-xs mt-1" style={{ color: COLORS.subt }}>
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes about this document"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
