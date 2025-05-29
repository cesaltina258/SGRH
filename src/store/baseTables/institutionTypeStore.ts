import { defineStore } from 'pinia';
import { institutionTypeService } from "@/app/http/httpServiceProvider";
import type { InstitutionTypeListingType } from '@/components/baseTables/institutionType/types';

export const useInstitutionTypeStore = defineStore('institutiontypes', { 
  state: () => ({
    institutiontypes: [] as InstitutionTypeListingType[],
    pagination: { 
      totalElements: 0,
      currentPage: 0,
      itemsPerPage: 10, 
      totalPages: 0
    },
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchInstitutionTypes(
      page?: number,
      size?: number,
      sortColumn: string = 'createdAt',
      direction: string = 'asc',
      query_value?: string,
      query_props?: string
    ) {
      this.loading = true;
      this.error = null;
    
      // Define valores padrão dentro da função:
      const currentPage = page ?? this.pagination.currentPage;
      const itemsPerPage = size ?? this.pagination.itemsPerPage;
    
      try {
        const { content, meta } = await institutionTypeService.getInstitutionTypes(
          currentPage,
          itemsPerPage,
          sortColumn,
          direction,
          query_value,
          query_props
        );
    
        this.institutiontypes = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size),
        };
    
        console.log('Instituicoes:', this.institutiontypes);
        console.log('Meta:', this.pagination);
    
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar instituições';
        console.error("❌ Erro ao buscar instituicões:", err);
        this.institutiontypes = [];
        this.pagination.totalElements = 0;
      } finally {
        this.loading = false;
      }
    }    
  }
});