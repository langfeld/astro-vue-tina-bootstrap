<script setup lang="ts">
import { tinaField } from "../../composables/tinaField";

defineProps<{
  block: {
    heading?: string;
    content?: string;
  };
}>();
</script>

<template>
  <section class="richtext-block">
    <h2
      v-if="block.heading"
      :data-tina-field="tinaField(block, 'heading')"
    >
      {{ block.heading }}
    </h2>
    <div
      v-if="block.content"
      class="richtext-content"
      :data-tina-field="tinaField(block, 'content')"
      v-html="block.content"
    />
  </section>
</template>

<style scoped>
.richtext-block {
  padding: 3rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.richtext-block h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.richtext-content {
  font-size: 1.125rem;
  line-height: 1.75;
  color: #333;
}

.richtext-content :deep(p) {
  margin-bottom: 1rem;
}

.richtext-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.richtext-content :deep(ul),
.richtext-content :deep(ol) {
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.richtext-content :deep(a) {
  color: #0066cc;
  text-decoration: underline;
}
</style>
