// stores/userStore.ts
import { defineStore } from 'pinia';
import { countryService } from "@/app/http/httpServiceProvider";
import type { CountryListingType } from '@/components/baseTables/country/types';
import type { ProvinceListingType } from "@/components/baseTables/country/editCountry/listView/types";


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
        const response = await countryService.getProvinces();
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
    
    async fetchProvincesbyCountry(countryId: number) {
      this.loading = true;
      this.error = null;
      try {
        const data = await countryService.getProvinceByID(countryId);
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


export const useProvinceByCountryStoreID = defineStore('province_by_country', {
  state: () => ({
    province_by_country: [] as ProvinceListingType[],
    pagination: {
      totalElements: 0,
      currentPage: 0,
      itemsPerPage: 2,
      totalPages: 0
    },
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchProvincesByCountryID(
      id: number,
      page: number = this.pagination.currentPage,
      size: number = this.pagination.itemsPerPage,
      sortColumn: string = 'name',
      direction: string = 'asc',
      query_value?: string,
      query_props?: string
    ) {
      this.loading = true;
      this.error = null;

      try {
        const { content, meta } = await countryService.getProvincesByCountryID(
          id,
          page,
          size,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.province_by_country = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };

        console.log('🏞️ Províncias:', this.province_by_country);
        console.log('📄 Meta:', this.pagination);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar províncias';
        this.province_by_country = [];
        this.pagination.totalElements = 0;
        console.error("❌ Erro ao buscar províncias:", err);
      } finally {
        this.loading = false;
      }
    }
  }
});
