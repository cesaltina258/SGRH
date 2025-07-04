// stores/departmentStore.ts
import { defineStore } from 'pinia';
import { healthPlanService } from "@/app/http/httpServiceProvider";
import type { HealthPlanListingType, HealthPlanInsertType } from "@/components/institution/types";

export const usehealthPlanStore = defineStore('health_plan', { 
  state: () => ({
    health_plan: [] as HealthPlanListingType[],
    pagination: { 
      totalElements: 0,
      currentPage: 0,
      itemsPerPage: 5, 
      totalPages: 0
    },
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchHealthPlanforListing(
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
        const { content, meta } = await healthPlanService.getHealthPlansOfCompanyId(
          id,
          actualPage,
          actualSize,
          sortColumn,
          direction,
          query_value,
          query_props
        );
    
        this.health_plan = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('Pessoas de health_plan:', this.health_plan);
        console.log('Meta:', this.pagination);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar health_plan';
        console.error("❌ Erro ao buscar health_plan:", err);
        this.health_plan = [];
        this.pagination.totalElements = 0;
      } finally {
        this.loading = false;
      }
    }
    
  }
});