import HttpService from "@/app/http/httpService";
import type { ProvinceListingType, ProvinceUpdateType, ProvinceInsertType  } from '@/components/baseTables/province/types';

export default class ProvinceService extends HttpService {

  //get de todos utilizadores
  async getProvinces(): Promise<{ data: ProvinceListingType[] }> {
    try {
      const response = await this.get<{ data: ProvinceListingType[] }>("/administration/setup/provinces");

      return response;

    } catch (error) {
      console.error("❌ Erro ao buscar Provincias:", error);
      throw error; 
    }
  }

  async getProvinceByID(id: number): Promise<{ data: ProvinceListingType }> {
    try {
      return await this.get(`/administration/setup/provinces/${id}`);
    } catch (error) {
      console.error("Erro ao buscar Provincias por ID:", error);
      throw error;
    }
  }

  async getProvinceBycountrId(countrId: string):  Promise<{ data: ProvinceListingType[] }>  {
    try {
      const response = await this.get<{ data: ProvinceListingType[] }>(`/administration/setup/provinces/in-country?id=${countrId}`);
      console.log('response getProvinceBycountrId', response.data);
      
      return response;

    } catch (error) {
      console.error("❌ Erro ao buscar provincias a partir do país:", error);
      throw error; 
    }
  }

  async getProvinceByCountryID(id: string): Promise<{ data: ProvinceListingType }> {
    try {
      return await this.get(`/administration/setup/provinces/in-country?id=${id}`);
    } catch (error) {
      console.error("Erro ao buscar país por ID:", error);
      throw error;
    }
  }
  
  async createProvince(userData: ProvinceInsertType): Promise<ProvinceInsertType> {
    try {
      const response = await this.post<ProvinceInsertType>("/administration/setup/provinces", userData);
      console.log('response create user',response);
      return response;

    } catch (error) {
      console.error("❌ Erro ao criar País:", error);
      throw error; 
    }
  }

  async deleteProvince(id: string): Promise<void> {
    try {
      await this.delete(`/administration/setup/provinces/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar País:", error);
      throw error;
    }
  }

  async updateProvince(id: string, userData: ProvinceUpdateType): Promise<ProvinceUpdateType> {
    try {
      // Corpo da requisição conforme especificado
      const payload = {
        name: userData.name,
        code: userData.code,
      };
      

      const response = await this.put<ProvinceListingType>(`/administration/setup/provinces/${id}`, payload);
      return response;
    } catch (error) {
      console.error("❌ Erro ao actualizar Provincia:", error);
      throw error;
    }
  }

}
