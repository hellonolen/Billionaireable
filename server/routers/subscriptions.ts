import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createSubscription,
  getSubscriptionByUserId,
  updateSubscription,
  getAllPricingPlans,
  getPricingPlanById,
} from "../db";
import {
  createStripeCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  cancelSubscription,
  reactivateSubscription,
} from "../_core/stripe";

export const subscriptionsRouter = router({
  /**
   * Get current user's subscription status
   */
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await getSubscriptionByUserId(ctx.user.id);
    return subscription;
  }),

  /**
   * Get all available pricing plans
   */
  getPlans: protectedProcedure.query(async () => {
    const plans = await getAllPricingPlans();
    return plans;
  }),

  /**
   * Create checkout session for new subscription
   */
  createCheckout: protectedProcedure
    .input(
      z.object({
        planId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = await getPricingPlanById(input.planId);
      if (!plan || !plan.stripePriceId) {
        throw new Error("Invalid plan");
      }

      // Check if user already has a Stripe customer ID
      let subscription = await getSubscriptionByUserId(ctx.user.id);
      let customerId = subscription?.stripeCustomerId;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        customerId = await createStripeCustomer({
          email: ctx.user.email || "",
          name: ctx.user.name || undefined,
          userId: ctx.user.id,
        });

        if (!customerId) {
          throw new Error("Failed to create customer");
        }
      }

      // Create checkout session
      const checkoutUrl = await createCheckoutSession({
        customerId,
        priceId: plan.stripePriceId,
        successUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}/billing/success`,
        cancelUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}/billing`,
        trialDays: 14, // 14-day free trial
      });

      if (!checkoutUrl) {
        throw new Error("Failed to create checkout session");
      }

      return { url: checkoutUrl };
    }),

  /**
   * Create billing portal session
   */
  createPortal: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await getSubscriptionByUserId(ctx.user.id);
    if (!subscription?.stripeCustomerId) {
      throw new Error("No subscription found");
    }

    const portalUrl = await createBillingPortalSession({
      customerId: subscription.stripeCustomerId,
      returnUrl: `${process.env.VITE_APP_URL || "http://localhost:3000"}/billing`,
    });

    if (!portalUrl) {
      throw new Error("Failed to create portal session");
    }

    return { url: portalUrl };
  }),

  /**
   * Cancel subscription at period end
   */
  cancel: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await getSubscriptionByUserId(ctx.user.id);
    if (!subscription?.stripeSubscriptionId) {
      throw new Error("No subscription found");
    }

    const success = await cancelSubscription(subscription.stripeSubscriptionId);
    if (!success) {
      throw new Error("Failed to cancel subscription");
    }

    await updateSubscription(ctx.user.id, {
      cancelAtPeriodEnd: true,
    });

    return { success: true };
  }),

  /**
   * Reactivate a canceled subscription
   */
  reactivate: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await getSubscriptionByUserId(ctx.user.id);
    if (!subscription?.stripeSubscriptionId) {
      throw new Error("No subscription found");
    }

    const success = await reactivateSubscription(subscription.stripeSubscriptionId);
    if (!success) {
      throw new Error("Failed to reactivate subscription");
    }

    await updateSubscription(ctx.user.id, {
      cancelAtPeriodEnd: false,
    });

    return { success: true };
  }),
});
