# Astro-Vue-Tina Bootstrap

Kopiert Basisdateien in ein neues Projekt. Dies umfasst Vue-Blöcke und Tina CMS-Konfiguration, die speziell für ein Astro-Vue-Projekt optimiert sind.

## Nutzung

```bash
# TSX installieren (wenn noch nicht vorhanden)
npm install -D tsx

# Bootstrapper ins Zielprojekt holen
npx degit USERNAME/astro-vue-tina-bootstrap bootstrap

# Jetzt die Marker in der config.ts von Tina setzen
# BOOTSTRAP:collections:start  und  BOOTSTRAP:collections:end

# Script ausführen
npx tsx bootstrap/scripts/setup-files.ts

# Optional: --check oder --dry-run
npx tsx bootstrap/scripts/setup-files.ts --check
npx tsx bootstrap/scripts/setup-files.ts --dry-run

# Bootstrap-Ordner aufräumen
rm -rf bootstrap

```

## Marker setzen

Die Marker entsprechen dem Namen der Patch-Datei (z.B. `collections` für `collections.patch.ts`).

```typescript
// tina/config.ts

export default defineConfig({
  schema: {
    collections: [
      // BOOTSTRAP:collections:start
      // BOOTSTRAP:collections:end
    ]
  }
});
```