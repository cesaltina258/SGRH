// stores/coveragePeriodStore.ts
import { defineStore } from 'pinia';
import { healthPlanService } from "@/app/http/httpServiceProvider";
import type { CoveragePeriodListingType } from '@/components/institution/types';

export const useCoveragePeriodStore = defineStore('coverage_periods', { 
  state: () => ({
    coverage_periods: [] as CoveragePeriodListingType[],
    pagination: { 
      totalElements: 0,
      currentPage: 0,
      itemsPerPage: 10,  // podes ajustar o tamanho default da página
      totalPages: 0
    },
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchCoveragePeriods() {
      this.loading = true;
      this.error = null;
    
      try {
        const { content, meta } = await healthPlanService.getAllCoveragePeriods();
    
        this.coverage_periods = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('Coverage Periods:', this.coverage_periods);
        console.log('Meta:', this.pagination);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar períodos de cobertura';
        console.error("❌ Erro ao buscar períodos de cobertura:", err);
        this.coverage_periods = [];
        this.pagination.totalElements = 0;
      } finally {
        this.loading = false;
      }
    }
  }
});
