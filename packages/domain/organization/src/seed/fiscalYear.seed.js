import { prisma } from "@avuny/db";

const fiscalYearPatterns = [
  { code: "JAN_DEC", label: "January - December", startMonth: 1, endMonth: 12 },
  { code: "FEB_JAN", label: "February - January", startMonth: 2, endMonth: 1 },
  { code: "MAR_FEB", label: "March - February", startMonth: 3, endMonth: 2 },
  { code: "APR_MAR", label: "April - March", startMonth: 4, endMonth: 3 },
  { code: "MAY_APR", label: "May - April", startMonth: 5, endMonth: 4 },
  { code: "JUN_MAY", label: "June - May", startMonth: 6, endMonth: 5 },
  { code: "JUL_JUN", label: "July - June", startMonth: 7, endMonth: 6 },
  { code: "AUG_JUL", label: "August - July", startMonth: 8, endMonth: 7 },
  { code: "SEP_AUG", label: "September - August", startMonth: 9, endMonth: 8 },
  {
    code: "OCT_SEP",
    label: "October - September",
    startMonth: 10,
    endMonth: 9,
  },
  {
    code: "NOV_OCT",
    label: "November - October",
    startMonth: 11,
    endMonth: 10,
  },
  {
    code: "DEC_NOV",
    label: "December - November",
    startMonth: 12,
    endMonth: 11,
  },
];

async function main() {
  for (const pattern of fiscalYearPatterns) {
    await prisma.fiscalYearPattern.upsert({
      where: { code: pattern.code },
      update: {},
      create: pattern,
    });
  }

  console.log("✅ Fiscal year patterns seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
