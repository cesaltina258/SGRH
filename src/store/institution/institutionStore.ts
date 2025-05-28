import { defineStore } from 'pinia';
import { institutionService } from "@/app/http/httpServiceProvider";
import type { InstitutionListingType, InstitutionInsertType } from '@/components/institution/types';

export const useInstitutionStore = defineStore('institutions', {
  state: () => ({
    institutions: [] as InstitutionListingType[],
    pagination: {
      totalElements: 0,
      currentPage: 0,
      itemsPerPage: 10000000,
      totalPages: 0
    },
    loading: false,
    error: null as string | null,
    draftInstitution: null as InstitutionInsertType | null,
    currentInstitutionId: null as string | null
  }),

  actions: {
    async fetchInstitutions(
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
        const { content, meta } = await institutionService.getInstitutions(
          actualPage,
          actualSize,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.institutions = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('Instituições:', this.institutions);
        console.log('Meta:', this.pagination);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar instituições';
        console.error("❌ Erro ao buscar instituições:", err);
        this.institutions = [];
        this.pagination.totalElements = 0;
      } finally {
        this.loading = false;
      }
    },
    async fetchInstitutionsforListing(
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
        const { content, meta } = await institutionService.getInstitutionsForListing(
          actualPage,
          actualSize,
          sortColumn,
          direction,
          query_value,
          query_props
        );

        this.institutions = content;
        this.pagination = {
          totalElements: meta.totalElements,
          currentPage: meta.page,
          itemsPerPage: meta.size,
          totalPages: meta.totalPages || Math.ceil(meta.totalElements / meta.size)
        };
        console.log('Instituições:', this.institutions);
        console.log('Meta:', this.pagination);
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar instituições';
        console.error("❌ Erro ao buscar instituições:", err);
        this.institutions = [];
        this.pagination.totalElements = 0;
      } finally {
        this.loading = false;
      }
    }
    ,
    setDraftInstitution(data: InstitutionInsertType) {
      this.draftInstitution = data;
      localStorage.setItem('institutionDraft', JSON.stringify(data));
    },
    setCurrentInstitutionId(id: string) {
      this.currentInstitutionId = id;
      localStorage.setItem('currentInstitutionId', id);
    },
    clearDraft() {
      this.draftInstitution = null;
      this.currentInstitutionId = null;
      localStorage.removeItem('institutionDraft');
      localStorage.removeItem('currentInstitutionId');
    },
    loadFromStorage() {
      const draft = localStorage.getItem('institutionDraft');
      const id = localStorage.getItem('currentInstitutionId');
      if (draft) this.draftInstitution = JSON.parse(draft);
      if (id) this.currentInstitutionId = id;
    }
  }
});