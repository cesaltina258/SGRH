import HttpService from "@/app/http/httpService";
import type { UserInsertType, UserListingType, UserUpdateType } from "@/components/users/types";

export default class UserService extends HttpService {

  //get de todos utilizadores
  async getUsers(): Promise<UserListingType[]> {
    try {
      const response = await this.get("/administration/users/");
      //console.log('response users',response);
      return response.data;

    } catch (error) {
      console.error("❌ Erro ao buscar utilizador:", error);
      throw error; 
    }
  }

  async createUser(userData: UserInsertType): Promise<UserInsertType> {
    try {
      const response = await this.post("/administration/users/", userData);
      console.log('response create user',response);
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
