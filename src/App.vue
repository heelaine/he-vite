<script setup lang="ts">
// 注册弹窗
// import { modals } from "";
import { modals } from "~/composables";
</script>

<template>
  <RouterView />
  <template v-for="(pop, popId) of modals" :key="popId">
    <Component :is="pop.component" v-bind="pop.props" v-on="pop.on" />
  </template>
</template>
