<script lang="ts" setup>
const props = defineProps({
  title: {
    type: [String, Number],
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: Boolean,
    default: true,
  },
  showFullscreen: {
    type: Boolean,
    default: false,
  },
  footer: {
    type: Boolean,
    default: true,
  },
  header: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["update:modelValue"]);
const updateVisible = useVModel(props, "modelValue", emits);

const [isVisible, toggleVisible] = useToggle(true);
const [isFullscreen, toggleFullscreen] = useToggle(false);

watch(isVisible, () => {
  if (isVisible.value) {
    toggleFullscreen(false);
  }
});

const open = () => {
  toggleVisible(true);
};

const close = () => {
  toggleVisible(false);
  updateVisible.value = false;
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      close();
    }
  },
);

defineExpose({ open, close });
</script>

<template>
  <div ref="h-dialog" class="h-dialog">
    <ElDialog
      ref="dialog"
      v-model="isVisible"
      :fullscreen="isFullscreen"
      :show-close="false"
      :append-to-body="true"
      v-bind="$attrs"
      class="h-dialog__inner"
      :style="{ '--show-header': header ? 'block' : 'none' }"
      @close="close"
    >
      <template v-if="header" #header>
        <slot name="header">
          <span class="ep-dialog__title">{{ title }}</span>
        </slot>
        <div class="h-dialog__header_btn">
          <button v-if="showFullscreen" aria-label="fullscreen" type="button">
            <ElTooltip :content="isFullscreen ? '退出全屏' : '全屏'">
              <ElIcon v-if="isFullscreen" class="ep-dialog__close" @click="toggleFullscreen(false)">
                <ElIconBottomLeft />
              </ElIcon>
              <ElIcon v-else class="ep-dialog__close" @click="toggleFullscreen(true)">
                <ElIconFullScreen />
              </ElIcon>
            </ElTooltip>
          </button>
          <button v-if="showClose" aria-label="close" type="button" @click="close">
            <ElIcon class="ep-dialog__close">
              <ElIconClose />
            </ElIcon>
          </button>
        </div>
      </template>
      <div v-loading="loading">
        <slot />
      </div>
      <template v-if="footer" #footer>
        <slot name="footer" />
      </template>
    </ElDialog>
  </div>
</template>

<style lang="scss">
.h-dialog__header_btn {
  position: absolute;
  top: var(--ep-dialog-padding-primary);
  right: var(--ep-dialog-padding-primary);
}
.h-dialog__header_btn button {
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: var(--ep-message-close-size, 16px);
  margin-left: 15px;
  margin-right: 4px;
  color: var(--ep-color-info);
}
.h-dialog__header_btn button:hover .ep-dialog__close {
  color: var(--ep-color-primary);
}
.h-dialog:deep(.ep-dialog).is-fullscreen {
  display: flex;
  flex-direction: column;
  top: 0px !important;
  left: 0px !important;
}

.h-dialog:deep(.ep-dialog).is-fullscreen .ep-dialog__body {
  flex: 1;
  overflow: auto;
}
.h-dialog__inner {
  display: flex;
  flex-direction: column;
  .ep-dialog__title {
    font-size: 16px;
    color: var(--ep-text-color-primary);
  }
  .ep-dialog__header {
    display: var(--show-header);
    height: 56px;
    padding-top: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--ep-border-color-light);
    margin: 0px;
  }
  .ep-dialog__body {
    padding: 12px 16px;
    flex: 1;
  }
  .ep-dialog__footer {
    height: 56px;
    border-top: 1px solid var(--ep-border-color-light);
    padding: 12px 24px;
  }
}
</style>
