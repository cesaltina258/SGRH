import HttpService from "@/app/http/httpService";
import type { EmployeeListingType, EmployeeInsertType, EmployeeUpdateType } from "@/components/employee/types";
import type { ApiErrorResponse } from "@/app/common/types/errorType";
import { mo } from "@/assets/images/flags/utils";
export default class EmployeeService extends HttpService {

  //get de todos utilizadores
  async getEmployees(
    page: number = 0, 
    size: number = 10, 
    sort: string = 'createdAt,desc',
    search?: string
  ): Promise<{ content: EmployeeListingType[], metadata: any }> {
    try {
      const response = await this.get("/human-resource/employees", {
        params: {
          page,
          size,
          sort,
          ...(search && { search })
        }
      });
      
      return {
        content: response.data.content,
        metadata: response.data.metadata
      };
    } catch (error) {
      console.error("❌ Erro ao buscar colaboradores:", error); 
      throw error;
    }
  }

  async createEmployee(employeeData: EmployeeInsertType) {
    try {
      const response = await this.post('/human-resource/employees', employeeData);
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      if (error.response) {
        // Error from backend
        return {
          status: 'error',
          error: error.response.data as ApiErrorResponse
        };
      }
      // Network or other error
      return {
        status: 'error',
        error: {
          message: 'Network error',
          detail: 'Could not connect to server' 
        }
      };
    }
  }

  async getEmployeeById(id: string | number) {
    try {
      const response = await this.get(`/human-resource/employees/${id}`);
      return {
        status: 'success',
        data: response.data
      };
    } catch (error) {
      return {
        status: 'error',
        error: this.handleError(error)
      };
    }
  }

  handleError(error: any) {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Erro na requisição',
        details: error.response.data?.errors || null,
        status: error.response.status
      };
    }
    return {
      message: 'Erro de conexão',
      details: null
    };
  }

    async updateEmployee(id: string, employeeData: EmployeeUpdateType): Promise<EmployeeListingType> {
      try {
        // Corpo da requisição conforme especificado
        const payload = {
          employeeNumber: employeeData.employeeNumber,
          firstName: employeeData.firstName,
          middleName: employeeData.middleName,
          lastName: employeeData.lastName,
          gender: employeeData.gender,
          maritalStatus: employeeData.maritalStatus,
          birthDate: employeeData.birthDate,
          bloodGroup: employeeData.bloodGroup,
          placeOfBirth: employeeData.placeOfBirth,
          nationality: employeeData.nationality,
          incomeTaxNumber: employeeData.incomeTaxNumber,
          socialSecurityNumber: employeeData.socialSecurityNumber,
          address: employeeData.address,
          country: employeeData.country,
          province: employeeData.province,
          postalCode: employeeData.postalCode,
          email: employeeData.email,
          phone: employeeData.phone,
          mobile: employeeData.mobile,
          emergencyContactName: employeeData.emergencyContactName,
          emergencyContactPhone: employeeData.emergencyContactPhone,
          idCardNumber: employeeData.idCardNumber,
          idCardIssuer: employeeData.idCardIssuer,
          idCardExpiryDate: employeeData.idCardExpiryDate,
          idCardIssuanceDate: employeeData.idCardIssuanceDate,
          passportNumber: employeeData.passportNumber,
          passportIssuer: employeeData.passportIssuer,
          passportExpiryDate: employeeData.passportExpiryDate,
          passportIssuanceDate: employeeData.passportIssuanceDate
        };
  
        const response = await this.put<EmployeeUpdateType>(`/human-resource/employees/${id}`, payload);
        return response;

      } catch (error) {
        console.error("❌ Erro ao actualizar utilizador:", error);
        throw error;
      }
    }

    async deleteEmployee(id: number): Promise<void> {
      try {
        await this.delete(`/human-resource/employees/${id}`);
      } catch (error) {
        console.error("❌ Erro ao deletar colaborador:", error);
        throw error;
      }
    }


}
