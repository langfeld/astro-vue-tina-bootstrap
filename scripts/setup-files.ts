import fs from "fs";
import path from "path";

const target = path.resolve("tina/config.ts");
const patchPath = path.resolve(__dirname, "../templates/tina/collections.patch.ts");

const START = "// BOOTSTRAP:collections:start";
const END = "// BOOTSTRAP:collections:end";

if (!fs.existsSync(target)) {
  console.error("❌ tina/config.ts nicht gefunden");
  process.exit(1);
}

const config = fs.readFileSync(target, "utf8");

if (!config.includes(START) || !config.includes(END)) {
  console.error("❌ Bootstrap-Marker fehlen in tina/config.ts");
  console.error("👉 Bitte Marker manuell einfügen:");
  console.error(`   ${START}`);
  console.error(`   ${END}`);
  process.exit(1);
}

const patch = fs.readFileSync(patchPath, "utf8");

if (config.includes(patch.trim())) {
  console.log("ℹ️  Tina-Collections bereits eingebunden");
  process.exit(0);
}

const updated = config.replace(
  new RegExp(`${START}[\\s\\S]*?${END}`),
  `${START}\n${patch}\n  ${END}`
);

fs.writeFileSync(target, updated);
console.log("✅ Tina-Collections ergänzt");