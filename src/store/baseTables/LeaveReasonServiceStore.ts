// stores/userStore.ts
import { defineStore } from 'pinia';
import { leaveReasonService } from "@/app/http/httpServiceProvider";
import type { LeaveReasonUpdate, LeaveReasonListing, LeaveReasonInsert } from "@/components/baseTables/leaveReason/types";

export const useleaveReasonServiceStore = defineStore('leave_reason', {
  state: () => ({
    leave_reason: [] as LeaveReasonListing[],
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
    async fetchLeaveReasons(
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
        const { content, meta } = await leaveReasonService.getLeaveReasons(
          page,
          size,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.leave_reason = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('🌍 leave_reason:', this.leave_reason);
        console.log('📄 Meta:', this.pagination);

      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar leave_reason';
        this.leave_reason = [];
        this.pagination.totalElements = 0;
        console.error("❌ Erro ao buscar leave_reason:", err);
      } finally {
        this.loading = false;
      }
    }
  }
});

