import "dotenv/config";
import { db } from "./index";
import { schemes, officials } from "./schema";
import { count } from "drizzle-orm";

async function seed() {
  const [schemeCount] = await db.select({ count: count() }).from(schemes);
  if ((schemeCount?.count ?? 0) === 0) {
    await db.insert(schemes).values([
      {
        slug: "widow-pension",
        name: "Widow Pension Scheme",
        nameHi: "विधवा पेंशन योजना",
        description: "Monthly financial assistance for widows above 18 years.",
        eligibility: ["Widow", "Resident of state", "Age 18-59"],
        requiredDocs: ["Aadhaar card", "Husband's death certificate", "Bank passbook", "Residence proof"],
        benefits: "₹500-2500 monthly pension based on state.",
      },
      {
        slug: "pm-kisan",
        name: "PM-KISAN",
        nameHi: "पीएम-किसान",
        description: "Income support of ₹6000 per year to farmer families.",
        eligibility: ["Small and marginal farmer", "Indian citizen"],
        requiredDocs: ["Aadhaar card", "Land records", "Bank account"],
        benefits: "₹6000 per year in three installments.",
      },
      {
        slug: "old-age-pension",
        name: "Old Age Pension",
        nameHi: "वृद्धावस्था पेंशन",
        description: "Pension for senior citizens above 60 years.",
        eligibility: ["Age above 60", "No regular income"],
        requiredDocs: ["Aadhaar card", "Age proof", "Bank account", "Income certificate"],
        benefits: "Monthly pension up to ₹2000.",
      },
    ]);
    console.log("Seeded schemes.");
  }

  const [officialCount] = await db.select({ count: count() }).from(officials);
  if ((officialCount?.count ?? 0) === 0) {
    await db.insert(officials).values([
      {
        name: "Anjali Kumari",
        role: "Panchayat Secretary",
        jurisdiction: "Block Rampur, 5 villages",
        workloadScore: 78,
        decisionNotes: ["Prioritizes widow pension applications", "Escalates road complaints to PWD"],
      },
      {
        name: "Ramesh Yadav",
        role: "Block Development Officer",
        jurisdiction: "Rampur Block",
        workloadScore: 42,
        decisionNotes: ["Approves pensions after verification"],
      },
    ]);
    console.log("Seeded officials.");
  }
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
