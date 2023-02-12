<script lang="ts" setup>
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  prefix: {
    type: String,
    default: "h-icon",
  },
  name: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "inherit",
  },
});
const symbolId = computed(() => (props.id ? `#${props.id}` : `#${props.prefix}-${props.name}`));
</script>

<template>
  <svg aria-hidden="true" class="h-4 w-4 outline-none" :style="{ color }">
    <use :href="symbolId" />
  </svg>
</template>
