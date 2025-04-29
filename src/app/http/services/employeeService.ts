import HttpService from "@/app/http/httpService";
import type { EmployeeListingType } from "@/components/employee/types";

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


}
