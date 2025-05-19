import HttpService from "@/app/http/httpService";
import type { CurrencyInsertType, CurrencyListingType, CurrencyUpdateType } from "@/components/baseTables/currency/types";
import { symbolName } from "typescript";

export default class CountryService extends HttpService {

  //get de todos utilizadores
  async getCurrencies(
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'name',
    direction: string = 'asc',
    query_value?: string,
    query_props?: string
  ): Promise<{ content: CurrencyListingType[], meta: any }> {
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
      const url = `/administration/setup/currencies?${queryString}`;

      const response = await this.get(url);

      return {
        content: response.data || [],
        meta: response.meta || {}
      };

    } catch (error) {
      console.error("❌ Erro ao buscar países:", error);
      throw error;
    }
  }

  async createCurrency(currencyData: CurrencyInsertType): Promise<CurrencyInsertType> {
    try {
      const response = await this.post("/administration/setup/currencies", currencyData);
      console.log('response create currencies', response);
      return response;

    } catch (error) {
      console.error("❌ Erro ao criar currencies:", error);
      throw error;
    }
  }

    async updateCurrency(id: number, currencyData: CurrencyUpdateType): Promise<CurrencyUpdateType> {
    try {
      // Corpo da requisição conforme especificado
      const payload = {
        name: currencyData.name,
        symbol: currencyData.symbol,
      };


      const response = await this.put<CurrencyListingType>(`/administration/setup/currencies/${id}`, payload);
      return response;
    } catch (error) {
      console.error("❌ Erro ao actualizar currencies:", error);
      throw error;
    }
  }
  
    async deleteCurrency(id: number): Promise<void> {
    try {
      await this.delete(`/administration/setup/currencies/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar currencies:", error);
      throw error;
    }
  }

}