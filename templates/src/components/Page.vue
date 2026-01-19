<script setup lang="ts">
import { useTina } from "../composables/useTina";
import BlocksRenderer from "./BlocksRenderer.vue";

const props = defineProps<{
  data: any;
  query: string;
  variables: any;
}>();

// Nutze den useTina Composable für Visual Editing
const { data } = useTina({
  query: props.query,
  variables: props.variables,
  data: props.data,
  contentType: "page",
});
</script>

<template>
  <div class="page-wrapper">
    <h1 class="page-title">{{ data.title }}</h1>
    <BlocksRenderer v-if="data.blocks" :blocks="data.blocks" />
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
}

.page-title {
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 0;
}
</style>
