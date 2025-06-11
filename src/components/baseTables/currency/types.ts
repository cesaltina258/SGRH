export type CurrencyInsertType = {
  id: string;
  name: string;
  symbol: string;
};

export type CurrencyListingType = {
  id: string;
  name: string;
  symbol: string;
};

export type CurrencyUpdateType = {
  name?: string;
  symbol?: string;
};

export type CurrencyResponseType = {
  id: string;
  name: string;
  symbol: string;
};

export type CurrencyOption = {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: 'asc' | 'desc' }[];
  search: string;
};