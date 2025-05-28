import HttpService from "@/app/http/httpService";
import type { CountryListingType } from "@/components/baseTables/country/types";

export default class CountryService extends HttpService {

  //get de todos utilizadores
  async getCountries(): Promise<CountryListingType[]> {
    try {
      const response = await this.get<CountryListingType[]>("/administration/setup/countries");
      //console.log('response employees',response);
      return response;

    } catch (error) {
      console.error("❌ Erro ao buscar países:", error);
      throw error; 
    }
  }


}
