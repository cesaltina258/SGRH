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
