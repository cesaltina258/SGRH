export type CountryInsertType = {
  id: string;
  name: string;
  code: string;
  iso2Code: string;
  iso3Code: string;
  phoneCode: string;
  currency: string;
  currencySymbol: string;
  currencyCode: string;
};

export type CountryListingType = {
  id: string ;
  name: string;
  code: string;
  iso2Code: string;
  iso3Code: string;
  phoneCode: string;
  currency: string;
  currencySymbol: string;
  currencyCode: string;
};

export type CountryUpdateType = {
  name?: string;
  code?: string;
  iso2Code?: string;
  iso3Code?: string;
  phoneCode?: string;
  currency?: string;
  currencySymbol?: string;
  currencyCode?: string;
};

export type ProvinceInsertType = {
  id: string;
  name: string;
  code: string;
};

export type ProvinceListingType = {
  id: string;
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

export type CountryOption = {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: 'asc' | 'desc' }[];
  search: string;
};

export type TableHeaderType = {
  title: string;
  align?: string;
  isCheck?: boolean;
  key?: string;
  sortable?: boolean;
  value?: string;
};

export type CountryResponseType = { 
  id: string;
  name: string;
  code: string;
  iso2Code: string;
  iso3Code: string;
  phoneCode: string;
  currency: string;
  currencySymbol: string;
  currencyCode: string;
};

export type ProvinceResponseType = {
  id: string;
  name: string;
  code: string;
};