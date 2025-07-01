// services/coveragePeriodService.ts
import HttpService from "@/app/http/httpService";
import type { ApiErrorResponse } from "@/app/common/types/errorType";
import type { CoveragePeriodListingType, CoveragePeriodInsertType, CoveragePeriodUpdateType } from "@/components/institution/types"; // Adjust the path as needed

interface ApiResponse<T> {
    data: T;
    meta?: any;
}

interface ServiceResponse<T> {
    status: 'success' | 'error';
    data?: T;
    error?: ApiErrorResponse;
}

export default class CoveragePeriodService extends HttpService {

    // GET /api/v1/administration/company/coverage-periods
    async getAllCoveragePeriods(
        id: string | null,
        page: number = 0,
        size: number = 10000000,
        sortColumn: string = 'createdAt',
        direction: string = 'asc',
        query_value?: string,
        query_props?: string
    ): Promise<{ content: CoveragePeriodListingType[], meta: any }> {
        try {
            const queryParams = [
                `id=${id}`,
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
            const url = `/administration/company/coverage-periods/of-company?${queryString}`;

            console.log('URL da requisição:', url);
            const response = await this.get<ApiResponse<CoveragePeriodListingType[]>>(url);

            return {
                content: response.data || [],
                meta: response.meta || {}
            };

        } catch (error) {
            console.error("❌ Erro ao buscar períodos de cobertura:", error);
            throw error;
        }
    }

    // GET /api/v1/administration/company/coverage-periods/{id}
    async getCoveragePeriodById(id: string): Promise<{ data: CoveragePeriodListingType }> {
        try {
            const response = await this.get<{ data: CoveragePeriodListingType; meta: any }>(
                `/administration/company/coverage-periods/${id}`
            );
            console.log('Resposta da requisição getCoveragePeriodById:------------------------', response);

            return {
                data: response.data
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // POST /api/v1/administration/company/coverage-periods
    async createCoveragePeriod(coveragePeriodData: CoveragePeriodInsertType): Promise<ServiceResponse<CoveragePeriodListingType>> {
        try {
            const response = await this.post<ApiResponse<CoveragePeriodListingType>>('/administration/company/coverage-periods', coveragePeriodData);
            return {
                status: 'success',
                data: response.data
            };
        } catch (error: any) {
            throw error;
        }
    }

    // PUT /api/v1/administration/company/coverage-periods/{id}
    async updateCoveragePeriod(id: string, coveragePeriodData: CoveragePeriodUpdateType): Promise<CoveragePeriodListingType> {
        try {
            const response = await this.put<CoveragePeriodListingType>(`/administration/company/coverage-periods/${id}`, coveragePeriodData);
            console.log('response update coverage period', response);
            return response;
        } catch (error) {
            console.error("❌ Erro ao atualizar período de cobertura:", error);
            throw error;
        }
    }

    // DELETE /api/v1/administration/company/coverage-periods/{id}
    async deleteCoveragePeriod(id: string): Promise<void> {
        try {
            await this.delete(`/administration/company/coverage-periods/${id}`);
        } catch (error) {
            console.error("❌ Erro ao deletar período de cobertura:", error);
            throw error;
        }
    }

    // PUT /api/v1/administration/company/coverage-periods/{id}/start
    async startCoveragePeriod(id: string): Promise<ServiceResponse<CoveragePeriodListingType>> {
        try {
            // Assuming the 'start' endpoint might return the updated coverage period
            const response = await this.put<ApiResponse<CoveragePeriodListingType>>(`/administration/company/coverage-periods/${id}/start`, {}); // Empty body if no data is needed

            console.log('Resposta startCoveragePeriod:------------------------', response);

            return {
                status: 'success',
                data: response.data
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // PUT /api/v1/administration/company/coverage-periods/{id}/close
    async closeCoveragePeriod(id: string): Promise<ServiceResponse<CoveragePeriodListingType>> {
        try {
            // Assuming the 'close' endpoint might return the updated coverage period
            const response = await this.put<ApiResponse<CoveragePeriodListingType>>(`/administration/company/coverage-periods/${id}/close`, {}); // Empty body if no data is needed
            return {
                status: 'success',
                data: response.data
            };
        } catch (error: any) {
            if (error.response) {
                return {
                    status: 'error',
                    error: error.response.data as ApiErrorResponse
                };
            }
            return {
                status: 'error',
                error: this.NetworkErrorResponse()
            };
        }
    }

    // GET /api/v1/administration/company/coverage-periods/running-period-by-company/{companyId}
    async getRunningCoveragePeriodByCompany(companyId: string): Promise<{ data: CoveragePeriodListingType }> {
        try {
            const response = await this.get<{ data: CoveragePeriodListingType; meta: any }>(
                `/administration/company/coverage-periods/running-period-by-company/${companyId}`
            );
            console.log('Resposta da requisição getRunningCoveragePeriodByCompany:------------------------', response);

            return {
                data: response.data
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // GET /api/v1/administration/company/coverage-periods/of-company
    async getCoveragePeriodsOfCurrentCompany(
        page: number = 0,
        size: number = 10000000,
        sortColumn: string = 'createdAt',
        direction: string = 'asc',
        query_value?: string,
        query_props?: string
    ): Promise<{ content: CoveragePeriodListingType[], meta: any }> {
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
            const url = `/administration/company/coverage-periods/of-company?${queryString}`;

            console.log('URL da requisição (getCoveragePeriodsOfCurrentCompany):', url);
            const response = await this.get<ApiResponse<CoveragePeriodListingType[]>>(url);

            return {
                content: response.data || [],
                meta: response.meta || {}
            };

        } catch (error) {
            console.error("❌ Erro ao buscar períodos de cobertura da empresa atual:", error);
            throw error;
        }
    }

    // Helper methods (copied from your example)
    private NetworkErrorResponse(): ApiErrorResponse {
        return {
            status: 'error',
            message: 'Network error',
            error: {
                type: 'ConnectionError',
                title: 'Network Error',
                status: 503,
                detail: 'Could not connect to server',
                instance: '/administration/companies' // Adjust instance if needed
            },
            meta: {
                timestamp: new Date().toISOString()
            }
        };
    }

    handleError(error: any) {
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