# Astro-Vue-Tina Bootstrap

Kopiert Basisdateien in ein neues Projekt. Dies umfasst Vue-Blöcke und Tina CMS-Konfiguration, die speziell für ein Astro-Vue-Projekt optimiert sind.

## Nutzung

```bash
# Bootstrapper ins Zielprojekt holen
npx degit USERNAME/astro-vue-tina-bootstrap bootstrap

# Script ausführen
npx tsx bootstrap/scripts/setup-files.ts

# Optional: --check oder --dry-run
npx tsx bootstrap/scripts/setup-files.ts --check
npx tsx bootstrap/scripts/setup-files.ts --dry-run

# Bootstrap-Ordner aufräumen
rm -rf bootstrap

```
