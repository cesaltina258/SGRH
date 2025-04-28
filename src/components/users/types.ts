export type UserInsertType= {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  enabled: boolean;
};


export type UserListingType  = {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  username: string;
  enabled: boolean;
  accountLocked: boolean;
  twoFactor: boolean;
  failedsLogin: string;
  lastSucessfulLogin: string | Date;
  lastFailedLogin: string | Date;
  lastPasswordUpdate: string | Date;
  passwordExpirationDate: string | Date;
};


