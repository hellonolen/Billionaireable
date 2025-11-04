import React, { useState } from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Link } from "wouter";
import { Plus, Trash2, Bell } from "lucide-react";
import { toast } from "sonner";

interface NotificationRule {
  id: string;
  name: string;
  category: string;
  metric: string;
  condition: string;
  threshold: string;
  enabled: boolean;
}

const RULE_TEMPLATES = [
  { name: "Net Worth Milestone", category: "Financial", metric: "Net Worth", condition: "increases by", threshold: "$10M" },
  { name: "HRV Drop Alert", category: "Health", metric: "HRV", condition: "drops below", threshold: "60" },
  { name: "Sleep Quality Warning", category: "Health", metric: "Sleep Hours", condition: "is less than", threshold: "6" },
  { name: "Revenue Growth", category: "Business", metric: "Monthly Revenue", condition: "increases by", threshold: "10%" },
  { name: "Deal Pipeline Alert", category: "Business", metric: "Active Deals", condition: "exceeds", threshold: "10" },
];

export default function NotificationRules() {
  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: "1",
      name: "Net Worth +$10M",
      category: "Financial",
      metric: "Net Worth",
      condition: "increases by",
      threshold: "$10M",
      enabled: true,
    },
    {
      id: "2",
      name: "HRV Below 60",
      category: "Health",
      metric: "HRV",
      condition: "drops below",
      threshold: "60",
      enabled: true,
    },
  ]);

  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    category: "Financial",
    metric: "",
    condition: "increases by",
    threshold: "",
  });

  const addRule = () => {
    if (!newRule.name || !newRule.metric || !newRule.threshold) {
      toast.error("Please fill in all fields");
      return;
    }

    const rule: NotificationRule = {
      id: Date.now().toString(),
      ...newRule,
      enabled: true,
    };

    setRules([...rules, rule]);
    setNewRule({ name: "", category: "Financial", metric: "", condition: "increases by", threshold: "" });
    setShowNewRule(false);
    toast.success("Notification rule created!");
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    toast.success("Rule deleted");
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const applyTemplate = (template: typeof RULE_TEMPLATES[0]) => {
    setNewRule({
      name: template.name,
      category: template.category,
      metric: template.metric,
      condition: template.condition,
      threshold: template.threshold,
    });
    setShowNewRule(true);
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* New Rule Form */}
        {showNewRule && (
          <div className="bg-white border rounded-xl p-6 mb-6" style={{ borderColor: COLORS.primary, borderWidth: "2px" }}>
            <h3 className="font-semibold text-lg mb-4" style={{ color: COLORS.text }}>Create New Rule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Rule Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="e.g., Net Worth Milestone"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Category</label>
                <select
                  value={newRule.category}
                  onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                >
                  <option>Financial</option>
                  <option>Health</option>
                  <option>Business</option>
                  <option>Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Metric</label>
                <input
                  type="text"
                  value={newRule.metric}
                  onChange={(e) => setNewRule({ ...newRule, metric: e.target.value })}
                  placeholder="e.g., Net Worth, HRV, Revenue"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Condition</label>
                <select
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                >
                  <option>increases by</option>
                  <option>decreases by</option>
                  <option>exceeds</option>
                  <option>drops below</option>
                  <option>equals</option>
                  <option>is less than</option>
                  <option>is greater than</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>Threshold</label>
                <input
                  type="text"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({ ...newRule, threshold: e.target.value })}
                  placeholder="e.g., $10M, 60, 10%"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: COLORS.border }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addRule}>Create Rule</Button>
              <Button variant="outline" onClick={() => setShowNewRule(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Rule Templates */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3" style={{ color: COLORS.text }}>Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {RULE_TEMPLATES.map((template, idx) => (
              <button
                key={idx}
                onClick={() => applyTemplate(template)}
                className="bg-white border rounded-lg p-4 text-left hover:shadow-md transition-shadow"
                style={{ borderColor: COLORS.border }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4" style={{ color: COLORS.primary }} />
                  <div className="font-medium text-sm" style={{ color: COLORS.text }}>{template.name}</div>
                </div>
                <div className="text-xs" style={{ color: COLORS.subt }}>
                  {template.category} • {template.metric} {template.condition} {template.threshold}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Rules */}
        <div>
          <h3 className="font-semibold text-lg mb-3" style={{ color: COLORS.text }}>Your Rules</h3>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white border rounded-xl p-4 flex items-center justify-between"
                style={{ borderColor: COLORS.border, opacity: rule.enabled ? 1 : 0.5 }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold" style={{ color: COLORS.text }}>{rule.name}</h4>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: rule.category === "Financial" ? "#dbeafe" : rule.category === "Health" ? "#dcfce7" : "#fef3c7",
                        color: rule.category === "Financial" ? "#1e40af" : rule.category === "Health" ? "#166534" : "#92400e",
                      }}
                    >
                      {rule.category}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: COLORS.subt }}>
                    Alert me when <strong>{rule.metric}</strong> {rule.condition} <strong>{rule.threshold}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => toggleRule(rule.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: COLORS.text }}>Enabled</span>
                  </label>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete rule"
                  >
                    <Trash2 className="h-4 w-4" style={{ color: "#ef4444" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {rules.length === 0 && (
            <div className="text-center py-12 bg-white border rounded-xl" style={{ borderColor: COLORS.border }}>
              <Bell className="h-12 w-12 mx-auto mb-3" style={{ color: COLORS.subt }} />
              <p className="text-lg font-medium mb-1" style={{ color: COLORS.text }}>
                No rules yet
              </p>
              <p className="text-sm mb-4" style={{ color: COLORS.subt }}>
                Create your first notification rule to get started
              </p>
              <Button onClick={() => setShowNewRule(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
