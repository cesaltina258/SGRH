// stores/userStore.ts
import { defineStore } from 'pinia';
import { countryService } from "@/app/http/httpServiceProvider";
import type { CountryListingType } from '@/components/baseTables/country/types';

export const useCountryStore = defineStore('countries', {
  state: () => ({
    countries: [] as CountryListingType[],
    pagination: {
      totalElements: 0,
      currentPage: 0,
      itemsPerPage: 10,
      totalPages: 0
    },
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchCountries(
      page: number = this.pagination.currentPage,
      size: number = this.pagination.itemsPerPage,
      sortColumn: string = 'name', // ajuste conforme o campo disponível na API
      direction: string = 'asc',
      query_value?: string,
      query_props?: string
    ) {
      this.loading = true;
      this.error = null;

      try {
        const { content, meta } = await countryService.getCountries(
          page,
          size,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.countries = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('🌍 Países:', this.countries);
        console.log('📄 Meta:', this.pagination);

      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar países';
        this.countries = [];
        this.pagination.totalElements = 0;
        console.error("❌ Erro ao buscar países:", err);
      } finally {
        this.loading = false;
      }
    }
  }
});
