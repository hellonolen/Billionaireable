import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { DashboardHeader } from "@/components/DashboardHeader";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, Building, User, Calendar, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Contacts() {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: contacts, isLoading } = trpc.contacts.list.useQuery();
  const utils = trpc.useUtils();
  
  const createMutation = trpc.contacts.create.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      setIsAddingContact(false);
      toast.success("Contact added successfully");
    },
  });
  
  const deleteMutation = trpc.contacts.delete.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      toast.success("Contact deleted");
    },
  });

  const filteredContacts = selectedCategory === "all" 
    ? contacts 
    : contacts?.filter((c: any) => c.category === selectedCategory);

  const categories = [
    { value: "all", label: "All Contacts" },
    { value: "financial", label: "Financial" },
    { value: "legal", label: "Legal" },
    { value: "health", label: "Health" },
    { value: "business", label: "Business" },
    { value: "personal", label: "Personal" },
  ];

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <DashboardHeader />
      
      <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>Contacts</h1>
            <p className="text-sm" style={{ color: COLORS.subt }}>Manage your professional network</p>
          </div>
          
          <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <ContactForm 
                onSubmit={(data) => createMutation.mutate(data)}
                onCancel={() => setIsAddingContact(false)}
              />
            </DialogContent>
          </Dialog>
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

        {/* Contacts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="border rounded-lg p-4 animate-pulse" style={{ borderColor: COLORS.border }}>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : filteredContacts && filteredContacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact: any) => (
              <ContactCard 
                key={contact.id} 
                contact={contact}
                onDelete={() => deleteMutation.mutate({ id: contact.id })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border rounded-lg" style={{ borderColor: COLORS.border }}>
            <User className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.subt }} />
            <p className="text-lg font-medium mb-2" style={{ color: COLORS.text }}>No contacts yet</p>
            <p className="text-sm mb-4" style={{ color: COLORS.subt }}>Add your first contact to get started</p>
            <Button onClick={() => setIsAddingContact(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactCard({ contact, onDelete }: { contact: any; onDelete: () => void }) {
  const categoryColors: Record<string, string> = {
    financial: "bg-green-100 text-green-700",
    legal: "bg-blue-100 text-blue-700",
    health: "bg-red-100 text-red-700",
    business: "bg-purple-100 text-purple-700",
    personal: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow" style={{ borderColor: COLORS.border, background: "#fff" }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>{contact.name}</h3>
          {contact.title && (
            <p className="text-sm" style={{ color: COLORS.subt }}>{contact.title}</p>
          )}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[contact.category] || 'bg-gray-100 text-gray-700'}`}>
          {contact.category}
        </span>
      </div>

      {contact.company && (
        <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: COLORS.text }}>
          <Building className="h-4 w-4" style={{ color: COLORS.subt }} />
          {contact.company}
        </div>
      )}

      {contact.email && (
        <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: COLORS.text }}>
          <Mail className="h-4 w-4" style={{ color: COLORS.subt }} />
          <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a>
        </div>
      )}

      {contact.phone && (
        <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: COLORS.text }}>
          <Phone className="h-4 w-4" style={{ color: COLORS.subt }} />
          <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a>
        </div>
      )}

      {contact.lastContactedAt && (
        <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: COLORS.subt }}>
          <Calendar className="h-3 w-3" />
          Last contact: {new Date(contact.lastContactedAt).toLocaleDateString()}
        </div>
      )}

      <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: COLORS.border }}>
        <Button variant="outline" size="sm" className="flex-1">
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={onDelete}>
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

function ContactForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    category: "business",
    relationship: "",
    notes: "",
    importance: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <Label htmlFor="relationship">Relationship</Label>
        <Input
          id="relationship"
          placeholder="e.g., Accountant, Lawyer, CFO"
          value={formData.relationship}
          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Contact</Button>
      </div>
    </form>
  );
}
