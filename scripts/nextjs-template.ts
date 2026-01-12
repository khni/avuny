#!/usr/bin/env tsx

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const templateDir = path.resolve(__dirname, "../templates/nextjs-app");

const run = async () => {
  const appName = process.argv[2];
  if (!appName) {
    console.error("❌ app name is required. Usage: pnpm create-app my-new-pkg");
    process.exit(1);
  }

  const targetDir = path.resolve(__dirname, "../apps", appName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ app "${appName}" already exists.`);
    process.exit(1);
  }

  await fs.copy(templateDir, targetDir);

  const pkgJsonPath = path.join(targetDir, "package.json");
  const pkgJson = await fs.readJSON(pkgJsonPath);
  pkgJson.name = `@workspace/${appName}`;
  await fs.writeJSON(pkgJsonPath, pkgJson, { spaces: 2 });

  console.log(`✅ Created app "${appName}" at ${targetDir}`);
};

run();
