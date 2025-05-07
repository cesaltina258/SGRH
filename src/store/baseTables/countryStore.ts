// stores/userStore.ts
import { defineStore } from 'pinia';
import { countryService } from "@/app/http/httpServiceProvider";
import type { CountryListingType } from '@/components/baseTables/country/types';
import { load } from '@amcharts/amcharts5/.internal/core/util/Net';

export const useCountryStore = defineStore('countries', {
  state: () => ({
    countries: [] as CountryListingType[],
    error: null as string | null,
    loading: false,
  }),
  actions: {
    async fetchCountries() {
      this.error = null;
      this.loading = true;
      try {
        const data = await countryService.getCountries();
        console.log('response store countries', data);
        this.countries = data;
        //localStorage.setItem("list-users", JSON.stringify(this.users));
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar países';
        console.error("❌ Erro ao buscar países:", err);
      }
      finally {
        this.loading = false;
      }
    },
  },
});
  