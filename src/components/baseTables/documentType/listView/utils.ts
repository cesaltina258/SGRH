import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "document-types",
    disabled: false,
  },
  {
    title: "list-view",
    disabled: true,
  },
];

export const listViewHeader: TableHeaderType[] = [
  { title: "", isCheck: true },
  { title: "#" },
  { title: "Nome" },
  { title: "Descrição" },
  { title: "Acção" },
];
