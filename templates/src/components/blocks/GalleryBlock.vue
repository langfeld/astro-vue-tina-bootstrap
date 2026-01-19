<script setup lang="ts">
import { tinaField } from "../../composables/tinaField";

defineProps<{
  block: {
    heading?: string;
    images?: Array<{
      image?: string;
      alt?: string;
    }>;
  };
}>();
</script>

<template>
  <section class="gallery-block">
    <h2
      v-if="block.heading"
      :data-tina-field="tinaField(block, 'heading')"
    >
      {{ block.heading }}
    </h2>
    <div v-if="block.images" class="gallery-grid">
      <div
        v-for="(item, index) in block.images"
        :key="index"
        class="gallery-item"
        :data-tina-field="tinaField(block, 'images', index)"
      >
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.alt || `Gallery image ${index + 1}`"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery-block {
  padding: 3rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-block h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.gallery-item img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.gallery-item img:hover {
  transform: scale(1.05);
}
</style>
