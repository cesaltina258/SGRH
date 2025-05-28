import HttpService from "@/app/http/httpService";
import type { EmployeeListingType, EmployeeInsertType, EmployeeResponseType } from "@/components/employee/types";
import type { ApiErrorResponse } from "@/app/common/types/errorType";

interface ApiResponse<T> {
  data: T;
  meta?: any;
}

interface ServiceResponse<T> { 
  status: 'success' | 'error';
  data?: T;
  error?: ApiErrorResponse;
}

export default class EmployeeService extends HttpService {

  //get de todos colaboradores
  async getEmployees(
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'createdAt',
    direction: string = 'asc', 
    query_props?: string,
    query_value?: string
  ): Promise<{ content: EmployeeListingType[], meta: any }> {
    try {
      // Construção manual da query string para controle total
      const queryParams = [
        `page=${page}`,
        `size=${size}`,
        `sortColumn=${sortColumn}`, 
        `direction=${direction}`,
      ];

      
  
      if (query_value && query_props) {
        queryParams.push(`query_props=${encodeURIComponent(query_props)}`);
        queryParams.push(`query_value=${encodeURIComponent(query_value)}`);
      }

      const includesToUse = 'position,department,company,province,country';
      queryParams.push(`includes=${includesToUse}`);

      const queryString = queryParams.join('&');


      const url = `/human-resource/employees?${queryString}`;
  
      console.log('URL da requisição:', url); // Para debug
  
      const response = await this.get<ApiResponse<EmployeeListingType[]>>(url);


      console.log('Resposta da requisição:', response); // Para debug
      
      return {
        content: response.data || [],
        meta: response.meta || []
      };
      
    } catch (error) {
      console.error("❌ Erro ao buscar colaboradores:", error);
      throw error;
    }
  }

  async createEmployee(employeeData: EmployeeInsertType): Promise<ServiceResponse<EmployeeResponseType>> {
    try {
      const response = await this.post<ApiResponse<EmployeeResponseType>>('/human-resource/employees', employeeData);
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      if (error.response) {
        return {
          status: 'error',
          error: error.response.data as ApiErrorResponse
        };
      }
      return {
        status: 'error',
        error: this.createNetworkErrorResponse()
      };
    }
  }

  private createNetworkErrorResponse(): ApiErrorResponse {
    return {
      status: 'error',
      message: 'Network error',
      error: {
        type: 'ConnectionError',
        title: 'Network Error',
        status: 503,
        detail: 'Could not connect to server',
        instance: '/human-resource/employees'
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  async getEmployeeById(id: string ) : Promise<{ data: EmployeeResponseType }> {
    try {
      const response = await this.get<{ data: EmployeeResponseType; meta: any }>
      (`/human-resource/employees/${id}?includes=position,department,company,province,country`);
      console.log('Resposta da requisição:------------------------', response); 
      return {
        data: response.data
      };
    } catch (error) {
      throw this.handleError(error);
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

  async updateEmployee(id: string, employeeData: EmployeeInsertType): Promise<EmployeeResponseType> {
    try {

      console.log('employeeData on update', employeeData.salary)
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
        passportIssuanceDate: employeeData.passportIssuanceDate,
        salary: employeeData.salary,
        company: employeeData.company,
        department: employeeData.department,
        position: employeeData.position
      };

      const response = await this.put<EmployeeResponseType>(`/human-resource/employees/${id}`, payload);
      console.log('response update', response)
      return response;

    } catch (error) {
      console.error("❌ Erro ao actualizar colaborador:", error);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      await this.delete(`/human-resource/employees/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar colaborador:", error);
      throw error;
    }
  }


}
