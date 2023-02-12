<script setup lang="ts">
const router = useRouter();

const testStore = () => {
  router.push({
    name: "StoreTest",
  });
};

const svgClick = () => {
  router.push({
    name: "SvgIcon",
  });
};

const dialogOpen = () => {
  useTemplate();
};
</script>

<template>
  <div class="hero mt-[-4rem] min-h-screen text-primary-content">
    <!--  <div class="min-h-screen hero from-primary to-secondary" style="background-image: url(https://img.js.design/assets/Resources/background/home-bg-2.png);"> -->
    <div
      class="hero-overlay place-items-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
    />
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">
          He Vite
        </h1>
        <button class="btn-primary btn mr-5" @click="testStore">
          pinia使用
        </button>
        <button class="btn-primary btn mr-5" @click="svgClick">
          引入图标
        </button>
        <button class="btn-primary btn mr-5" @click="dialogOpen">
          引入弹窗
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
