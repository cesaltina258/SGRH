import HttpService from "@/app/http/httpService";
import type { CountryInsertType, CountryListingType, CountryUpdateType } from "@/components/baseTables/country/types";

export default class CountryService extends HttpService {

  //get de todos utilizadores
  async getCountries(
    page: number = 0,
    size: number = 2,
    sortColumn: string = 'name',
    direction: string = 'asc',
    query_value?: string,
    query_props?: string
  ): Promise<{ content: CountryListingType[], meta: any }> {
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
      const url = `/administration/setup/countries?${queryString}`;

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


  async getCountryByID(id: number): Promise<{ data: CountryListingType }> {
    try {
      return await this.get(`/administration/setup/countries/${id}`);
    } catch (error) {
      console.error("Erro ao buscar país por ID:", error);
      throw error;
    }
  }



  async createCountry(userData: CountryInsertType): Promise<CountryInsertType> {
    try {
      const response = await this.post("/administration/setup/countries", userData);
      console.log('response create user', response);
      return response;

    } catch (error) {
      console.error("❌ Erro ao criar País:", error);
      throw error;
    }
  }

  async deleteCountry(id: number): Promise<void> {
    try {
      await this.delete(`/administration/setup/countries/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar País:", error);
      throw error;
    }
  }

  async updateCountry(id: number, userData: CountryUpdateType): Promise<CountryUpdateType> {
    try {
      // Corpo da requisição conforme especificado
      const payload = {
        name: userData.name,
        code: userData.code,
        iso2Code: userData.iso2Code,
        iso3Code: userData.iso3Code,
        phoneCode: userData.phoneCode,
        currency: userData.currency,
        currencySymbol: userData.currencySymbol,
        currencyCode: userData.currencyCode,
      };


      const response = await this.put<CountryListingType>(`/administration/setup/countries/${id}`, payload);
      return response;
    } catch (error) {
      console.error("❌ Erro ao actualizar País:", error);
      throw error;
    }
  }

}
