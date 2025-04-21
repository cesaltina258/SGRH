import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "currency",
    disabled: false,
  },
  {
    title: "list-view",
    disabled: true,
  },
];

export const listViewHeader: TableHeaderType[] = [
  { title: "", isCheck: true },
  { title: "t-name" },
  { title: "t-symbol" },
  { title: "t-status-modal" },
  { title: "t-action" },
];
