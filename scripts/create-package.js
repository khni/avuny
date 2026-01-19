#!/usr/bin/env tsx

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const templateDir = path.resolve(__dirname, "../templates/starter-module");

const run = async () => {
  const packageName = process.argv[2];
  if (!packageName) {
    console.error(
      "❌ Package name is required. Usage: pnpm create-package my-new-pkg",
    );
    process.exit(1);
  }

  const targetDir = path.resolve(__dirname, "../packages", packageName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Package "${packageName}" already exists.`);
    process.exit(1);
  }

  await fs.copy(templateDir, targetDir);

  const pkgJsonPath = path.join(targetDir, "package.json");
  const pkgJson = await fs.readJSON(pkgJsonPath);
  pkgJson.name = `@avuny/${packageName}`;
  await fs.writeJSON(pkgJsonPath, pkgJson, { spaces: 2 });

  console.log(`✅ Created package "${packageName}" at ${targetDir}`);
};

run();
