// stores/userStore.ts
import { defineStore } from 'pinia';
import { employeeService } from "@/app/http/httpServiceProvider";
import type { EmployeeListingType } from '@/components/employee/types';

export const useEmployeeStore = defineStore('employees', {
  state: () => ({
    employees: [] as EmployeeListingType[],
    error: null as string | null,
  }),
  actions: {
    async fetchEmployees() {
      this.error = null;

      try {
        const data = await employeeService.getEmployees();
        console.log('response store employees', data);
        this.employees = data;
        //localStorage.setItem("list-users", JSON.stringify(this.users));
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar colaboradores';
        console.error("❌ Erro ao buscar colaboradores:", err);
      }
    },
  },
});
  