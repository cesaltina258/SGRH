import HttpService from "@/app/http/httpService";
import type { InstitutionTypeUpdate, InstitutionTypeListing, InstitutionTypeInsert } from "@/components/baseTables/institutionTypes/types";
import { symbolName } from "typescript";

export default class InstitutionTypeService extends HttpService {

  //get de todos utilizadores
  async getInstitutionTypes(
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'name',
    direction: string = 'asc',
    query_value?: string,
    query_props?: string
  ): Promise<{ content: InstitutionTypeListing[], meta: any }> {
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
      const url = `/administration/setup/institution-types?${queryString}`;

      const response = await this.get(url);

      return {
        content: response.data || [],
        meta: response.meta || {}
      };

    } catch (error) {
      console.error("❌ Erro ao buscar institution-types:", error);
      throw error;
    }
  }

  async createInstitutionType(institutionTypeData: InstitutionTypeInsert): Promise<InstitutionTypeInsert> {
    try {
      const response = await this.post("/administration/setup/institution-types", institutionTypeData);
      console.log('response create institution-types', response);
      return response;

    } catch (error) {
      console.error("❌ Erro ao criar institution-types:", error);
      throw error;
    }
  }

  async updateInstitutionType(id: number, institutionTypeData: InstitutionTypeUpdate): Promise<InstitutionTypeUpdate> {
    try {
      // Corpo da requisição conforme especificado
      const payload = {
        name: institutionTypeData.name,
        description: institutionTypeData.description,
      };


      const response = await this.put<InstitutionTypeListing>(`/administration/setup/institution-types/${id}`, payload);
      return response;
    } catch (error) {
      console.error("❌ Erro ao actualizar institution-types:", error);
      throw error;
    }
  }

  async deleteInstitutionType(id: number): Promise<void> {
    try {
      await this.delete(`/administration/setup/institution-types/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar institution-types:", error);
      throw error;
    }
  }

}