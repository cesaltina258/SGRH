import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { DataTableHeaderType } from "@/app/common/types/table.types";
import { ke } from "@/assets/images/flags/utils";

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

export const employeeHeader: DataTableHeaderType[] = [
  // A coluna de seleção será adicionada automaticamente quando showSelect=true
  { title: "employee-number", key: "employeeNumber", sortable: true },
  { title: "employee-name", key: "firstName", sortable: true },
  { title: "phone-number", key: "phone", sortable: true },
  { title: "email", key: "email", sortable: true },
  { title: "action", sortable: false },
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
