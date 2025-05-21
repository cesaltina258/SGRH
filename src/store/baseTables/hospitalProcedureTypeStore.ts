// stores/userStore.ts
import { defineStore } from 'pinia';
import { hospitalProcedureTypeService } from "@/app/http/httpServiceProvider";
import type { HospitalProcedureTypeInsert, HospitalProcedureTypeListing, HospitalProcedureTypeUpdate } from "@/components/baseTables/hospitalProcedureType/types";

export const useHospitalProcedureTypeStore = defineStore('hospital_procedure_types', {
  state: () => ({
    hospital_procedure_types: [] as HospitalProcedureTypeListing[],
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
    async fetchHospitalProcedureTypes(
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
        const { content, meta } = await hospitalProcedureTypeService.getHospitalProcedureTypes(
          page,
          size,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.hospital_procedure_types = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('🌍 hospital_procedure_types:', this.hospital_procedure_types);
        console.log('📄 Meta:', this.pagination);

      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar hospital_procedure_types';
        this.hospital_procedure_types = [];
        this.pagination.totalElements = 0;
        console.error("❌ Erro ao buscar hospital_procedure_types:", err);
      } finally {
        this.loading = false;
      }
    }
  }
});

