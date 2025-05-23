import { MenuSelectItemType } from "@/app/common/components/filters/types";
import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { TableHeaderType } from "@/app/common/types/table.types";
import { OptionType } from "@/app/common/types/option.type";
import { ContactType, HistoryType } from "@/components/institution/create/types";
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
    value: null, 
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
    value: null, 
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

export const productHeader: TableHeaderType[] = [
  { title: "#" },
  { title: "Product Details" },
  { title: "Rate ($)" },
  { title: "Quantity" },
  { title: "Amount" },
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

export const customers: ContactType[] = [
  {
    id: "1",
    name: "Javon Pouros",
    email: "rashawn@steex.com",
    phone: "+(253) 12345 67890",
    create_date: "28 Feb, 2023",
    status: "unActive",
  },
  {
    id: "2",
    name: "Willy Gulgowski",
    email: "gulgowski@steex.com",
    phone: "+(152) 32165 49873",
    create_date: "20 Feb, 2023",
    status: "block",
  },
  {
    id: "3",
    name: "Verona Mosciski",
    email: "vmosciski@steex.com",
    phone: "+(231) 14562 32165",
    create_date: "16 Feb, 2023",
    status: "active",
  },
  {
    id: "4",
    name: "Vinnie Huels",
    email: "vinnie@steex.com",
    phone: "+(44) 98765 32104",
    create_date: "23 Jan, 2023",
    status: "active",
  }
];


export const contactHeader: TableHeaderType[] = [
  //{ title: "id" },
  { title: "name" },
  { title: "email" },
  { title: "phone-number" },
  { title: "created-date" },
  { title: "status" },
  { title: "action" },
];



export const interactions: HistoryType[] = [
  {
    id: "1",
    name: "Javon Pouros",
    email: "rashawn@steex.com",
    create_date: "28 Feb, 2023",
    status: "unActive",
  },
  {
    id: "2",
    name: "Willy Gulgowski",
    email: "gulgowski@steex.com",
    create_date: "20 Feb, 2023",
    status: "block",
  },
  {
    id: "3",
    name: "Verona Mosciski",
    email: "vmosciski@steex.com",
    create_date: "16 Feb, 2023",
    status: "active",
  },
  {
    id: "4",
    name: "Vinnie Huels",
    email: "vinnie@steex.com",
    create_date: "23 Jan, 2023",
    status: "active",
  }
];


export const historyHeader: TableHeaderType[] = [
  //{ title: "id" },
  { title: "interaction" },
  { title: "interaction-type" },
  { title: "date" },
  { title: "document-type" },
  { title: "action" },
];


