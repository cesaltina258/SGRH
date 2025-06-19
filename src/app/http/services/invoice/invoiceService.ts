import HttpService from "@/app/http/httpService";
import type { InvoiceInsertType, InvoiceResponseType, InvoiceListingType } from "@/components/invoice/types";
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

export default class InvoiceService extends HttpService {

  //get de todas instituicoes para o select box
  async getInvoices(
    page: number = 0,
    size: number = 10000000,
    sortColumn: string = 'createdAt',
    direction: string = 'asc', // Valor padrão alterado para 'asc' conforme seu exemplo
    query_value?: string,
    query_props?: string
  ): Promise<{ content: InvoiceListingType[], meta: any }> {
    try {
      // Construção manual da query string para controle total
      const queryParams = [
        `page=${page}`,
        `size=${size}`,
        `sortColumn=${sortColumn}`, // Apenas o nome da coluna
        `direction=${direction}`    // Direção separada
      ];

      if (query_value && query_props) {
        queryParams.push(`query_props=${encodeURIComponent(query_props)}`);
        queryParams.push(`query_value=${encodeURIComponent(query_value)}`);
      }

      const includesToUse = 'employee,clinic,dependent';
      queryParams.push(`includes=${includesToUse}`);

      const queryString = queryParams.join('&');
      const url = `/amm/invoices?${queryString}`;

      console.log('URL da requisição invoice------------------:', url); // Para debug

      const response = await this.get<ApiResponse<InvoiceListingType[]>>(url);

      console.log('Resposta da requisição:', response); // Para debug

      return {
        content: response.data || [],
        meta: response.meta || []
      };

    } catch (error) {
      console.error("❌ Erro ao buscar facturas:", error);
      throw error;
    }
  }

  //get de todas instituicoes para o select box
  async getInvoicesForDropdown(
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'createdAt',
    direction: string = 'asc', // Valor padrão alterado para 'asc' conforme seu exemplo
    query_value?: string,
    query_props?: string
  ): Promise<{ content: InvoiceListingType[], meta: any }> {
    try {
      // Construção manual da query string para controle total
      const queryParams = [
        `page=${page}`,
        `size=${size}`,
        `sortColumn=${sortColumn}`, // Apenas o nome da coluna
        `direction=${direction}`    // Direção separada
      ];

      if (query_value && query_props) {
        queryParams.push(`query_props=${encodeURIComponent(query_props)}`);
        queryParams.push(`query_value=${encodeURIComponent(query_value)}`);
      }

      const includesToUse = 'institutionType';
      queryParams.push(`includes=${includesToUse}`);

      const queryString = queryParams.join('&');
      const url = `/amm/invoices?${queryString}`;

      console.log('URL da requisição:', url); // Para debug

      const response = await this.get<ApiResponse<InvoiceListingType[]>>(url);

      console.log('Resposta da requisição:', response); // Para debug

      return {
        content: response.data || [],
        meta: response.meta || []
      };

    } catch (error) {
      console.error("❌ Erro ao buscar instituicoes:", error);
      throw error;
    }
  }

  async createInvoice(invoiceData: InvoiceInsertType): Promise<ServiceResponse<InvoiceResponseType>> {
    try {
      const response = await this.post<ApiResponse<InvoiceResponseType>>('/amm/invoices', invoiceData);
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
        error: this.createNetworkErrorResponse()
      };
    }
  }

  private createNetworkErrorResponse(): ApiErrorResponse {
    return {
      status: 'error',
      message: 'Network error',
      error: {
        type: 'ConnectionError',
        title: 'Network Error',
        status: 503,
        detail: 'Could not connect to server',
        instance: '/amm/invoices'
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    };
  }

  async getInvoiceById(id: string): Promise<{ data: InvoiceResponseType }> {
    try {
      const response = await this.get<{ data: InvoiceResponseType; meta: any }>(
        `/amm/invoices/${id}?includes=employee,clinic,currency` 
      );
      console.log('Resposta da requisição de facturas:------------------------', response); 
  
      return {
        data: response.data
      };
    } catch (error) {
      throw this.handleError(error);
    }
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

  async deleteInvoice(id: string): Promise<void> {
    try {
      await this.delete(`/amm/invoices/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar factura:", error);
      throw error;
    }
  }

   async updateInvoice(id: string, invoiceData: InvoiceInsertType): Promise<InvoiceResponseType> {
      try {
  
        // Corpo da requisição conforme especificado
        const payload = {
          invoiceNumber: invoiceData.invoiceNumber,
          issueDate: invoiceData.issueDate,
          dueDate: invoiceData.dueDate,
          totalAmount: invoiceData.totalAmount,
          employee: invoiceData.employee,
          clinic: invoiceData.clinic,
          currency: invoiceData.currency,
          isEmployeeInvoice: invoiceData.isEmployeeInvoice,
          dependent: invoiceData.dependent,
          authorizedBy: invoiceData.authorizedBy,
          invoiceReferenceNumber: invoiceData.authorizedBy
        };

        console.log("payload do update invoice: ", payload);

        const response = await this.put<InvoiceResponseType>(`/amm/invoices/${id}`, payload);
        console.log('response update invoice', response)
        return response;

      } catch (error) {
        console.error("❌ Erro ao actualizar factura:", error);
        throw error;
      }
    }



}
   