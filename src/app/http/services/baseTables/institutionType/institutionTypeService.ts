import HttpService from "@/app/http/httpService";
import type { InstitutionTypeListingType } from "@/components/baseTables/institutionType/types";
import type { ApiErrorResponse } from "@/app/common/types/errorType";

export default class InstitutionTypeService extends HttpService {

  //get de todas instituicoes para o select box
  async getInstitutionTypes(
    page: number = 0,
    size: number = 10000000,
    sortColumn: string = 'createdAt',
    direction: string = 'asc', // Valor padrão alterado para 'asc' conforme seu exemplo
    query_value?: string,
    query_props?: string
  ): Promise<{ content: InstitutionTypeListingType[], meta: any }> {
    try {
      // Construção manual da query string para controle total
      const queryParams = [
        `page=${page}`,
        `size=${size}`,
        `sortColumn=${sortColumn}`, // Apenas o nome da coluna
        `direction=${direction}`    // Direção separada
      ];

      if (query_value && query_props) {
        queryParams.push(`query_props=${encodeURIComponent(query_props)}`);
        queryParams.push(`query_value=${encodeURIComponent(query_value)}`);
      }

      const queryString = queryParams.join('&');
      const url = `/administration/setup/institution-types?${queryString}`;

      console.log('URL da requisição institution type------------------:', url); // Para debug

      const response = await this.get(url);

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

}
