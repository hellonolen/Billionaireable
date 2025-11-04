import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn("[Stripe] STRIPE_SECRET_KEY not set. Billing features will be disabled.");
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-10-29.clover",
    })
  : null;

/**
 * Create a Stripe customer for a user
 */
export async function createStripeCustomer(params: {
  email: string;
  name?: string;
  userId: number;
}): Promise<string | null> {
  if (!stripe) {
    console.warn("[Stripe] Cannot create customer: Stripe not initialized");
    return null;
  }

  try {
    const customer = await stripe.customers.create({
      email: params.email,
      name: params.name,
      metadata: {
        userId: params.userId.toString(),
      },
    });
    return customer.id;
  } catch (error) {
    console.error("[Stripe] Failed to create customer:", error);
    return null;
  }
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}): Promise<string | null> {
  if (!stripe) {
    console.warn("[Stripe] Cannot create checkout session: Stripe not initialized");
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer: params.customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      subscription_data: params.trialDays
        ? {
            trial_period_days: params.trialDays,
          }
        : undefined,
    });
    return session.url;
  } catch (error) {
    console.error("[Stripe] Failed to create checkout session:", error);
    return null;
  }
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<string | null> {
  if (!stripe) {
    console.warn("[Stripe] Cannot create portal session: Stripe not initialized");
    return null;
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
    return session.url;
  } catch (error) {
    console.error("[Stripe] Failed to create portal session:", error);
    return null;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  if (!stripe) {
    console.warn("[Stripe] Cannot cancel subscription: Stripe not initialized");
    return false;
  }

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return true;
  } catch (error) {
    console.error("[Stripe] Failed to cancel subscription:", error);
    return false;
  }
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(subscriptionId: string): Promise<boolean> {
  if (!stripe) {
    console.warn("[Stripe] Cannot reactivate subscription: Stripe not initialized");
    return false;
  }

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    });
    return true;
  } catch (error) {
    console.error("[Stripe] Failed to reactivate subscription:", error);
    return false;
  }
}
