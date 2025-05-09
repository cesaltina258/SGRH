import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";
import { OptionType } from "@/components/users/types";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "users",
    disabled: false,
  },
  {
    title: "list-view",
    disabled: true,
  },
];

export const listViewHeader: TableHeaderType[] = [
  { title: "", isCheck: true },
  { title: "full-name" },
  { title: "email" },
  { title: "username" },
  { title: "status" },
  { title: "action" },
];

export const Options: OptionType[] = [
  {
    title: "view",
    icon: "ph-eye",
    value: "view",
  },
  {
    title: "edit",
    icon: "ph-pencil",
    value: "edit",
  },
  {
    title: "delete",
    icon: "ph-trash",
    value: "delete",
  },
  {
    title: "change",
    icon: "ph-arrows-clockwise", // este é o mais próximo da imagem
    value: "change",
  },
];

