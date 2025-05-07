import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "employees",
    disabled: false,
  },
  {
    title: "list-view",
    disabled: true,
  },
];

export const employeeHeader: TableHeaderType[] = [
  { title: "", isCheck: true },
  { title: "employee-number" },
  { title: "employee-name" },
  { title: "phone-number" },
  { title: "email" },
  { title: "action" },
];

export const invoicesList = [
  {
    id: 1,
    invoice_no: "24301901",
    logo_img: "assets/images/logo-light.png",
    customer: "Themesbrand",
    email: "themesbrand@steex.com",
  }
 
];
