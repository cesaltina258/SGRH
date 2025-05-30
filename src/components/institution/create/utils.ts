import { MenuSelectItemType } from "@/app/common/components/filters/types";
import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";
import { OptionType } from "@/app/common/types/option.type";
import { DataTableHeaderType } from "@/app/common/types/table.types";
export const breadcrumb: BreadcrumbType[] = [
  {
    title: "institution-list",
    disabled: false,
  },
  {
    title: "add-institution",
    disabled: true,
  },
];

export const healthPlanLimitOptions: MenuSelectItemType[] = [
  { 
    value: undefined, 
    label: "Selecione o Limite do Plano" },
  {
    label: "Valor Fixo",
    value: "FIXED_AMOUNT"
  },
  {
    label: "Salário Anual",
    value: "ANUAL_SALARY"
  }
];

export const salaryComponentOptions: MenuSelectItemType[] = [
  { 
    value: undefined, 
    label: "Selecione a Componente Salarial" },
  {
    label: "Salário Base",
    value: "BASE_SALARY"
  },
  {
    label: "Salário Bruto",
    value: "GROSS_SALARY"
  },
  {
    label: "Salário Líquido",
    value: "NET_SALARY"
  }
];


export const statusOptions: MenuSelectItemType[] = [
  { value: "", label: "Select status" },
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "Refund", label: "Refund" },
  { value: "UnPaid", label: "UnPaid" },
];

export const contactPersonHeader: DataTableHeaderType[] = [
  { title: "full-name", key: "fullname", sortable: true},
  { title: "email", key: "email" , sortable: true },
  { title: "phone", key: "phone" , sortable: true },
  { title: "action",  sortable: false,  align: "right"}
];

export const departmentHeader: DataTableHeaderType[] = [
  { title: "name", key: "name", sortable: true},
  { title: "description", key: "description" , sortable: true },
  { title: "action",  sortable: false,  align: "right"}
];

export const positionHeader: DataTableHeaderType[] = [
  { title: "name", key: "name", sortable: true},
  { title: "description", key: "description" , sortable: true },
  { title: "action",  sortable: false,  align: "right"}
];




export const contactOptions: OptionType[] = [
  {
    title: "view",
    icon: "ph-eye",
    value: "view",
  },
  {
    title: "edit",
    icon: "ph-pencil",
    value: "edit",
  },
  {
    title: "delete",
    icon: "ph-trash",
    value: "delete",
  },
];

export const statusContactOptions: MenuSelectItemType[] = [
  { value: "", label: "All Select" },
  { value: "active", label: "Active" },
  { value: "block", label: "Block" },
  { value: "unActive", label: "UnActive" },
];


export const filters = {
  query: "",
  status: "",
  date: "",
};

export const contactHeader: TableHeaderType[] = [
  //{ title: "id" },
  { title: "name" },
  { title: "email" },
  { title: "phone-number" },
  { title: "created-date" },
  { title: "status" },
  { title: "action" },
];

export const historyHeader: TableHeaderType[] = [
  //{ title: "id" },
  { title: "interaction" },
  { title: "interaction-type" },
  { title: "date" },
  { title: "document-type" },
  { title: "action" },
];


