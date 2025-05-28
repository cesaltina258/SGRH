// stores/userStore.ts
import { defineStore } from 'pinia';
import { userService } from "@/app/http/httpServiceProvider";
import { authService } from "@/app/http/httpServiceProvider";
import type { UserType1 } from '@/app/http/types';

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [] as UserType1[],
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
    async fetchUsers( 
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
        const { content, meta } = await userService.getUsers(
          actualPage,
          actualSize,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.users = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar utilizadores';
        this.users = [];
        this.pagination.totalElements = 0;
      } finally {
        this.loading = false;
      }
    }

  }
});

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: [] as UserType1[],
    error: null as string | null,
    loading: false,
  }),
  actions: {
    async fetchProfile() {
      this.error = null;
      this.loading = true;
      try {
        const response = await authService.getUserProfile();
        this.profile = response.data;
        console.log('response profile', response);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar profile';
        console.error("❌ Erro ao buscar profile:", err);
      }
      finally {
        this.loading = false;
      }
    },
  },
});

