import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "countries",
    disabled: false,
  },
  {
    title: "view-list-country",
    disabled: false,
  },
  
];

export const listViewHeader: TableHeaderType[] = [
  { title: "", isCheck: true },
  { title: "province-name" },
  { title: "province-code" },
  { title: "action" },
];
