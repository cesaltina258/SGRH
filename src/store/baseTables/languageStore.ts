// stores/userStore.ts
import { defineStore } from 'pinia';
import { languageService } from "@/app/http/httpServiceProvider";
import type { LanguagesUpdate, LanguagesListing, LanguagesInsert } from "@/components/baseTables/languages/types";

export const useLanguagesStore = defineStore('languages', {
  state: () => ({
    languages: [] as LanguagesListing[],
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
    async fetchLanguages(
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
        const { content, meta } = await languageService.getLanguages(
          page,
          size,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.languages = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('🌍 languages:', this.languages);
        console.log('📄 Meta:', this.pagination);

      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar languages';
        this.languages = [];
        this.pagination.totalElements = 0;
        console.error("❌ Erro ao buscar languages:", err);
      } finally {
        this.loading = false;
      }
    }
  }
});

