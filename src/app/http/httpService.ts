import axios from "@/app/http/axios";

export default class HttpService {
  async get<T>(path: string): Promise<T> {
    try {
      const response = await axios.get<T>(path);
      return response.data;
    } catch (error: any) {
      console.error("Erro no GET:", error);
      throw error;
    }
  }

  async post<T>(path: string, payload: Record<string, any>): Promise<T> {
    try {
      const response = await axios.post<T>(path, payload);
      return response.data;
    } catch (error: any) {
      console.error("Erro no POST:", error);
      throw error;
    }
  }
}
