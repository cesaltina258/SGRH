import HttpService from "@/app/http/httpService";
import type { HospitalProcedureTypeInsert, HospitalProcedureTypeListing, HospitalProcedureTypeUpdate } from "@/components/baseTables/hospitalProcedureType/types";
import { symbolName } from "typescript";

export default class HospitalProcedureTypeService extends HttpService {

  //get de todos utilizadores
  async getHospitalProcedureTypes(
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'name',
    direction: string = 'asc',
    query_value?: string,
    query_props?: string
  ): Promise<{ content: HospitalProcedureTypeListing[], meta: any }> {
    try {
      const queryParams = [
        `page=${page}`,
        `size=${size}`,
        `sortColumn=${sortColumn}`,
        `direction=${direction}`
      ];

      if (query_value && query_props) {
        queryParams.push(`query_props=${encodeURIComponent(query_props)}`);
        queryParams.push(`query_value=${encodeURIComponent(query_value)}`);
      }

      const queryString = queryParams.join('&');
      const url = `/administration/setup/hospital-procedure-types?${queryString}`;

      const response = await this.get(url);

      return {
        content: response.data || [],
        meta: response.meta || {}
      };

    } catch (error) {
      console.error("❌ Erro ao buscar hospital-procedure-types:", error);
      throw error;
    }
  }

  async createHospitalProcedureType(hospitalProcedureTypeData: HospitalProcedureTypeInsert): Promise<HospitalProcedureTypeInsert> {
    try {
      const response = await this.post("/administration/setup/hospital-procedure-types", hospitalProcedureTypeData);
      console.log('response create hospital-procedure-types', response);
      return response;

    } catch (error) {
      console.error("❌ Erro ao criar hospital-procedure-types:", error);
      throw error;
    }
  }

  async updateHospitalProcedureType(id: number, hospitalProcedureTypeData: HospitalProcedureTypeUpdate): Promise<HospitalProcedureTypeUpdate> {
    try {
      // Corpo da requisição conforme especificado
      const payload = {
        name: hospitalProcedureTypeData.name,
        description: hospitalProcedureTypeData.description,
      };


      const response = await this.put<HospitalProcedureTypeListing>(`/administration/setup/hospital-procedure-types/${id}`, payload);
      return response;
    } catch (error) {
      console.error("❌ Erro ao actualizar hospital-procedure-types:", error);
      throw error;
    }
  }

  async deleteHospitalProcedureType(id: number): Promise<void> {
    try {
      await this.delete(`/administration/setup/hospital-procedure-types/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar hospital-procedure-types:", error);
      throw error;
    }
  }

}