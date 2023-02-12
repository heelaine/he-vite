import { registerDialog, usePopContainer } from "./pop";

import TheTemplateDialogVue from "~/components/modal/TheTemplateDialog.vue";
export const [modals, popper] = usePopContainer();
const dialogCombine = registerDialog(popper, popper.componentsCache);

// 保留配置项 后面如果所有弹窗有公共的内容（需要默认的部分）可以抽离到这里
// const DEFAULT_PARAMS = {};

// 创建模版弹窗
export const CREATE_TEMPLATE_DIALOG_ID = "CREATE_TEMPLATE_DIALOG";
export const useTemplateDialog = (params = {}) => {
  return dialogCombine(CREATE_TEMPLATE_DIALOG_ID, TheTemplateDialogVue, params);
};
