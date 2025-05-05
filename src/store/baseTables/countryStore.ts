// stores/userStore.ts
import { defineStore } from 'pinia';
import { countryService } from "@/app/http/httpServiceProvider";
import type { CountryListingType } from "@/app/http/services/baseTables/country/types";

export const useCountryStore = defineStore('countries', {
  state: () => ({
    countries: [] as CountryListingType[],
    error: null as string | null,
  }),
  actions: {
    async fetchCountries() {
      this.error = null;

      try {
        const response = await countryService.getCountries();
        this.countries = response.data;
        console.log('response countries', response);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar países';
        console.error("❌ Erro ao buscar países:", err);
      }
    },
  },
});
