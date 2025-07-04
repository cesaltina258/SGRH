// services/healthPlanService.ts
import HttpService from "@/app/http/httpService";
import type { HealthPlanListingType, HealthPlanInsertType, CoveragePeriodListingType } from "@/components/institution/types";
import type { ApiErrorResponse } from "@/app/common/types/errorType";

interface ApiResponse<T> {
  data: T;
  meta?: any;
}

interface ServiceResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: ApiErrorResponse;
}

export default class HealthPlanService extends HttpService {

  async getHealthPlans(
    page: number = 0,
    size: number = 100000,
    sortColumn: string = 'createdAt',
    direction: string = 'asc',
    query_value?: string,
    query_props?: string,
    includes: string[] = ['coveragePeriod'] // 👈 adiciona aqui o array
  ): Promise<{ content: HealthPlanListingType[], meta: any }> {
    try {
      const queryParams = [
        `page=${page}`,
        `size=${size}`,
        `sortColumn=${sortColumn}`,
        `direction=${direction}`
      ];

      if (includes.length > 0) {
        queryParams.push(`includes=${includes.join(',')}`);
      }

      if (query_value && query_props) {
        queryParams.push(`query_props=${encodeURIComponent(query_props)}`);
        queryParams.push(`query_value=${encodeURIComponent(query_value)}`);
      }

      const queryString = queryParams.join('&');
      const url = `/administration/company/health-plans?${queryString}`;

      const response = await this.get<ApiResponse<HealthPlanListingType[]>>(url);

      return {
        content: response.data || [],
        meta: response.meta || []
      };

    } catch (error) {
      console.error("❌ Erro ao buscar planos de saúde:", error);
      throw error;
    }
  }



  async getHealthPlanById(id: string): Promise<{ data: HealthPlanListingType }> {
    try {
      const response = await this.get<{ data: HealthPlanListingType }>(
        `/administration/company/health-plans/${id}`
      );
      return {
        data: response.data
      };
    } catch (error) {
      throw error;
    }
  }

  async createHealthPlan(healthPlanData: HealthPlanInsertType): Promise<ServiceResponse<HealthPlanListingType>> {
    try {
      const response = await this.post<ApiResponse<HealthPlanListingType>>(
        '/administration/company/health-plans',
        healthPlanData
      );
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      throw error;
    }
  }

  async updateHealthPlan(id: string, healthPlanData: HealthPlanInsertType): Promise<ServiceResponse<HealthPlanListingType>> {
    try {
      const response = await this.put<ApiResponse<HealthPlanListingType>>(
        `/administration/company/health-plans/${id}`,
        healthPlanData
      );
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      throw error;
    }
  }

  async deleteHealthPlan(id: string): Promise<void> {
    try {
      await this.delete(`/administration/company/health-plans/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar plano de saúde:", error);
      throw error;
    }
  }

  async cloneHealthPlan(healthPlanData: HealthPlanInsertType): Promise<ServiceResponse<HealthPlanListingType>> {
    try {
      const response = await this.post<ApiResponse<HealthPlanListingType>>(
        '/administration/company/health-plans/clone',
        healthPlanData
      );
      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      throw error;
    }
  }

  async getHealthPlansOfCompanyId(
    id: string | null,
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'createdAt',
    direction: string = 'asc',
    query_value?: string,
    query_props?: string,
    includes: string[] = ['coveragePeriod']
  ): Promise<{ content: HealthPlanListingType[], meta: any }> {
    try {
      const queryParams = [
        `id=${id}`,
        `page=${page}`,
        `size=${size}`,
        `sortColumn=${sortColumn}`,
        `direction=${direction}`
      ];

      if (includes.length > 0) {
        queryParams.push(`includes=${includes.join(',')}`);
      }

      if (query_value && query_props) {
        queryParams.push(`query_props=${encodeURIComponent(query_props)}`);
        queryParams.push(`query_value=${encodeURIComponent(query_value)}`);
      }

      const queryString = queryParams.join('&');
      const url = `/administration/company/health-plans/of-company?${queryString}`;

      const response = await this.get<ApiResponse<HealthPlanListingType[]>>(url);

      return {
        content: response.data || [],
        meta: response.meta || []
      };

    } catch (error) {
      console.error("❌ Erro ao buscar planos da empresa:", error);
      throw error;
    }
  }



  async getActiveHealthPlanByCompany(companyId: string): Promise<{ data: HealthPlanListingType }> {
    try {
      const response = await this.get<{ data: HealthPlanListingType }>(
        `/administration/company/health-plans/active-health-plan-by-company/${companyId}`
      );
      return {
        data: response.data
      };
    } catch (error) {
      throw error;
    }
  }


  // GET /api/v1/administration/company/coverage-periods
  async getAllCoveragePeriods(
  ): Promise<{ content: CoveragePeriodListingType[], meta: any }> {
    try {
      const url = `/administration/company/coverage-periods`;

      console.log('URL da requisição getAllCoveragePeriods:', url);

      const response = await this.get<{ data: CoveragePeriodListingType[], meta: any }>(url);

      return {
        content: response.data || [],
        meta: response.meta || {}
      };

    } catch (error) {
      console.error("❌ Erro ao buscar coverage periods:", error);
      throw error;
    }
  }



  private handleErrorResponse(error: any): ServiceResponse<any> {
    if (error.response) {
      return {
        status: 'error',
        error: {
          ...error.response.data,
          statusCode: error.response.status
        } as ApiErrorResponse
      };
    }
    return {
      status: 'error',
      error: this.NetworkErrorResponse()
    };
  }

  private NetworkErrorResponse(): ApiErrorResponse {
    return {
      status: 'error',
      message: 'Network error',
      error: {
        type: 'ConnectionError',
        title: 'Network Error',
        status: 503,
        detail: 'Could not connect to server',
        instance: 'administration/company/health-plans'
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  private handleError(error: any) {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Erro na requisição',
        details: error.response.data?.errors || null,
        status: error.response.status
      };
    }
    return {
      message: 'Erro de conexão',
      details: null
    };
  }
}
