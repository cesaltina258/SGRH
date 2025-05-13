// stores/userStore.ts
import { defineStore } from 'pinia';
import { countryService } from "@/app/http/httpServiceProvider";
import type { CountryListingType } from "@/app/http/services/baseTables/country/types";

export const useCountryStoreID = defineStore('country_id', {
  state: () => ({
    country_id: null as CountryListingType | null,
    error: null as string | null,
  }),
  actions: {
    async fetchCountryByID(id: number): Promise<CountryListingType | null> {
      this.error = null;

      try {
        const response = await countryService.getCountryByID(id);
        this.country_id = response.data;
        return response.data;
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar país por ID';
        console.error("❌ Erro ao buscar país por ID:", err);
        return null;
      }
    },
  },
});

