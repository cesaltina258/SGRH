import HttpService from "@/app/http/httpService";
import type { LeaveReasonUpdate, LeaveReasonListing, LeaveReasonInsert } from "@/components/baseTables/leaveReason/types";
import { symbolName } from "typescript";

export default class LeaveReasonService extends HttpService {

  //get de todos utilizadores
  async getLeaveReasons(
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'name',
    direction: string = 'asc',
    query_value?: string,
    query_props?: string
  ): Promise<{ content: LeaveReasonListing[], meta: any }> {
    try {
      const queryParams = [
        `page=${page}`,
        `size=${size}`,
        `sortColumn=${sortColumn}`,
        `direction=${direction}`
      ];

      if (query_value && query_props) {
        queryParams.push(`query_props=${encodeURIComponent(query_props)}`);
        queryParams.push(`query_value=${encodeURIComponent(query_value)}`);
      }

      const queryString = queryParams.join('&');
      const url = `/administration/setup/leave-reasons?${queryString}`;

      const response = await this.get(url);

      return {
        content: response.data || [],
        meta: response.meta || {}
      };

    } catch (error) {
      console.error("❌ Erro ao buscar leave-reasons:", error);
      throw error;
    }
  }

  async createLeaveReason(leaveReasonData: LeaveReasonInsert): Promise<LeaveReasonInsert> {
    try {
      const response = await this.post("/administration/setup/leave-reasons", leaveReasonData);
      console.log('response create leave-reasons', response);
      return response;

    } catch (error) {
      console.error("❌ Erro ao criar leave-reasons:", error);
      throw error;
    }
  }

  async updateLeaveReason(id: number, leaveReasonData: LeaveReasonUpdate): Promise<LeaveReasonUpdate> {
    try {
      // Corpo da requisição conforme especificado
      const payload = {
        name: leaveReasonData.name,
        description: leaveReasonData.description,
      };


      const response = await this.put<LeaveReasonListing>(`/administration/setup/leave-reasons/${id}`, payload);
      return response;
    } catch (error) {
      console.error("❌ Erro ao actualizar leave-reasons:", error);
      throw error;
    }
  }

  async deleteLeaveReason(id: number): Promise<void> {
    try {
      await this.delete(`/administration/setup/leave-reasons/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar leave-reasons:", error);
      throw error;
    }
  }

}