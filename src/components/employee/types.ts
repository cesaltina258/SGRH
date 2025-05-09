

export type EmployeeListingType = {
  id: string | number;
  employeeNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  maritalStatus: string;
  birthDate: string;
  bloodGroup: string;
  placeOfBirth: string;
  nationality: string;
  incomeTaxNumber: string | null;
  socialSecurityNumber: string;
  address: string;
  country: {
    id: string | number;
    name: string;
  } | string | null;
  province: {
    id: string | number;
    name: string;
  } | string | null;
  postalCode: string;
  email: string;
  phone: string;
  mobile: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  idCardNumber: string;
  idCardIssuer: string;
  idCardExpiryDate: string;
  idCardIssuanceDate: string;
  passportNumber: string;
  passportIssuer: string;
  passportExpiryDate: string;
  passportIssuanceDate: string;
};

export type EmployeeInsertType = {
  employeeNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  maritalStatus: string | null;
  birthDate: string;
  bloodGroup: string;
  placeOfBirth: string;
  nationality: string;
  incomeTaxNumber: string | null;
  socialSecurityNumber: string | null;
  address: string;
  country: string;
  province: string;
  postalCode: string;
  email: string;
  phone: string;
  mobile: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  idCardNumber: string | null;
  idCardIssuer: string;
  idCardExpiryDate: string;
  idCardIssuanceDate: string;
  passportNumber: string | null;
  passportIssuer: string;
  passportExpiryDate: string;
  passportIssuanceDate: string;
};


export type EmployeeUpdateType = {
  employeeNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  maritalStatus: string | null;
  birthDate: string;
  bloodGroup: string;
  placeOfBirth: string;
  nationality: string;
  incomeTaxNumber: string | null;
  socialSecurityNumber: string | null;
  address: string;
  country: string;
  province: string;
  postalCode: string;
  email: string;
  phone: string;
  mobile: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  idCardNumber: string | null;
  idCardIssuer: string;
  idCardExpiryDate: string;
  idCardIssuanceDate: string;
  passportNumber: string | null;
  passportIssuer: string;
  passportExpiryDate: string;
  passportIssuanceDate: string;
};