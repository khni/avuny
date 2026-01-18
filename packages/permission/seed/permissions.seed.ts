import { ActionName, prisma, ResourceName } from "@avuny/db";

async function main() {
  console.log("🌱 Starting permission seed...");

  // -----------------------------
  // 1️⃣ Seed Actions
  // -----------------------------
  // const actionNames = Object.values(ActionName);
  const actionNames = ["CREATE", "READ", "UPDATE", "DELETE"] as const;

  await prisma.action.createMany({
    data: actionNames.map((name) => ({
      name,
      description: `${name} operation on system resources`,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${actionNames.length} actions`);

  // -----------------------------
  // 2️⃣ Seed Resources
  // -----------------------------
  // const resourceNames = Object.values(ResourceName);
  const resourceNames = ["USER", "ROLE"] as const;

  await prisma.resource.createMany({
    data: resourceNames.map((name) => ({
      name,
      description: `${name} resource in the system`,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${resourceNames.length} resources`);

  // -----------------------------
  // 3️⃣ Seed Standard Permissions (valid combinations)
  // -----------------------------

  // Define valid action-resource combinations
  const validMatrix = {
    USER: ["CREATE", "READ", "UPDATE", "DELETE"],

    ROLE: ["CREATE", "READ", "UPDATE", "DELETE"],
    // ITEM: ["CREATE", "READ", "UPDATE", "DELETE", "EXPORT", "IMPORT"],
    // INVOICE: [
    //   "CREATE",
    //   "READ",
    //   "UPDATE",
    //   "DELETE",
    //   "APPROVE",
    //   "REJECT",
    //   "EXPORT",
    // ],
    // CUSTOMER: ["CREATE", "READ", "UPDATE", "DELETE"],
    // SUPPLIER: ["CREATE", "READ", "UPDATE", "DELETE"],
    // PURCHASE_ORDER: ["CREATE", "READ", "UPDATE", "DELETE", "APPROVE", "REJECT"],
    // SALES_ORDER: ["CREATE", "READ", "UPDATE", "DELETE", "APPROVE", "REJECT"],
    // WAREHOUSE: ["CREATE", "READ", "UPDATE", "DELETE"],
    // ORGANIZATION: ["CREATE", "READ", "UPDATE"],
    // REPORT: ["READ", "EXPORT"],
  };

  const actions = await prisma.action.findMany();
  const resources = await prisma.resource.findMany();

  const permissionData = Object.entries(validMatrix).flatMap(
    ([resourceKey, actionsList]) => {
      const resource = resources.find((r) => r.name === resourceKey);
      return actionsList.map((actionKey) => {
        const action = actions.find((a) => a.name === actionKey);
        return {
          actionId: action!.id,
          resourceId: resource!.id,
          description: `${actionKey} ${resourceKey}`,
          category: "STANDARD",
          isDangerous: actionKey === "DELETE" || actionKey === "APPROVE",
        };
      });
    },
  );

  await prisma.permission.createMany({
    data: permissionData,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${permissionData.length} valid permissions`);

  // -----------------------------
  // 4️⃣ Seed Custom Permissions
  // -----------------------------

  const customPermissionsData = [
    // Financial
    {
      code: "VIEW_FINANCIAL_REPORTS",
      name: "View Financial Reports",
      category: "FINANCIAL",
      riskLevel: "LOW",
    },
    {
      code: "PROCESS_BULK_PAYMENTS",
      name: "Process Bulk Payments",
      category: "FINANCIAL",
      riskLevel: "HIGH",
      requiresApproval: true,
    },
    {
      code: "OVERRIDE_PRICING",
      name: "Override Pricing",
      category: "FINANCIAL",
      riskLevel: "HIGH",
      requiresApproval: true,
    },
    {
      code: "VIEW_COST_PRICES",
      name: "View Cost Prices",
      category: "FINANCIAL",
      riskLevel: "MEDIUM",
    },
    {
      code: "ACCESS_PROFIT_MARGINS",
      name: "Access Profit Margins",
      category: "FINANCIAL",
      riskLevel: "MEDIUM",
    },

    // Administrative
    {
      code: "MANAGE_ORGANIZATION_SETTINGS",
      name: "Manage Organization Settings",
      category: "ADMINISTRATIVE",
      riskLevel: "HIGH",
    },
    {
      code: "INVITE_USERS",
      name: "Invite Users",
      category: "ADMINISTRATIVE",
      riskLevel: "LOW",
    },
    {
      code: "MANAGE_BILLING",
      name: "Manage Billing",
      category: "ADMINISTRATIVE",
      riskLevel: "HIGH",
    },
    {
      code: "EXPORT_ALL_DATA",
      name: "Export All Data",
      category: "ADMINISTRATIVE",
      riskLevel: "CRITICAL",
      requiresApproval: true,
    },
    {
      code: "ACCESS_AUDIT_LOGS",
      name: "Access Audit Logs",
      category: "ADMINISTRATIVE",
      riskLevel: "HIGH",
    },

    // Operational
    {
      code: "OVERRIDE_INVENTORY",
      name: "Override Inventory",
      category: "OPERATIONAL",
      riskLevel: "HIGH",
      requiresApproval: true,
    },
    {
      code: "BYPASS_APPROVAL_WORKFLOWS",
      name: "Bypass Approval Workflows",
      category: "OPERATIONAL",
      riskLevel: "CRITICAL",
      requiresApproval: true,
    },
    {
      code: "MANAGE_INTEGRATIONS",
      name: "Manage Integrations",
      category: "OPERATIONAL",
      riskLevel: "MEDIUM",
    },
    {
      code: "SCHEDULE_BATCH_OPERATIONS",
      name: "Schedule Batch Operations",
      category: "OPERATIONAL",
      riskLevel: "MEDIUM",
    },
    {
      code: "ACCESS_ADMIN_DASHBOARD",
      name: "Access Admin Dashboard",
      category: "OPERATIONAL",
      riskLevel: "LOW",
    },

    // Data
    {
      code: "VIEW_SENSITIVE_DATA",
      name: "View Sensitive Data",
      category: "DATA",
      riskLevel: "CRITICAL",
      requiresApproval: true,
    },
    {
      code: "ACCESS_ALL_RECORDS",
      name: "Access All Records",
      category: "DATA",
      riskLevel: "CRITICAL",
      requiresApproval: true,
    },
    {
      code: "OVERRIDE_DATA_RETENTION",
      name: "Override Data Retention",
      category: "DATA",
      riskLevel: "HIGH",
      requiresApproval: true,
    },
  ];

  await prisma.customPermission.createMany({
    data: customPermissionsData.map((perm) => ({
      ...perm,
      code: (ActionName as any)[perm.code] ?? perm.code, // or use SystemCustomPermission[perm.code] if imported
      description: `${perm.name} (${perm.category})`,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${customPermissionsData.length} custom permissions`);
  console.log("🌳 Permission seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
