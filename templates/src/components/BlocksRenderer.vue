<script setup lang="ts">
import HeroBlock from "./blocks/HeroBlock.vue";
import GalleryBlock from "./blocks/GalleryBlock.vue";
import RichtextBlock from "./blocks/RichtextBlock.vue";

type AnyBlock = { __typename?: string } & Record<string, any>;

defineProps<{
  blocks?: AnyBlock[]
}>();

function resolveBlock(block: AnyBlock) {
  const typename = (block.__typename || "").toLowerCase();

  // Tina generiert typischerweise Namen wie `PageBlocksHero`, `PageBlocksGallery`, etc.
  if (typename.includes("hero")) return HeroBlock;
  if (typename.includes("gallery")) return GalleryBlock;
  if (typename.includes("richtext")) return RichtextBlock;

  // Fallback
  return RichtextBlock;
}
</script>

<template>
  <div v-if="blocks && blocks.length > 0" class="blocks-renderer">
    <component
      v-for="(block, index) in blocks"
      :key="index"
      :is="resolveBlock(block)"
      :block="block as any"
    />
  </div>
</template>

<style scoped>
.blocks-renderer {
  display: flex;
  flex-direction: column;
}
</style>
