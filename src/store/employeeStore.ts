import { defineStore } from 'pinia';
import { employeeService } from "@/app/http/httpServiceProvider";
import type { EmployeeListingType } from '@/components/employee/types';

export const useEmployeeStore = defineStore('employees', { 
  state: () => ({
    employees: [] as EmployeeListingType[],
    totalElements: 0,
    currentPage: 0,
    itemsPerPage: 10,
    sort: 'createdAt,desc',
    searchQuery: '',
    error: null as string | null,
  }),
  actions: {
    async fetchEmployees(
      page: number = this.currentPage,
      size: number = this.itemsPerPage,
      sort: string = this.sort,
      search?: string
    ) {
      this.error = null;
      try {
        const { content, metadata } = await employeeService.getEmployees(page, size, sort, search);
        this.employees = content;
        this.totalElements = metadata.totalElements;
        this.currentPage = metadata.page;
        this.itemsPerPage = metadata.size;
        this.sort = sort;
        this.searchQuery = search || '';
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar colaboradores';
        console.error("❌ Erro ao buscar colaboradores:", err);
      }
    },
  },
});