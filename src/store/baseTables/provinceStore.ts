// stores/userStore.ts
import { defineStore } from 'pinia';
import { provinceService } from "@/app/http/httpServiceProvider";
import type { ProvinceListingType } from '@/components/baseTables/province/types';

export const useProvinceStore = defineStore('provinces', {
  state: () => ({
    provincesbyCountry: [] as ProvinceListingType[], 
    provinces: [] as ProvinceListingType[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchProvinces() {
      this.loading = true;
      this.error = null;

      try {
        const response = await provinceService.getProvinces();
        this.provinces = response.data;
        console.log('response provinces', response);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar províncias';
        console.error("❌ Erro ao buscar províncias:", err);
      } finally {
        this.loading = false;
      }
    },
    clearProvinces() {
      this.provincesbyCountry = [];
    },
    async fetchProvincesbyCountry(countryId:  string) {
      this.loading = true;
      this.error = null;
      try {
        console.log("countryId", countryId);
        const response = await provinceService.getProvinceBycountrId(countryId);
        this.provincesbyCountry = response.data || [];
        
        console.log('response store provinces by country', this.provincesbyCountry);
      } catch (error) {
        this.error = 'Failed to load provinces';
        this.provincesbyCountry = []; // Garante que seja array mesmo em caso de erro
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
