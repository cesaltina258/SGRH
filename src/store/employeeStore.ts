import { defineStore } from 'pinia';
import { employeeService } from "@/app/http/httpServiceProvider";
import type { EmployeeListingType, EmployeeInsertType } from '@/components/employee/types';

export const useEmployeeStore = defineStore('employees', {  
  state: () => ({
    employees: [] as EmployeeListingType[],
    pagination: { 
      totalElements: 0,
      currentPage: 0,
      itemsPerPage: 10, 
      totalPages: 0
    },
    loading: false,
    error: null as string | null,
    draftEmployee: null as EmployeeInsertType | null,
    currentEmployeeId: null as string | null
      
  }),

  actions: {
    async fetchEmployees(
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
        const { content, meta } = await employeeService.getEmployees(
          actualPage,
          actualSize,
          sortColumn,
          direction,
          query_value,
          query_props
        );
    
        this.employees = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('Colaboradores:', this.employees);
        console.log('Meta:', this.pagination);
    
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar colaboradores';
        console.error("❌ Erro ao buscar colaboradores:", err);
        this.employees = [];
        this.pagination.totalElements = 0;
      } finally {
        this.loading = false;
      }
    },
    setDraftEmployee(data: EmployeeInsertType) {
          this.draftEmployee = data;
          localStorage.setItem('employeeDraft', JSON.stringify(data));
        },
        setCurrentEmployeeId(id: string) {
          this.currentEmployeeId = id;
          localStorage.setItem('currentEmployeeId', id);
        },
        clearDraft() {
          this.draftEmployee = null;
          this.currentEmployeeId = null;
          localStorage.removeItem('employeeDraft');
          localStorage.removeItem('currentEmployeeId'); 
        },
        loadFromStorage() {
          const draft = localStorage.getItem('employeeDraft');
          const id = localStorage.getItem('currentEmployeeId');
          if (draft) this.draftEmployee = JSON.parse(draft);
          if (id) this.currentEmployeeId = id;
        }
    
  }
});