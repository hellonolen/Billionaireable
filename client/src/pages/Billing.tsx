import React from "react";
import { COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, CreditCard, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { DashboardHeader } from "@/components/DashboardHeader";
import { toast } from "sonner";

export default function Billing() {
  const { data: subscription, refetch: refetchSubscription } = trpc.subscriptions.getStatus.useQuery();
  const { data: plans } = trpc.subscriptions.getPlans.useQuery();
  const createCheckoutMutation = trpc.subscriptions.createCheckout.useMutation();
  const createPortalMutation = trpc.subscriptions.createPortal.useMutation();
  const cancelMutation = trpc.subscriptions.cancel.useMutation();
  const reactivateMutation = trpc.subscriptions.reactivate.useMutation();

  const handleSubscribe = async (planId: number) => {
    try {
      const result = await createCheckoutMutation.mutateAsync({ planId });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Failed to create checkout session");
    }
  };

  const handleManageBilling = async () => {
    try {
      const result = await createPortalMutation.mutateAsync();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      toast.error("Failed to open billing portal");
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll retain access until the end of your billing period.")) {
      return;
    }
    try {
      await cancelMutation.mutateAsync();
      toast.success("Subscription will be canceled at the end of the billing period");
      refetchSubscription();
    } catch (error) {
      toast.error("Failed to cancel subscription");
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateMutation.mutateAsync();
      toast.success("Subscription reactivated");
      refetchSubscription();
    } catch (error) {
      toast.error("Failed to reactivate subscription");
    }
  };

  return (
    <div style={{ background: COLORS.bg }} className="min-h-screen">
      {/* Header */}
      <DashboardHeader />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Current Subscription Status */}
        {subscription && (
          <div className="bg-white border rounded-xl p-6 mb-6" style={{ borderColor: COLORS.border }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Current Subscription</h2>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm mb-2" style={{ color: COLORS.subt }}>Status</div>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{
                  background: subscription.status === "active" ? "#10b98120" : "#f59e0b20",
                  color: subscription.status === "active" ? "#10b981" : "#f59e0b"
                }}>
                  {subscription.status === "active" ? "Active" : subscription.status}
                </div>
                {subscription.currentPeriodEnd && (
                  <div className="mt-4">
                    <div className="text-sm mb-1" style={{ color: COLORS.subt }}>
                      {subscription.cancelAtPeriodEnd ? "Access until" : "Renews on"}
                    </div>
                    <div className="flex items-center gap-2" style={{ color: COLORS.text }}>
                      <Calendar className="h-4 w-4" />
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {subscription.cancelAtPeriodEnd ? (
                  <Button onClick={handleReactivate} style={{ background: COLORS.primary, color: "white" }}>
                    Reactivate
                  </Button>
                ) : (
                  <Button onClick={handleCancel} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        {!subscription && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>Choose Your Plan</h2>
              <p className="text-sm" style={{ color: COLORS.subt }}>
                Start with a 14-day free trial. Cancel anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans && plans.map((plan) => {
                const features = JSON.parse(plan.features || "[]");
                return (
                  <div
                    key={plan.id}
                    className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow"
                    style={{ borderColor: COLORS.border }}
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.text }}>
                        {plan.name}
                      </h3>
                      {plan.description && (
                        <p className="text-sm mb-4" style={{ color: COLORS.subt }}>
                          {plan.description}
                        </p>
                      )}
                      <div className="mb-2">
                        <span className="text-4xl font-bold" style={{ color: COLORS.text }}>
                          ${plan.price}
                        </span>
                        <span className="text-sm" style={{ color: COLORS.subt }}>
                          /{plan.interval}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: COLORS.subt }}>
                        14-day free trial
                      </div>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 flex-shrink-0" style={{ color: COLORS.primary }} />
                          <span className="text-sm" style={{ color: COLORS.text }}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSubscribe(plan.id)}
                      className="w-full"
                      style={{ background: COLORS.primary, color: "white" }}
                      disabled={createCheckoutMutation.isPending}
                    >
                      {createCheckoutMutation.isPending ? "Loading..." : "Start Free Trial"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Features Comparison */}
        <div className="mt-12 bg-white border rounded-xl p-6" style={{ borderColor: COLORS.border }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.text }}>Why Subscribe?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-medium mb-2" style={{ color: COLORS.text }}>Unlimited Data</div>
              <p className="text-sm" style={{ color: COLORS.subt }}>
                Store unlimited metrics, health data, and financial records
              </p>
            </div>
            <div>
              <div className="font-medium mb-2" style={{ color: COLORS.text }}>Team Collaboration</div>
              <p className="text-sm" style={{ color: COLORS.subt }}>
                Invite assistants and team members to access your dashboard
              </p>
            </div>
            <div>
              <div className="font-medium mb-2" style={{ color: COLORS.text }}>Priority Support</div>
              <p className="text-sm" style={{ color: COLORS.subt }}>
                Get dedicated support and feature requests
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
