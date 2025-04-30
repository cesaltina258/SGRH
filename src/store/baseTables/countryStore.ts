// stores/userStore.ts
import { defineStore } from 'pinia';
import { countryService } from "@/app/http/httpServiceProvider";
import type { CountryListingType } from '@/components/baseTables/country/types';

export const useCountryStore = defineStore('countries', {
  state: () => ({
    countries: [] as CountryListingType[],
    error: null as string | null,
  }),
  actions: {
    async fetchContries() {
      this.error = null;
      try {
        const data = await countryService.getCountries();
        console.log('response store countries', data);
        this.countries = data;
        //localStorage.setItem("list-users", JSON.stringify(this.users));
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar países';
        console.error("❌ Erro ao buscar países:", err);
      }
    },
  },
});
  