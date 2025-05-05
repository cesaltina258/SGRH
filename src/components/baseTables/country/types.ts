export type CountryInsertType = {
  id: number;
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
  id: number;
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
