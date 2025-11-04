import { drizzle } from "drizzle-orm/mysql2";
import { healthBiomarkers, metricsData, dashboardSections } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

// Demo user ID (replace with actual user ID after authentication)
const DEMO_USER_ID = 1;

async function seedHealthBiomarkers() {
  console.log("Seeding health biomarkers...");
  
  const biomarkers = [
    {
      userId: DEMO_USER_ID,
      biomarkerType: "hrv",
      value: "81",
      unit: "ms",
      optimalMin: "60",
      optimalMax: "100",
      status: "optimal",
      trend: "improving",
      measuredAt: new Date(),
      source: "apple_health",
      notes: "Morning measurement after 8h sleep"
    },
    {
      userId: DEMO_USER_ID,
      biomarkerType: "vo2_max",
      value: "52",
      unit: "ml/kg/min",
      optimalMin: "45",
      optimalMax: "60",
      status: "optimal",
      trend: "stable",
      measuredAt: new Date(),
      source: "garmin",
      notes: "Measured during VO2 max test"
    },
    {
      userId: DEMO_USER_ID,
      biomarkerType: "hba1c",
      value: "5.2",
      unit: "%",
      optimalMin: "4.0",
      optimalMax: "5.6",
      status: "optimal",
      trend: "stable",
      measuredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      source: "lab_upload",
      notes: "Quest Diagnostics - fasting"
    },
    {
      userId: DEMO_USER_ID,
      biomarkerType: "hscrp",
      value: "0.4",
      unit: "mg/L",
      optimalMin: "0.0",
      optimalMax: "1.0",
      status: "optimal",
      trend: "improving",
      measuredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      source: "lab_upload",
      notes: "Low inflammation marker"
    },
    {
      userId: DEMO_USER_ID,
      biomarkerType: "ldl_cholesterol",
      value: "85",
      unit: "mg/dL",
      optimalMin: "0",
      optimalMax: "100",
      status: "optimal",
      trend: "stable",
      measuredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      source: "lab_upload",
      notes: "Optimal cardiovascular health"
    },
    {
      userId: DEMO_USER_ID,
      biomarkerType: "testosterone",
      value: "720",
      unit: "ng/dL",
      optimalMin: "600",
      optimalMax: "900",
      status: "optimal",
      trend: "stable",
      measuredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      source: "lab_upload",
      notes: "Morning fasting measurement"
    },
    {
      userId: DEMO_USER_ID,
      biomarkerType: "vitamin_d",
      value: "62",
      unit: "ng/mL",
      optimalMin: "50",
      optimalMax: "80",
      status: "optimal",
      trend: "stable",
      measuredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      source: "lab_upload",
      notes: "Supplementing 5000 IU daily"
    },
    {
      userId: DEMO_USER_ID,
      biomarkerType: "omega3_index",
      value: "9.2",
      unit: "%",
      optimalMin: "8.0",
      optimalMax: "12.0",
      status: "optimal",
      trend: "stable",
      measuredAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      source: "lab_upload",
      notes: "Omega-3 supplementation effective"
    },
    {
      userId: DEMO_USER_ID,
      biomarkerType: "cortisol",
      value: "12",
      unit: "μg/dL",
      optimalMin: "6",
      optimalMax: "18",
      status: "optimal",
      trend: "stable",
      measuredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      source: "lab_upload",
      notes: "Morning cortisol - healthy stress response"
    },
    {
      userId: DEMO_USER_ID,
      biomarkerType: "fasting_insulin",
      value: "4.2",
      unit: "μIU/mL",
      optimalMin: "2.0",
      optimalMax: "5.0",
      status: "optimal",
      trend: "improving",
      measuredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      source: "lab_upload",
      notes: "Excellent insulin sensitivity"
    }
  ];

  for (const biomarker of biomarkers) {
    await db.insert(healthBiomarkers).values(biomarker);
  }
  
  console.log(`✓ Seeded ${biomarkers.length} health biomarkers`);
}

async function seedMetricsData() {
  console.log("Seeding metrics data...");
  
  const metrics = [];
  const now = new Date();
  
  // Net worth over 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    metrics.push({
      userId: DEMO_USER_ID,
      metric: "net_worth",
      value: String(1200000000 + (i * 15000000) + Math.random() * 10000000),
      date,
      category: "finance",
      metadata: JSON.stringify({ currency: "USD" })
    });
  }
  
  // HRV over 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    metrics.push({
      userId: DEMO_USER_ID,
      metric: "hrv",
      value: String(75 + Math.random() * 15),
      date,
      category: "health",
      metadata: JSON.stringify({ unit: "ms" })
    });
  }
  
  // Sleep quality over 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    metrics.push({
      userId: DEMO_USER_ID,
      metric: "sleep_hours",
      value: String(7 + Math.random() * 1.5),
      date,
      category: "health",
      metadata: JSON.stringify({ unit: "hours" })
    });
  }

  for (const metric of metrics) {
    await db.insert(metricsData).values(metric);
  }
  
  console.log(`✓ Seeded ${metrics.length} metrics data points`);
}

async function seedDashboardSections() {
  console.log("Seeding dashboard sections...");
  
  const sections = [
    {
      userId: DEMO_USER_ID,
      sectionKey: "net_worth",
      data: JSON.stringify({
        totalNW: "$1.42B",
        ytd: "+18.2%",
        thisMonth: "$127M",
        allocation: {
          publicEquities: 35,
          privateEquity: 25,
          realEstate: 20,
          crypto: 10,
          cash: 8,
          other: 2
        }
      }),
      cadence: "Daily"
    },
    {
      userId: DEMO_USER_ID,
      sectionKey: "business_kpis",
      data: JSON.stringify({
        companies: [
          { name: "HealthTechCo", employees: 287, revenue: "$85M", growth: "+38%", margin: "42%" },
          { name: "SaaS Infra", employees: 143, revenue: "$62M", growth: "+44%", margin: "67%" },
          { name: "Consumer Brand", employees: 198, revenue: "$41M", growth: "+31%", margin: "28%" }
        ],
        totalARR: "$163M",
        blendedGrowth: "+38%"
      }),
      cadence: "Weekly"
    }
  ];

  for (const section of sections) {
    await db.insert(dashboardSections).values(section);
  }
  
  console.log(`✓ Seeded ${sections.length} dashboard sections`);
}

async function main() {
  console.log("Starting database seeding...\n");
  
  try {
    await seedHealthBiomarkers();
    await seedMetricsData();
    await seedDashboardSections();
    
    console.log("\n✓ Database seeding completed successfully!");
  } catch (error) {
    console.error("\n✗ Error seeding database:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

main();
