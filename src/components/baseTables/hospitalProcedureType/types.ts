export type HospitalProcedureTypeInsert = {
  id: string;
  name: string;
  description: string;
};

export type HospitalProcedureTypeListing = {
  id: string;
  name: string;
  description: string;
};

export type HospitalProcedureTypeUpdate = {
  name?: string;
  description?: string;
};

export type HospitalProcedureTypeResponse = {
  id: string;
  name: string;
  description: string;
};

export type HospitalProcedureTypeOption = {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: 'asc' | 'desc' }[];
  search: string;
};