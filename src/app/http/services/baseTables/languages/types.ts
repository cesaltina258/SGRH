export type LanguagesInsert = {
  id: number;
  code: string,
  name: string,
  localizedName: string,
  region: string,
  rtl: boolean
};

export type LanguagesListing = {
  id: number;
  code: string,
  name: string,
  localizedName: string,
  region: string,
  rtl: boolean
};

export type LanguagesUpdate = {
  code: string,
  name: string,
  localizedName: string,
  region: string,
  rtl: boolean
};
