import React, { useState, useRef } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { 
  Upload, File, Trash2, Download, FileText, Image as ImageIcon, FileSpreadsheet,
  User, Mail, Phone, Building, Plus, Edit, X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function System() {
  const [selectedTab, setSelectedTab] = useState<"contacts" | "documents">("contacts");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);

  const { data: contacts, isLoading: contactsLoading } = trpc.contacts.list.useQuery();
  const { data: documents, isLoading: documentsLoading } = trpc.documents.list.useQuery();
  const utils = trpc.useUtils();

  const deleteContactMutation = trpc.contacts.delete.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      toast.success("Contact deleted");
    },
  });

  const deleteDocumentMutation = trpc.documents.delete.useMutation({
    onSuccess: () => {
      utils.documents.list.invalidate();
      toast.success("Document deleted");
    },
  });

  const filteredContacts = selectedCategory === "all"
    ? contacts
    : contacts?.filter((c: any) => c.category === selectedCategory);

  const filteredDocuments = selectedCategory === "all"
    ? documents
    : documents?.filter((d: any) => d.category === selectedCategory);

  const contactCategories = [
    { value: "all", label: "All" },
    { value: "Financial", label: "Financial" },
    { value: "Legal", label: "Legal" },
    { value: "Health", label: "Health" },
    { value: "Business", label: "Business" },
    { value: "Personal", label: "Personal" },
  ];

  const documentCategories = [
    { value: "all", label: "All" },
    { value: "contract", label: "Contracts" },
    { value: "report", label: "Reports" },
    { value: "legal", label: "Legal" },
    { value: "financial", label: "Financial" },
    { value: "other", label: "Other" },
  ];

  const categories = selectedTab === "contacts" ? contactCategories : documentCategories;

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <DashboardHeader />

      <div className="container py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>System</h1>
            <p className="text-sm" style={{ color: COLORS.subt }}>Manage contacts and documents</p>
          </div>

          <Button onClick={() => selectedTab === "contacts" ? setContactModalOpen(true) : setDocumentModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add {selectedTab === "contacts" ? "Contact" : "Document"}
          </Button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-6 mb-6 border-b" style={{ borderColor: COLORS.border }}>
          <button
            onClick={() => {
              setSelectedTab("contacts");
              setSelectedCategory("all");
            }}
            className="relative px-4 py-3 text-sm font-medium transition-colors group"
            style={{ color: COLORS.text }}
          >
            Contacts
            <span 
              className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${
                selectedTab === "contacts" ? 'bg-blue-500' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'
              }`} 
              style={{ transformOrigin: 'left' }} 
            />
          </button>
          <button
            onClick={() => {
              setSelectedTab("documents");
              setSelectedCategory("all");
            }}
            className="relative px-4 py-3 text-sm font-medium transition-colors group"
            style={{ color: COLORS.text }}
          >
            Documents
            <span 
              className={`absolute bottom-0 left-0 w-full h-0.5 transition-all ${
                selectedTab === "documents" ? 'bg-blue-500' : 'bg-blue-500 scale-x-0 group-hover:scale-x-100'
              }`} 
              style={{ transformOrigin: 'left' }} 
            />
          </button>
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

        {/* Content Grid */}
        {selectedTab === "contacts" ? (
          <ContactsGrid
            contacts={filteredContacts}
            isLoading={contactsLoading}
            onEdit={(contact: any) => {
              setEditingContact(contact);
              setContactModalOpen(true);
            }}
            onDelete={(id: number) => deleteContactMutation.mutate({ id })}
            onAdd={() => setContactModalOpen(true)}
          />
        ) : (
          <DocumentsGrid
            documents={filteredDocuments}
            isLoading={documentsLoading}
            onDelete={(id: number) => deleteDocumentMutation.mutate({ id })}
            onAdd={() => setDocumentModalOpen(true)}
          />
        )}
      </div>

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => {
          setContactModalOpen(false);
          setEditingContact(null);
        }}
        contact={editingContact}
      />

      <DocumentUploadModal
        isOpen={documentModalOpen}
        onClose={() => setDocumentModalOpen(false)}
      />
    </div>
  );
}

function ContactsGrid({ contacts, isLoading, onEdit, onDelete, onAdd }: any) {
  const categoryColors: Record<string, string> = {
    Financial: "bg-purple-100 text-purple-700",
    Legal: "bg-red-100 text-red-700",
    Health: "bg-green-100 text-green-700",
    Business: "bg-blue-100 text-blue-700",
    Personal: "bg-gray-100 text-gray-700",
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="border rounded-lg p-4 animate-pulse" style={{ borderColor: COLORS.border, background: "#fff" }}>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-center py-12 bg-white border rounded-lg" style={{ borderColor: COLORS.border }}>
        <User className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.subt }} />
        <p className="text-lg font-medium mb-2" style={{ color: COLORS.text }}>No contacts yet</p>
        <p className="text-sm mb-4" style={{ color: COLORS.subt }}>Add your first contact to get started</p>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact: any) => (
        <div key={contact.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow" style={{ borderColor: COLORS.border, background: "#fff" }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1" style={{ color: COLORS.text }}>{contact.name}</h3>
              {contact.title && <p className="text-sm" style={{ color: COLORS.subt }}>{contact.title}</p>}
            </div>
            {contact.category && (
              <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[contact.category] || 'bg-gray-100 text-gray-700'}`}>
                {contact.category}
              </span>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {contact.email && (
              <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.subt }}>
                <Mail className="h-4 w-4" />
                <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.subt }}>
                <Phone className="h-4 w-4" />
                <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.subt }}>
                <Building className="h-4 w-4" />
                <span>{contact.company}</span>
              </div>
            )}
          </div>

          {contact.notes && (
            <p className="text-xs mb-3 line-clamp-2" style={{ color: COLORS.subt }}>
              {contact.notes}
            </p>
          )}

          <div className="flex gap-2 pt-3 border-t" style={{ borderColor: COLORS.border }}>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(contact)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(contact.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentsGrid({ documents, isLoading, onDelete, onAdd }: any) {
  const categoryColors: Record<string, string> = {
    contract: "bg-blue-100 text-blue-700",
    report: "bg-green-100 text-green-700",
    legal: "bg-red-100 text-red-700",
    financial: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-700",
  };

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="border rounded-lg p-4 animate-pulse" style={{ borderColor: COLORS.border, background: "#fff" }}>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12 bg-white border rounded-lg" style={{ borderColor: COLORS.border }}>
        <File className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.subt }} />
        <p className="text-lg font-medium mb-2" style={{ color: COLORS.text }}>No documents yet</p>
        <p className="text-sm mb-4" style={{ color: COLORS.subt }}>Upload your first document to get started</p>
        <Button onClick={onAdd}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc: any) => (
        <div key={doc.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow" style={{ borderColor: COLORS.border, background: "#fff" }}>
          <div className="flex items-start gap-3 mb-3">
            <div style={{ color: COLORS.subt }}>
              {getFileIcon(doc.mimeType)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate" style={{ color: COLORS.text }}>{doc.fileName}</h3>
              <p className="text-xs" style={{ color: COLORS.subt }}>{formatFileSize(doc.fileSize)}</p>
            </div>
            {doc.category && (
              <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[doc.category] || 'bg-gray-100 text-gray-700'}`}>
                {doc.category}
              </span>
            )}
          </div>

          {doc.notes && (
            <p className="text-xs mb-3 line-clamp-2" style={{ color: COLORS.subt }}>
              {doc.notes}
            </p>
          )}

          <div className="flex gap-2 pt-3 border-t" style={{ borderColor: COLORS.border }}>
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-3 w-3 mr-1" />
                Download
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(doc.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactModal({ isOpen, onClose, contact }: any) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    category: "Business",
    notes: "",
  });

  const utils = trpc.useUtils();

  React.useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        title: contact.title || "",
        category: contact.category || "Business",
        notes: contact.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        title: "",
        category: "Business",
        notes: "",
      });
    }
  }, [contact, isOpen]);

  const createMutation = trpc.contacts.create.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      toast.success("Contact created");
      onClose();
    },
    onError: (error: any) => {
      toast.error("Failed to create contact: " + error.message);
    },
  });

  const updateMutation = trpc.contacts.update.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      toast.success("Contact updated");
      onClose();
    },
    onError: (error: any) => {
      toast.error("Failed to update contact: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact) {
      updateMutation.mutate({ id: contact.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{contact ? "Edit Contact" : "Add Contact"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DocumentUploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
