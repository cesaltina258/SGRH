import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { DataTableHeaderType } from "@/app/common/types/table.types";

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

export const userHeader: DataTableHeaderType[] = [
  { title: "full-name", key: "firstName", sortable: true, align: "right" },
  { title: "email", key: "email" , sortable: true },
  { title: "status" , sortable: false },
  { title: "action",  sortable: false  },
];
