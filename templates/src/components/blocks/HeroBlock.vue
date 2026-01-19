<script setup lang="ts">
import { tinaField } from "../../composables/tinaField";

defineProps<{
  block: {
    heading?: string;
    subheading?: string;
    image?: string;
    alt?: string;
  };
}>();
</script>

<template>
  <section class="hero-block">
    <div v-if="block.image" class="hero-image">
      <img
        :src="block.image"
        :alt="block.alt || 'Hero image'"
        :data-tina-field="tinaField(block, 'image')"
      />
    </div>
    <div class="hero-content">
      <h1
        v-if="block.heading"
        :data-tina-field="tinaField(block, 'heading')"
      >
        {{ block.heading }}
      </h1>
      <p
        v-if="block.subheading"
        :data-tina-field="tinaField(block, 'subheading')"
      >
        {{ block.subheading }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero-block {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 3rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.hero-content {
  text-align: center;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.5rem;
  color: #666;
}
</style>
