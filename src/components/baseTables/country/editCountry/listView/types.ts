export type ProvinceInsertType = {
  id: number;
  name: string;
  code: string;
};

export type ProvinceListingType = {
  id: number;
  name: string;
  code: string;
};

export type ProvinceUpdateType = {
  name?: string;
  code?: string;
};

export type OptionType = {
  title: string;
  value: string;
  icon?: string;
  to?: string;
};

export type ProvinceOption = {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: 'asc' | 'desc' }[];
  search: string;
}

