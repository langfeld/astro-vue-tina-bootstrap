#!/usr/bin/env tsx
import fs from "fs";
import path from "path";
import { cpSync, existsSync, mkdirSync } from "fs";

// ====== Konfiguration ======
const TEMPLATES_DIR = path.resolve(__dirname, "../templates");
const PATCHES_DIR = path.resolve(__dirname, "../patches");
const TARGET_ROOT = process.cwd();
const CHECK_ONLY = process.argv.includes("--check");
const DRY_RUN = process.argv.includes("--dry-run");

// ====== Hilfsfunktionen ======
function copyTemplates(src: string, dest: string) {
  if (!existsSync(src)) return;
  cpSync(src, dest, {
    recursive: true,
    filter: (file) => {
      const rel = path.relative(src, file);
      return !existsSync(path.join(dest, rel));
    },
  });
}

// ====== Templates kopieren ======
if (!CHECK_ONLY) {
  console.log("📁 Templates kopieren...");
  copyTemplates(TEMPLATES_DIR, TARGET_ROOT);
  console.log("✅ Templates kopiert");
} else {
  console.log("🔎 Check-Modus: Templates werden nur geprüft");
}

// ====== Patches anwenden ======
if (!fs.existsSync(PATCHES_DIR)) {
  console.log("ℹ️  Keine Patches gefunden");
  process.exit(0);
}

// Patch-Logik: für jede Datei in patches/
const patchFiles = fs.readdirSync(PATCHES_DIR).filter(f => f.endsWith(".ts"));

for (const patchFile of patchFiles) {
  const patchPath = path.join(PATCHES_DIR, patchFile);
  const patchContent = fs.readFileSync(patchPath, "utf8").trim();

  // Marker ableiten: z.B. tina.collections.ts -> collections
  const parts = patchFile.split(".");
  const markerName = parts.length >= 2 ? parts[1] : parts[0];
  const START = `// BOOTSTRAP:${markerName}:start`;
  const END = `// BOOTSTRAP:${markerName}:end`;

  // Zieldatei: standardmäßig tina/config.ts
  const targetFile = path.resolve(TARGET_ROOT, "tina/config.ts");
  if (!existsSync(targetFile)) {
    console.error(`❌ Ziel-Datei ${targetFile} nicht gefunden für Patch ${patchFile}`);
    continue;
  }

  let content = fs.readFileSync(targetFile, "utf8");

  if (!content.includes(START) || !content.includes(END)) {
    console.error(`❌ Marker ${START}/${END} in tina/config.ts fehlt (Patch: ${patchFile})`);
    continue;
  }

  if (content.includes(patchContent)) {
    console.log(`ℹ️  Patch ${patchFile} bereits eingebunden`);
    continue;
  }

  if (DRY_RUN) {
    console.log(`💡 Dry-run: Patch ${patchFile} würde eingefügt`);
    continue;
  }

  if (!CHECK_ONLY) {
    content = content.replace(
      new RegExp(`${START}[\\s\\S]*?${END}`),
      `${START}\n${patchContent}\n  ${END}`
    );
    fs.writeFileSync(targetFile, content);
    console.log(`✅ Patch ${patchFile} angewendet`);
  }
}

console.log("🎯 Alle Patches verarbeitet");