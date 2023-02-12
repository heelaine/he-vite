import { useTemplateDialog } from "~/composables";

export const useTemplate = () => {
  const params = {
    title: "模版弹窗",
    width: 500,
    alignCenter: true,

  };

  const dialog = useTemplateDialog(params);
  dialog.open();
};
