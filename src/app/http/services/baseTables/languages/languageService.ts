import HttpService from "@/app/http/httpService";
import type { LanguagesUpdate, LanguagesListing, LanguagesInsert } from "@/components/baseTables/languages/types";
import { symbolName } from "typescript";

export default class LanguagesService extends HttpService {

  //get de todos utilizadores
  async getLanguages(
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'name',
    direction: string = 'asc',
    query_value?: string,
    query_props?: string
  ): Promise<{ content: LanguagesListing[], meta: any }> {
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
      const url = `/administration/languages?${queryString}`;

      const response = await this.get(url);

      return {
        content: response.data || [],
        meta: response.meta || {}
      };

    } catch (error) {
      console.error("❌ Erro ao buscar languages:", error);
      throw error;
    }
  }

  async createLanguages(languagesData: LanguagesInsert): Promise<LanguagesInsert> {
    try {
      const response = await this.post("/administration/languages", languagesData);
      console.log('response create languages', response);
      return response;

    } catch (error) {
      console.error("❌ Erro ao criar languages:", error);
      throw error;
    }
  }

  async updateLanguages(id: number, languagesData: LanguagesUpdate): Promise<LanguagesUpdate> {
    try {
      // Corpo da requisição conforme especificado
      const payload = {
        code: languagesData.code,
        name: languagesData.name,
        localizedName: languagesData.localizedName,
        region: languagesData.region,
        rtl: languagesData.rtl,
      };


      const response = await this.put<LanguagesListing>(`/administration/languages/${id}`, payload);
      return response;
    } catch (error) {
      console.error("❌ Erro ao actualizar languages:", error);
      throw error;
    }
  }

  async deleteLanguages(id: number): Promise<void> {
    try {
      await this.delete(`/administration/languages/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar languages:", error);
      throw error;
    }
  }

}