

export type EmployeeListingType = {
  id: string;
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
    id: string | undefined;
    name: string;
  } | undefined;
  province: {
    id: string;
    name: string;
  } | undefined;
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
  position: {
    id: string;
    name: string;
  } | undefined,
  department: {
    id: string;
    name: string
  } | undefined,
  company: {
    id: string;
    name: string
  } | undefined

};

export type EmployeeResponseType = { 
  id: string;
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
    id: string | undefined;
    name: string;
  } | undefined;
  province: {
    id: string;
    name: string;
  } | undefined;
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
  position: {
    id: string;
    name: string;
  } | undefined,
  department: {
    id: string;
    name: string
  } | undefined,
  company: {
    id: string;
    name: string
  } | undefined

};

export type EmployeeInsertType = {
  id?: string | undefined;
  employeeNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  maritalStatus: string | undefined;
  birthDate: string | undefined;
  bloodGroup: string;
  placeOfBirth: string;
  nationality: string;
  incomeTaxNumber: string | null;
  socialSecurityNumber: string | null;
  address: string;
  country: string | undefined;
  province: string | undefined;
  postalCode: string;
  email: string;
  phone: string;
  mobile: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  idCardNumber: string | null;
  idCardIssuer: string;
  idCardExpiryDate: string | undefined;
  idCardIssuanceDate: string | undefined;
  passportNumber: string | null;
  passportIssuer: string;
  passportExpiryDate: string | undefined;
  passportIssuanceDate: string | undefined;
  salary?: number | null;
  company?: string | undefined;
  department?: string | undefined;
  enabled?: boolean;
  position?: string | undefined;
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
  salary?: number | null;
  company?: string | null;
  department?: string | null;
  enabled?: boolean;
  position?: string | null;
};