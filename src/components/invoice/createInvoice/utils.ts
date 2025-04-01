import { MenuSelectItemType } from "@/app/common/components/filters/types";
import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "invoices",
    disabled: false,
  },
  {
    title: "create-invoice",
    disabled: true,
  },
];

export const statusOptions: MenuSelectItemType[] = [
  { value: "", label: "Select status" },
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "Refund", label: "Refund" },
  { value: "UnPaid", label: "UnPaid" },
];

export const productHeader: TableHeaderType[] = [
  { title: "#" },
  { title: "Product Details" },
  { title: "Rate ($)" },
  { title: "Quantity" },
  { title: "Amount" },
];
