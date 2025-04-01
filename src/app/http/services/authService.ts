import axiosInstance from "@/app/http/axios";
import { useAuthStore } from "@/store/authStore";
import { getAccessToken, setAccessToken, clearTokens } from "@/app/localStorage";

class AuthService {

    async login(username: string, password: string) {
        try {
          const response = await axiosInstance.post("/user/login", { username, password });
    
          //console.log("🔍 Resposta do login:", response);
    
          // ✅ Garante que a resposta e os dados existem antes de acessá-los
          if (!response || !response.data || !response.data.data) {
            throw new Error("Resposta inválida da API: Dados ausentes");
          }
    
          const accessToken = response.data.data.access_token;
    
          if (!accessToken) {
            throw new Error("Resposta inválida da API: Access token ausente");
          }
    
          setAccessToken(accessToken);
    
          //console.log("🔑 Token salvo:", accessToken);
    
          const authStore = useAuthStore(); 
          authStore.setToken(accessToken);
    
          //console.log("✅ Token salvo no Pinia");
    
          // ✅ Buscar perfil do usuário após login
          const userProfile = await this.getUserProfile();
          authStore.setUser(userProfile);
    
          //console.log("👤 Perfil do usuário salvo:", userProfile);
    
          return response.data.data;
    
        } catch (error: any) {
          console.error("❌ Erro no login:", error.message || error);
          throw error;
        }
      }

    async getUserProfile() {
        try {
            const response = await axiosInstance.get("/user/get-user-profile");
            //console.log("👤 Perfil do usuário:", response.data);
            return response.data.data;

        } catch (error) {
            console.error("❌ Erro ao buscar perfil do usuário:", error);
            throw error;
        }
    }

    async refreshToken(refreshToken: string) {
        try {
            const response = await axiosInstance.post("/auth/refresh-token", { refreshToken });
            const authStore = useAuthStore();

            authStore.setToken(response.data.accessToken);
            setAccessToken(response.data.accessToken);

            return response.data;
            
        } catch (error) {
            console.error("Erro ao renovar token:", error);
            throw error;
        }
    }

    async logout() {
        try {
            await axiosInstance.post("/user/logout");
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        } finally {
            const authStore = useAuthStore();
            authStore.clearUserData();
            clearTokens();
        }
    }

}

export default AuthService;
