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

export const employeeOverview = [
  {
    title: "total-employees",
    endVal: 8956,
    color: "primary",
    percent: "12.09%",
    isProgress: true,
    icon: "ph-buildings",
  },
  {
    title: "total-active-employees",
    endVal: 4519,
    color: "success",
    percent: "6.57%",
    isProgress: true,
    icon: "ph-check",
  },
  {
    title: "total-inactive-employees",
    endVal: 2648,
    color: "danger",
    percent: "4.07%",
    isProgress: true,
    icon: "ph-x-circle",
  },
  {
    title: "new-employees-registed",
    endVal: 871,
    color: "primary",
    percent: "3.49%",
    isProgress: false,
    icon: "ph-clock",
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
