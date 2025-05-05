// stores/userStore.ts
import { defineStore } from 'pinia';
import { provinceService } from "@/app/http/httpServiceProvider";
import type { ProvinceListingType } from "@/components/baseTables/editCountry/listView/types";

export const useProvinceByCountryStoreID = defineStore('country_by_province', {
  state: () => ({
    country_by_province: null as ProvinceListingType | null,
    error: null as string | null,
  }),
  actions: {
    async fetchProvinceByCountryID(id: number): Promise<ProvinceListingType | null> {
      this.error = null;

      try {
        const response = await provinceService.getProvinceByCountryID(id);
        this.country_by_province = response.data;
        return response.data;
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar país por ID';
        console.error("❌ Erro ao buscar país por ID:", err);
        return null;
      }
    },
  },
});

