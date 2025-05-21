// stores/userStore.ts
import { defineStore } from 'pinia';
import { institutionTypeService } from "@/app/http/httpServiceProvider";
import type { InstitutionTypeUpdate, InstitutionTypeListing, InstitutionTypeInsert } from "@/components/baseTables/institutionTypes/types";

export const useInstitutionTypeStore = defineStore('institution_types', {
  state: () => ({
    institution_types: [] as InstitutionTypeListing[],
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
    async fetchInstitutionTypes(
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
        const { content, meta } = await institutionTypeService.getInstitutionTypes(
          page,
          size,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.institution_types = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('🌍 institution_types:', this.institution_types);
        console.log('📄 Meta:', this.pagination);

      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar institution_types';
        this.institution_types = [];
        this.pagination.totalElements = 0;
        console.error("❌ Erro ao buscar institution_types:", err);
      } finally {
        this.loading = false;
      }
    }
  }
});

