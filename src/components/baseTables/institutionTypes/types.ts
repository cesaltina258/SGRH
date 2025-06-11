export type InstitutionTypeInsert = {
  id: string;
  name: string;
  description: string;
};

export type InstitutionTypeListing = {
  id: string;
  name: string;
  description: string;
};

export type InstitutionTypeUpdate = {
  name: string;
  description: string;
};

export type InstitutionTypeResponse = {
  id: string;
  name: string;
  description: string;
};

export type InstitutionTypeOption = {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: 'asc' | 'desc' }[];
  search: string;
};
