import { prisma } from "@avuny/db";

const industryCategories = [
  { code: "MANUFACTURING", label: "Manufacturing" },
  { code: "RETAIL", label: "Retail & Consumer Goods" },
  { code: "SOFTWARE", label: "Software & Technology" },
  { code: "HEALTHCARE", label: "Healthcare & Life Sciences" },
  { code: "EDUCATION", label: "Education & Training" },
  { code: "FINANCE", label: "Finance & Banking" },
  { code: "CONSTRUCTION", label: "Construction & Real Estate" },
  { code: "TRANSPORTATION", label: "Transportation & Logistics" },
  { code: "ENERGY", label: "Energy & Utilities" },
  { code: "AGRICULTURE", label: "Agriculture & Food Production" },
  { code: "HOSPITALITY", label: "Hospitality & Tourism" },
  { code: "MEDIA", label: "Media & Entertainment" },
  { code: "GOVERNMENT", label: "Government & Public Sector" },
  { code: "NONPROFIT", label: "Nonprofit & NGOs" },
  { code: "OTHER", label: "Other" },
];

async function seedIndustryCategories() {
  for (const category of industryCategories) {
    await prisma.industryCategory.upsert({
      where: { code: category.code },
      update: {},
      create: category,
    });
  }
  console.log("✅ Industry categories seeded successfully!");
}

async function main() {
  await seedIndustryCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
