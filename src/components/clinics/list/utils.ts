import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { DataTableHeaderType } from "@/app/common/types/table.types";
import { ke } from "@/assets/images/flags/utils";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "clinics",
    disabled: false,
  },
  {
    title: "clinics-list-view",
    disabled: true,
  },
];

export const clinicsHeader: DataTableHeaderType[] = [
  { title: "name", key: "name", sortable: true },
  // { title: "description", key: "description", sortable: true },
  { title: "address", key: "address", sortable: true },
  { title: "phone", key: "phone", sortable: true },
  { title: "email", key: "email", sortable: true },
  { title: "website", key: "website", sortable: true },
  // { title: "income-tax-number", key: "incomeTaxNumber", sortable: true },
  // { title: "contact-fullname-1", key: "personOfContactFullname1", sortable: true },
  // { title: "contact-phone-1", key: "personOfContactPhone1", sortable: true },
  // { title: "contact-email-1", key: "personOfContactEmail1", sortable: true },
  // { title: "contact-fullname-2", key: "personOfContactFullname2", sortable: true },
  // { title: "contact-phone-2", key: "personOfContactPhone2", sortable: true },
  // { title: "contact-email-2", key: "personOfContactEmail2", sortable: true },
  { title: "action", sortable: false },
];



