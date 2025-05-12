import HttpService from "@/app/http/httpService";
import type { UserInsertType, UserListingType, UserUpdateType } from "@/components/users/types";

export default class UserService extends HttpService {

  //get de todos utilizadores
  async getUsers(
    page: number = 0,
    size: number = 10,
    sortColumn: string = 'createdAt',
    direction: string = 'asc', // Valor padrão alterado para 'asc' conforme seu exemplo
    query_value?: string,
    query_props?: string
  ): Promise<{ content: UserListingType[], meta: any }> {
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

      const queryString = queryParams.join('&');
      const url = `/administration/users?${queryString}`;

      console.log('URL da requisição:', url); // Para debug

      const response = await this.get(url);

      console.log('Resposta da requisição user:', response); // Para debug

      return {
        content: response.data || [],
        meta: response.meta || []
      };

    } catch (error) {
      console.error("❌ Erro ao buscar colaboradores:", error);
      throw error;
    }
  }

  async createUser(userData: UserInsertType): Promise<UserInsertType> {
    try {
      const response = await this.post("/administration/users", userData);
      console.log('response create user', response);
      return response; // Retorna os dados do utilizador criado

    } catch (error) {
      console.error("❌ Erro ao criar utilizador:", error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.delete(`/administration/users/${id}`);
    } catch (error) {
      console.error("❌ Erro ao deletar utilizador:", error);
      throw error;
    }
  }

  async updateUser(id: number, userData: UserUpdateType): Promise<UserListingType> {
    try {
      // Corpo da requisição conforme especificado
      const payload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username
      };

      const response = await this.put<UserListingType>(`/administration/users/${id}`, payload);
      return response;
    } catch (error) {
      console.error("❌ Erro ao actualizar utilizador:", error);
      throw error;
    }
  }

}
