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

export type CountryApiResponse = {
  status: string;
  data: CountryListingType[];
  meta: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    timestamp: string;
  };
};

export type CountryListingType = {
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
