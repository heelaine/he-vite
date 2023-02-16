import { resolve } from "path";
import { defineConfig } from "vite";
// 插件具体配置
import presets from "./presets/presets";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/he-vite/",
  // 服务设置
  server: {
    host: "localhost",
    port: 8888,
    open: true,
    https: false,
    proxy: {},
  },
  // 插件配置
  plugins: [presets()],
  // 别名设置
  resolve: {
    alias: {
      "~/": `${resolve(__dirname, "src")}/`,
    },
  },
  // 预编译
  optimizeDeps: {
    include: [
      "vue",
      "element-plus/es",
      "@vueuse/core",
      "@vueuse/router",
      "pinia",
      "@element-plus/icons-vue",
    ],
  },
  // css预处理器
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `
  //     @import "~/styles/variables.scss";
  //   `,
  //       javascriptEnabled: true,
  //     },
  //   },
  // },
  // https://github.com/vitest-dev/vitest
  test: {
    environment: "jsdom",
  },
});
