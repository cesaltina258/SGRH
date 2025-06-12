// stores/departmentStore.ts
import { defineStore } from 'pinia';
import { hospitalProcedureService } from "@/app/http/httpServiceProvider";
import type { HospitalProcedureListingType } from '@/components/institution/types';

export const useHospitalProcedureStore = defineStore('hospital_procedure', { 
  state: () => ({
    hospital_procedure: [] as HospitalProcedureListingType[],
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
    async fetchHospitalProcedures(
      id: string | null,
      page?: number,
      size?: number,
      sortColumn: string = 'createdAt',
      direction: string = 'asc',
      query_value?: string,
      query_props?: string
    ) {
      this.loading = true;
      this.error = null;
    
      const actualPage = page ?? this.pagination.currentPage;
      const actualSize = size ?? this.pagination.itemsPerPage;
    
      try {
        const { content, meta } = await hospitalProcedureService.getHospitalProcedureByInstitution(
          id,
          actualPage,
          actualSize,
          sortColumn,
          direction,
          query_value,
          query_props
        );
    
        this.hospital_procedure = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('Procedimentos hospitalares:', this.hospital_procedure);
        console.log('Meta:', this.pagination);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar procedimentos hospitalares';
        console.error("❌ Erro ao buscar procedimentos hospitalares:", err);
        this.hospital_procedure = [];
        this.pagination.totalElements = 0;
      } finally {
        this.loading = false;
      }
    }
    
  }
});