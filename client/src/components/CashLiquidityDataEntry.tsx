import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface CashLiquidityDataEntryProps {
  onClose: () => void;
  onSave: () => void;
}

export function CashLiquidityDataEntry({ onClose, onSave }: CashLiquidityDataEntryProps) {
  const [cashAvailable, setCashAvailable] = useState("");
  const [monthlyBurn, setMonthlyBurn] = useState("");
  const [requiredCash, setRequiredCash] = useState("");

  const saveMutation = trpc.dashboard.updateSection.useMutation({
    onSuccess: () => {
      toast.success("Cash & Liquidity data saved successfully");
      onSave();
    },
    onError: (error: any) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });

  const handleSave = () => {
    const runway = monthlyBurn ? Math.floor(parseFloat(cashAvailable) / parseFloat(monthlyBurn)) : 0;
    
    saveMutation.mutate({
      sectionKey: "Cash & Liquidity Runway",
      data: JSON.stringify({
        cashAvailable: parseFloat(cashAvailable),
        monthlyBurn: parseFloat(monthlyBurn),
        requiredCash: parseFloat(requiredCash),
        runway,
        updatedAt: new Date().toISOString(),
      }),
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cash & Liquidity Runway</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cashAvailable">Cash Available ($M)</Label>
              <Input
                id="cashAvailable"
                type="number"
                value={cashAvailable}
                onChange={(e) => setCashAvailable(e.target.value)}
                placeholder="158"
              />
            </div>

            <div>
              <Label htmlFor="monthlyBurn">Monthly Burn Rate ($M)</Label>
              <Input
                id="monthlyBurn"
                type="number"
                value={monthlyBurn}
                onChange={(e) => setMonthlyBurn(e.target.value)}
                placeholder="3.8"
              />
            </div>

            <div>
              <Label htmlFor="requiredCash">Required Cash Reserve ($M)</Label>
              <Input
                id="requiredCash"
                type="number"
                value={requiredCash}
                onChange={(e) => setRequiredCash(e.target.value)}
                placeholder="43"
              />
            </div>

            <div className="flex items-end">
              <div className="text-sm text-muted-foreground">
                Runway: {monthlyBurn && cashAvailable ? Math.floor(parseFloat(cashAvailable) / parseFloat(monthlyBurn)) : 0} months
              </div>
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
