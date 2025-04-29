import { MenuSelectItemType } from "@/app/common/components/filters/types";
import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
export const breadcrumb: BreadcrumbType[] = [
  {
    title: "employee-list",
    disabled: false,
  },
  {
    title: "add-employee",
    disabled: true,
  },
];

export const genderOptions: MenuSelectItemType[] = [
  { value: "", label: "Selecione o Sexo" },
  {
    label: "Feminino",
    value: "F"
  },
  {
    label: "Masculino",
    value: "M"
  },
];

export const maritalStatusOptions: MenuSelectItemType[] = [
  { value: "", label: "Selecione o Estado Cívil" },
  {
    label: "Solteiro",
    value: "S"
  },
  {
    label: "Casado",
    value: "C"
  },
  {
    label: "Divorciado",
    value: "D"
  },
  {
    label: "Viúvo",
    value: "V"
  },
  {
    label: "União de facto",
    value: "U"
  }
];

  export const bloodGroupOptions: MenuSelectItemType[] = [
  { value: "", label: "Selecione o Grupo Sanguíneo" },
  {
    label: "A+",
    value: "A+"
  },
  {
    label: "A-",
    value: "A-"
  },
  {
    label: "B+",
    value: "B+"
  },
  {
    label: "B-",
    value: "B-"
  },
  {
    label: "AB+",
    value: "AB+"
  },
  {
    label: "AB-",
    value: "AB-"
  },
  {
    label: "O+",
    value: "O+"
  },
  {
    label: "O-",
    value: "O-"
  }   
];

export const nationalityOptions: MenuSelectItemType[] = [
  {
    label: "Moçambicano",
    value: "1073741824"
  },
  {
    label: "Angolano",
    value: "Angola"
  },
  {
    label: "Cabo Verdiano",
    value: "Cabo Verde"
  },
  {
    label: "São Tomense",
    value: "São Tomé e Príncipe"
  }
];

export const provinceOptions: MenuSelectItemType[] = [
  {
    label: "Maputo",
    value: "Maputo"
  },
  {
    label: "Gaza",
    value: "Gaza"   
  },
  {
    label: "Inhambane",
    value: "Inhambane"
  },
  {
    label: "Sofala",
    value: "Sofala"
  },
  {
    label: "Manica",
    value: "Manica"
  },
  {
    label: "Tete",
    value: "Tete"
  },
  {
    label: "Zambézia",
    value: "Zambézia"
  },
  {
    label: "Nampula",
    value: "Nampula"
  },
  {
    label: "Niassa",
    value: "Niassa"
  },
  {
    label: "Cabo Delgado",
    value: "Cabo Delgado"
  }

];


