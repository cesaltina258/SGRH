// services/departmentService.ts
import HttpService from "@/app/http/httpService";
import type { DepartmentListingType } from "@/components/institution/types";

export default class DepartmentService extends HttpService {
  async getDepartmentsByInstitution(
    id: number,
    page: number = 0,
    size: number = 10000000,
    sortColumn: string = 'createdAt',
    direction: string = 'asc',
    query_value?: string,
    query_props?: string
  ): Promise<{ content: DepartmentListingType[], meta: any }> {
    try {
      const queryParams = [
        `id=${id}`,
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
      const url = `/administration/departments/in-company?${queryString}`;

      console.log('URL da requisição:', url);
      const response = await this.get(url);

      return {
        content: response.data || [],
        meta: response.meta || []
      };
      
    } catch (error) {
      console.error("❌ Erro ao buscar departamentos:", error);
      throw error;
    }
  }
}