import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface InvestmentPerformanceDataEntryProps {
  onClose: () => void;
  onSave: () => void;
}

export function InvestmentPerformanceDataEntry({ onClose, onSave }: InvestmentPerformanceDataEntryProps) {
  const [ytdReturn, setYtdReturn] = useState("");
  const [ytd2025Return, setYtd2025Return] = useState("");
  const [vsSP500, setVsSP500] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Investment Performance data saved");
      onSave();
    },
    onError: (error: any) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      sectionKey: "Investment Performance",
      data: JSON.stringify({
        ytdReturn: parseFloat(ytdReturn),
        ytd2025Return: parseFloat(ytd2025Return),
        vsSP500: parseFloat(vsSP500),
        updatedAt: new Date().toISOString(),
      }),
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Investment Performance</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ytdReturn">YTD 2024 Return (%)</Label>
              <Input
                id="ytdReturn"
                type="number"
                step="0.1"
                value={ytdReturn}
                onChange={(e) => setYtdReturn(e.target.value)}
                placeholder="22.1"
              />
            </div>

            <div>
              <Label htmlFor="ytd2025Return">YTD 2025 Return (%)</Label>
              <Input
                id="ytd2025Return"
                type="number"
                step="0.1"
                value={ytd2025Return}
                onChange={(e) => setYtd2025Return(e.target.value)}
                placeholder="14.8"
              />
            </div>

            <div>
              <Label htmlFor="vsSP500">vs S&P 500 (%)</Label>
              <Input
                id="vsSP500"
                type="number"
                step="0.1"
                value={vsSP500}
                onChange={(e) => setVsSP500(e.target.value)}
                placeholder="3.5"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
