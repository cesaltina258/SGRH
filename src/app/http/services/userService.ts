import HttpService from "@/app/http/httpService";
import type { UserType } from "@/app/http/types";

export default class UserService extends HttpService {
  // Obtém os dados do usuário logado
  async getUserProfile(): Promise<UserType> {
    return this.get<UserType>("/users/me");
  }

  // Atualiza o perfil do usuário
  async updateUserProfile(userData: Partial<UserType>): Promise<UserType> {
    return this.post<UserType>("/users/update", userData);
  }

  // Obtém uma lista de usuários (para admin, por exemplo)
  async getUsers(): Promise<UserType[]> {
    return this.get<UserType[]>("/users");
  }
}
