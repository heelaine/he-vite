import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

import { FileSystemIconLoader } from "unplugin-icons/loaders";
import { ElementPlusResolver, VueUseComponentsResolver } from "unplugin-vue-components/resolvers";

import Pages from "vite-plugin-pages";

// import Unocss from "unocss/vite";

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default () => {
  return [
    vue(),
    vueJsx(),
    Pages({
      importMode: "async",
      extensions: ["vue", "tsx"],
      exclude: ["**/components/*.vue"],
    }),
		AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue-i18n",
        "vue/macros",
				"pinia",
				{ "@vueuse/router": ["useRouteParams", "useRouteHash", "useRouteQuery"] },
        { "vue-request": ["useRequest", "useLoadMore", "usePagination"] },
      ],
      dts: "types/auto-imports.d.ts",
      dirs: [
        "src/composables",
        "src/store",
      ],
      vueTemplate: true,
			resolvers: [ElementPlusResolver(), IconsResolver({ prefix: "Icon", customCollections: ["custom"] })],
    }),
    Components({
			dts: "types/components.d.ts",
      extensions: ["vue", "tsx"],
      include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
      // imports 指定组件所在位置，默认为 src/components; 有需要也可以加上 view 目录
      resolvers: [
        IconsResolver(),
        ElementPlusResolver({ importStyle: "sass" }),
        VueUseComponentsResolver(),
      ],
    }),
		// https://github.com/antfu/unplugin-vue-components
    Icons({
      compiler: "vue3",
      autoInstall: true,
      customCollections: {
        custom: FileSystemIconLoader("src/assets/svg", svg => svg.replace(/^<svg /, "<svg fill=\"currentColor\" ")),
      },
    }),
		VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [resolve(__dirname, "src/locales/**")],
    }),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), "src/assets/svg")],
      symbolId: "h-icon-[name]",
      inject: "body-last",
    }),
  ];
};
