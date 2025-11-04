import { drizzle } from "drizzle-orm/mysql2";
import { pricingPlans } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals tracking personal metrics",
    price: "29.00",
    interval: "month",
    features: JSON.stringify([
      "Unlimited dashboard sections",
      "Health & fitness tracking",
      "Financial metrics",
      "Basic integrations",
      "Email support",
    ]),
    isActive: true,
  },
  {
    name: "Professional",
    description: "For executives who need team collaboration",
    price: "99.00",
    interval: "month",
    features: JSON.stringify([
      "Everything in Starter",
      "Team collaboration (up to 5 members)",
      "Advanced analytics & insights",
      "Priority integrations",
      "Custom reports",
      "Priority support",
    ]),
    isActive: true,
  },
  {
    name: "Enterprise",
    description: "For organizations requiring full control",
    price: "299.00",
    interval: "month",
    features: JSON.stringify([
      "Everything in Professional",
      "Unlimited team members",
      "White-label options",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ]),
    isActive: true,
  },
];

async function seed() {
  console.log("Seeding pricing plans...");
  
  for (const plan of plans) {
    await db.insert(pricingPlans).values(plan);
    console.log(`✓ Created plan: ${plan.name}`);
  }
  
  console.log("✓ Pricing plans seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding pricing plans:", error);
  process.exit(1);
});
