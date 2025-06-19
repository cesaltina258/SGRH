import { defineStore } from 'pinia';
import { employeeService } from "@/app/http/httpServiceProvider";
import type { EmployeeListingType, EmployeeInsertType } from '@/components/employee/types';
import EmployeeService from '@/app/http/services/employee/employeeService';
import { clear } from 'console';

interface EmployeeStats {
  total: number;
  enabled: number;
  disabled: number;
  byGender: {
    male: number;
    female: number;
    other?: number;
  };
}

export const useEmployeeStore = defineStore('employees', {
  state: () => ({
    employees: [] as EmployeeListingType[],
    employeesForDropdown: [] as EmployeeListingType[],
    pagination: {
      totalElements: 0,
      currentPage: 0,
      itemsPerPage: 10,
      totalPages: 0
    },
    loading: false,
    error: null as string | null,
    draftEmployee: null as EmployeeInsertType | null,
    currentEmployeeId: null as string | null,
    stats: {
      total: 0,
      enabled: 0,
      disabled: 0,
      byGender: {
        male: 0,
        female: 0,
        other: 0
      }
    } as EmployeeStats,
    statsLoading: false,
    statsError: null as string | null

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
    },
    async fetchEmployeeStats() {
      this.statsLoading = true;
      this.statsError = null;

      const statsService = new EmployeeService();

      try {
        const [
          totalResponse,
          enabledResponse,
          disabledResponse,
          genderResponse
        ] = await Promise.all([
          statsService.getTotalEmployees(),
          statsService.getEnabledEmployees(),
          statsService.getDisabledEmployees(),
          statsService.getEmployeesByGender()
        ]);

        if (totalResponse.status === 'success') {
          this.stats.total = totalResponse.data || 0;
        }

        if (enabledResponse.status === 'success') {
          this.stats.enabled = enabledResponse.data || 0;
        }

        if (disabledResponse.status === 'success') {
          this.stats.disabled = disabledResponse.data || 0;
        }

        if (genderResponse.status === 'success') {
          this.stats.byGender = genderResponse.data || {
            male: 0,
            female: 0,
            other: 0
          };
        }

      } catch (err: any) {
        this.statsError = err.message || 'Erro ao buscar estatísticas';
        console.error("❌ Erro ao buscar estatísticas:", err);
      } finally {
        this.statsLoading = false;
      }
    },
    async fetchEmployeesForDropdown(
      id: string | undefined,
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
        const { content, meta } = await employeeService.getEmployeesForDropdown(
          id,
          actualPage,
          actualSize,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.employeesForDropdown = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('Colaboradores:', this.employeesForDropdown);
        console.log('Meta:', this.pagination);

      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar colaboradores';
        console.error("❌ Erro ao buscar colaboradores:", err);
        this.employeesForDropdown = [];
        this.pagination.totalElements = 0;
      } finally {
        this.loading = false;
      }
    },
    clearEmployeesForDropdown() {
      this.employeesForDropdown = [];
    }
  },
  getters: {
    employeeStatsForOverview: (state) => {
      const total = state.stats.total;

      return [
        {
          title: "total-employees",
          endVal: total,
          color: "primary",
          percent: "0%",
          isProgress: true,
          icon: "ph-users",
        },
        /*{
          title: "active-employees",
          endVal: state.stats.enabled,
          color: "success",
          percent: total > 0 
            ? `${Math.round((state.stats.enabled / total) * 100)}%` 
            : "0%",
          isProgress: false,
          icon: "ph-check-circle",
        },*/
        {
          title: "inactive-employees",
          endVal: state.stats.disabled,
          color: "danger",
          percent: total > 0
            ? `${Math.round((state.stats.disabled / total) * 100)}%`
            : "0%",
          isProgress: false,
          icon: "ph-x-circle",
        },
        {
          title: "male-employees",
          endVal: state.stats.byGender.male,
          color: "info",
          percent: total > 0
            ? `${Math.round((state.stats.byGender.male / total) * 100)}%`
            : "0%",
          isProgress: false,
          icon: "ph-gender-male",
        },
        {
          title: "female-employees",
          endVal: state.stats.byGender.female,
          color: "pink",
          percent: total > 0
            ? `${Math.round((state.stats.byGender.female / total) * 100)}%`
            : "0%",
          isProgress: false,
          icon: "ph-gender-female",
        }
      ];
    }

  }

});