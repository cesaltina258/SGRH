// utils/validations/employeeValidations.ts
import type { EmployeeInsertType } from '@/components/employee/types';

export const validateEmployee = (employee: EmployeeInsertType): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!employee.employeeNumber) errors.employeeNumber = 'Employee number is required';
  if (!employee.firstName) errors.firstName = 'First name is required';
  if (!employee.lastName) errors.lastName = 'Last name is required';
  if (!employee.gender) errors.gender = 'Gender is required';
  if (!employee.maritalStatus) errors.maritalStatus = 'Marital status is required';
  if (!employee.birthDate) errors.birthDate = 'Birth date is required';
  if (!employee.address) errors.address = 'Address is required';
  if (!employee.province) errors.province = 'Province is required';
  if (!employee.email) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(employee.email)) {
    errors.email = 'Email is invalid';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};