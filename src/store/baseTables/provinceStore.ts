// stores/userStore.ts
import { defineStore } from 'pinia';
import { provinceService } from "@/app/http/httpServiceProvider";
import type { ProvinceListingType } from '@/components/baseTables/province/types';

export const useProvinceStore = defineStore('provinces', {
  state: () => ({
    provinces: [] as ProvinceListingType[],
    error: null as string | null,
  }),
  actions: {
    async fetchProvinces() {
      this.error = null;
      try {
        const data = await provinceService.getProvinces();
        console.log('response store provinces', data);
        this.provinces = data;
        //localStorage.setItem("list-users", JSON.stringify(this.users));
      } catch (err: any) {
        this.error = err.message || 'Erro ao buscar províncias';
        console.error("❌ Erro ao buscar províncias:", err);
      }
    },
  },
});
  