import HttpService from "@/app/http/httpService";
import type { InstitutionListingType } from "@/components/institution/types";
export default class InstitutionService extends HttpService {

  //get de todos utilizadores
  async getInstitutions(
    page: number = 0,
    size: number = 10000000,
    sortColumn: string = 'createdAt',
    direction: string = 'asc', // Valor padrão alterado para 'asc' conforme seu exemplo
    query_value?: string,
    query_props?: string
  ): Promise<{ content: InstitutionListingType[], meta: any }> {
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
      const url = `/administration/companies?${queryString}`;
  
      console.log('URL da requisição:', url); // Para debug
  
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