// stores/userStore.ts
import { defineStore } from 'pinia';
import { provinceService } from "@/app/http/httpServiceProvider";
import type { ProvinceListingType } from '@/components/baseTables/province/types';
import { load } from '@amcharts/amcharts5/.internal/core/util/Net';

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
        const data = await provinceService.getProvinces();
        console.log('response store provinces', data);
        this.provinces = data;
        //localStorage.setItem("list-users", JSON.stringify(this.users));
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
    async fetchProvincesbyCountry(countryId: string | number) {
      this.loading = true;
      this.error = null;
      try {
        const data = await provinceService.getProvinceBycountrId(countryId);
        // Garante que a resposta seja tratada como array
        this.provincesbyCountry = Array.isArray(data) ? data : [];
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
  