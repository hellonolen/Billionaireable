// Pipeline & Opportunities
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface PipelineDataEntryProps {
  onClose: () => void;
  onSave: () => void;
}

export function PipelineDataEntry({ onClose, onSave }: PipelineDataEntryProps) {
  const [totalPipeline, setTotalPipeline] = useState("");
  const [weightedIRR, setWeightedIRR] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Pipeline data saved");
      onSave();
    },
    onError: (error: any) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      sectionKey: "Pipeline of Opportunities & Exits",
      data: JSON.stringify({
        totalPipeline: parseFloat(totalPipeline),
        weightedIRR: parseFloat(weightedIRR),
        updatedAt: new Date().toISOString(),
      }),
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pipeline & Opportunities</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Total Pipeline ($M)</Label>
            <Input type="number" value={totalPipeline} onChange={(e) => setTotalPipeline(e.target.value)} />
          </div>
          <div>
            <Label>Weighted IRR (%)</Label>
            <Input type="number" value={weightedIRR} onChange={(e) => setWeightedIRR(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Key People
export function KeyPeopleDataEntry({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [retention, setRetention] = useState("");
  const [succession, setSuccession] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Key People data saved");
      onSave();
    },
    onError: (error: any) => toast.error(`Failed: ${error.message}`),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Key People / Talent</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Retention Rate (%)</Label>
            <Input type="number" value={retention} onChange={(e) => setRetention(e.target.value)} />
          </div>
          <div>
            <Label>Succession Readiness (%)</Label>
            <Input type="number" value={succession} onChange={(e) => setSuccession(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate({ sectionKey: "Key People / Talent", data: JSON.stringify({ retention: parseFloat(retention), succession: parseFloat(succession) }) })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Time Allocation
export function TimeAllocationDataEntry({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [productive, setProductive] = useState("");
  const [topROI, setTopROI] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Time Allocation saved");
      onSave();
    },
    onError: (error: any) => toast.error(`Failed: ${error.message}`),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Time Allocation & Productivity</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Productive Hours/Week</Label>
            <Input type="number" value={productive} onChange={(e) => setProductive(e.target.value)} />
          </div>
          <div>
            <Label>Top ROI Activity ($M/hr)</Label>
            <Input type="number" value={topROI} onChange={(e) => setTopROI(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate({ sectionKey: "Time Allocation & Productivity", data: JSON.stringify({ productive: parseFloat(productive), topROI: parseFloat(topROI) }) })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Health & Cognitive
export function HealthCognitiveDataEntry({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [hrv, setHrv] = useState("");
  const [recovery, setRecovery] = useState("");
  const [sleep, setSleep] = useState("");
  const [readiness, setReadiness] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Health data saved");
      onSave();
    },
    onError: (error: any) => toast.error(`Failed: ${error.message}`),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Personal Health & Cognitive Performance</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>HRV</Label>
              <Input type="number" value={hrv} onChange={(e) => setHrv(e.target.value)} />
            </div>
            <div>
              <Label>Recovery (%)</Label>
              <Input type="number" value={recovery} onChange={(e) => setRecovery(e.target.value)} />
            </div>
            <div>
              <Label>Sleep (hrs)</Label>
              <Input type="number" step="0.1" value={sleep} onChange={(e) => setSleep(e.target.value)} />
            </div>
            <div>
              <Label>Readiness</Label>
              <Input type="number" value={readiness} onChange={(e) => setReadiness(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate({ sectionKey: "Personal Health & Cognitive Performance", data: JSON.stringify({ hrv: parseFloat(hrv), recovery: parseFloat(recovery), sleep: parseFloat(sleep), readiness: parseFloat(readiness) }) })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reputation & Legal
export function ReputationLegalDataEntry({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [mediaHits, setMediaHits] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [legalIssues, setLegalIssues] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Reputation data saved");
      onSave();
    },
    onError: (error: any) => toast.error(`Failed: ${error.message}`),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Reputation, Brand & Legal/Regulatory</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Media Hits</Label>
            <Input type="number" value={mediaHits} onChange={(e) => setMediaHits(e.target.value)} />
          </div>
          <div>
            <Label>Sentiment Score</Label>
            <Input type="number" value={sentiment} onChange={(e) => setSentiment(e.target.value)} />
          </div>
          <div>
            <Label>Legal Issues</Label>
            <Input type="number" value={legalIssues} onChange={(e) => setLegalIssues(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate({ sectionKey: "Reputation, Brand & Legal/Regulatory", data: JSON.stringify({ mediaHits: parseInt(mediaHits), sentiment: parseFloat(sentiment), legalIssues: parseInt(legalIssues) }) })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Macroeconomic & Market
export function MacroMarketDataEntry({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [fedRate, setFedRate] = useState("");
  const [portfolioImpact, setPortfolioImpact] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Macro data saved");
      onSave();
    },
    onError: (error: any) => toast.error(`Failed: ${error.message}`),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Macroeconomic & Market</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Fed Funds Rate (%)</Label>
            <Input type="number" step="0.01" value={fedRate} onChange={(e) => setFedRate(e.target.value)} />
          </div>
          <div>
            <Label>Portfolio Impact ($M)</Label>
            <Input type="number" value={portfolioImpact} onChange={(e) => setPortfolioImpact(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate({ sectionKey: "Macroeconomic & Market", data: JSON.stringify({ fedRate: parseFloat(fedRate), portfolioImpact: parseFloat(portfolioImpact) }) })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Network & Deal Flow
export function NetworkDealFlowDataEntry({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [tier1VCs, setTier1VCs] = useState("");
  const [converted, setConverted] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Network data saved");
      onSave();
    },
    onError: (error: any) => toast.error(`Failed: ${error.message}`),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Network & Deal Flow Quality</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Tier 1 VCs Intros YTD</Label>
            <Input type="number" value={tier1VCs} onChange={(e) => setTier1VCs(e.target.value)} />
          </div>
          <div>
            <Label>Converted Deals</Label>
            <Input type="number" value={converted} onChange={(e) => setConverted(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate({ sectionKey: "Network & Deal Flow Quality", data: JSON.stringify({ tier1VCs: parseInt(tier1VCs), converted: parseInt(converted) }) })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Risk Exposures
export function RiskExposuresDataEntry({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [concentration, setConcentration] = useState("");
  const [geographic, setGeographic] = useState("");
  const [currency, setCurrency] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Risk data saved");
      onSave();
    },
    onError: (error: any) => toast.error(`Failed: ${error.message}`),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Risk Exposures & Hedging</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Concentration Risk (%)</Label>
            <Input type="number" value={concentration} onChange={(e) => setConcentration(e.target.value)} />
          </div>
          <div>
            <Label>Geographic Risk (%)</Label>
            <Input type="number" value={geographic} onChange={(e) => setGeographic(e.target.value)} />
          </div>
          <div>
            <Label>Currency Risk (%)</Label>
            <Input type="number" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate({ sectionKey: "Risk Exposures & Hedging", data: JSON.stringify({ concentration: parseFloat(concentration), geographic: parseFloat(geographic), currency: parseFloat(currency) }) })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Philanthropy & ESG
export function PhilanthropyESGDataEntry({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [deployed, setDeployed] = useState("");
  const [projects, setProjects] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Philanthropy data saved");
      onSave();
    },
    onError: (error: any) => toast.error(`Failed: ${error.message}`),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Philanthropy, ESG & Impact</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Deployed ($M)</Label>
            <Input type="number" value={deployed} onChange={(e) => setDeployed(e.target.value)} />
          </div>
          <div>
            <Label>Active Projects</Label>
            <Input type="number" value={projects} onChange={(e) => setProjects(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate({ sectionKey: "Philanthropy, ESG & Impact", data: JSON.stringify({ deployed: parseFloat(deployed), projects: parseInt(projects) }) })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// News & Market Intelligence
export function NewsMarketDataEntry({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [relevantNews, setRelevantNews] = useState("");
  const [marketSignals, setMarketSignals] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("News data saved");
      onSave();
    },
    onError: (error: any) => toast.error(`Failed: ${error.message}`),
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>News & Market Intelligence</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Relevant News Items</Label>
            <Input type="number" value={relevantNews} onChange={(e) => setRelevantNews(e.target.value)} />
          </div>
          <div>
            <Label>Market Signals</Label>
            <Input type="number" value={marketSignals} onChange={(e) => setMarketSignals(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => saveMutation.mutate({ sectionKey: "News & Market Intelligence", data: JSON.stringify({ relevantNews: parseInt(relevantNews), marketSignals: parseInt(marketSignals) }) })}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
