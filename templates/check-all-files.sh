#!/bin/bash

files=(
  "src/composables/useTina.ts"
  "src/composables/tinaField.ts"
  "src/components/Page.vue"
  "src/components/BlocksRenderer.vue"
  "src/components/blocks/HeroBlock.vue"
  "src/components/blocks/GalleryBlock.vue"
  "src/components/blocks/RichtextBlock.vue"
  "src/pages/home.astro"
  "content/pages/home.mdx"
  "src/env.d.ts"
  "tina/config.ts"
)

missing_files=()

echo "Prüfe Dateien auf Existenz..."

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ $file existiert"
  else
    echo "✗ $file fehlt"
    missing_files+=("$file")
  fi
done

echo
if [ ${#missing_files[@]} -eq 0 ]; then
  echo "Alle Dateien sind vorhanden!"
else
  echo "Fehlende Dateien (${#missing_files[@]}):"
  for file in "${missing_files[@]}"; do
    echo "  - $file"
  done
  exit 1
fi

