import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "institution-types",
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
  { title: "t-description" },
  { title: "t-status" },
  { title: "t-action" },
];
