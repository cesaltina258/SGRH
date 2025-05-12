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
  { title: "status" },
  { title: "blocked?" },
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
    icon: "ph-arrows-clockwise",
    value: "change",
  },
  {
    title: "enable",
    icon: "ph-lock-open", // ícone que representa bloqueio/segurança
    value: "enable",
  },
];


