import HttpService from "@/app/http/httpService";
import type { CountryInsertType, CountryListingType, CountryUpdateType, CountryApiResponse } from "@/components/baseTables/country/types";

export default class CountryService extends HttpService {

  //get de todos utilizadores
  async getCountries(): Promise<CountryListingType[]> {
    try {
      const response = await this.get<CountryApiResponse>("/administration/setup/countries");

      return response.data;

    } catch (error) {
      console.error("❌ Erro ao buscar País:", error);
      throw error; 
    }
  }

  async getCountryByID(id: string): Promise<{ data: CountryListingType }> {
    try {
      return await this.get(`/administration/setup/countries/${id}`);
    } catch (error) {
      console.error("Erro ao buscar país por ID:", error);
      throw error;
    }
  }
  
  

  async createCountry(userData: CountryInsertType): Promise<CountryInsertType> {
    try {
      const response = await this.post<CountryInsertType>("/administration/setup/countries", userData);
      console.log('response create user',response);
      return response;

    } catch (error) {
      console.error("❌ Erro ao criar País:", error);
      throw error; 
    }
  }

  async deleteCountry(id: string): Promise<void> {
    try {
      await this.delete(`/administration/setup/countries/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar País:", error);
      throw error;
    }
  }

  async updateCountry(id: string, userData: CountryUpdateType): Promise<CountryUpdateType> {
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
