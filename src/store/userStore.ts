// stores/userStore.ts
import { defineStore } from 'pinia';
import { userService } from "@/app/http/httpServiceProvider";
import type { UserType1 } from '@/app/http/types';

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [] as UserType1[],
    error: null as string | null,
  }),
  actions: {
    async fetchUsers() {
      this.error = null;

      try {
        const data = await userService.getUsers();
        //console.log('response users', data);
        this.users = data;
        //localStorage.setItem("list-users", JSON.stringify(this.users));
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar usuários';
        console.error("❌ Erro ao buscar usuários:", err);
      }
    },
  },
});
  