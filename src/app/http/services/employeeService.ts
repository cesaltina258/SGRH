import HttpService from "@/app/http/httpService";
import type { EmployeeListingType, EmployeeInsertType } from "@/components/employee/types";

export default class EmployeeService extends HttpService {

  //get de todos utilizadores
  async getEmployees(): Promise<EmployeeListingType[]> {
    try {
      const response = await this.get("/human-resource/employees");
      //console.log('response employees',response);
      return response.data;

    } catch (error) {
      console.error("❌ Erro ao buscar colaboradores:", error);
      throw error; 
    }
  }

  async createUser(userData: EmployeeInsertType): Promise<EmployeeListingType> {
      try {
        const response = await this.post("/human-resource/employees/", userData);
        console.log('response create employee',response);
        return response.data; // Retorna os dados do colaborador criado
  
      } catch (error) {
        console.error("❌ Erro ao criar colaborador:", error);
        throw error; 
      }
    }


}
