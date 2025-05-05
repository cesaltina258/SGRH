// stores/userStore.ts
import { defineStore } from 'pinia';
import { provinceService } from "@/app/http/httpServiceProvider";
import type { ProvinceListingType } from "@/components/baseTables/editCountry/listView/types";

export const useProvinceStore = defineStore('provinces', {
  state: () => ({
    provinces: [] as ProvinceListingType[],
    error: null as string | null,
  }),
  actions: {
    async fetchProvinces() {
      this.error = null;

      try {
        const response = await provinceService.getProvinces();
        this.provinces = response.data;
        console.log('response provinces', response);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar provinces';
        console.error("❌ Erro ao buscar provinces:", err);
      }
    },
  },
});
