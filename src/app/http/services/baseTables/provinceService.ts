import HttpService from "@/app/http/httpService";
import type { ProvinceListingType  } from "@/components/baseTables/province/types";

export default class ProvinceService extends HttpService {

  //get de todos utilizadores
  async getProvinces(): Promise<ProvinceListingType[]> {
    try {
      const response = await this.get("/administration/setup/provinces");
      //console.log('response employees',response);
      return response.data;

    } catch (error) {
      console.error("❌ Erro ao buscar provincias:", error);
      throw error; 
    }
  }
  async getProvinceBycountrId(countrId: string | number): Promise<ProvinceListingType> {
    try {
      const response = await this.get(`/administration/setup/provinces/in-country?id=${countrId}`);
      return response.data;

    } catch (error) {
      console.error("❌ Erro ao buscar provincias a partir do país:", error);
      throw error; 
    }
  }
  




}
