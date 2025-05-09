import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "countries",
    disabled: false,
  },
  {
    title: "view-list-country",
    disabled: true,
  },
  
  
];

export const listViewHeader: TableHeaderType[] = [
  { title: "", isCheck: true },
  { title: "country-name" },
  { title: "country-code" },
  { title: "iso2Code" },
  { title: "iso3Code" },
  { title: "phone-code" },
  { title: "currency" },
  { title: "currency-symbol" },
  { title: "currency-code" },
  { title: "action" },
];
