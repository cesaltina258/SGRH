export type ProvinceListingType = {
    id: string;
    name: string;
    code: string;
    country: {
        id: string;
        name: string;
        code: string;
        iso2Code: string;
        iso3Code: string;
        phoneCode: string;
        currency: string;
        currencySymbol: string;
        currencyCode: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        deletedAt: Date | null;
        createdBy: string;
        updatedBy: string;
        deletedBy: string;
      },
      createdAt: Date | null;
      updatedAt: Date | null;
      deletedAt: Date | null;
      createdBy: string;
      updatedBy: string;
      deletedBy: string; 
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
  
  export type ProvinceInsertType = {
    id: string;
    name: string;
    code: string;
  };


  



