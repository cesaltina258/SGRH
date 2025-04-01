import AuthService from "@/app/http/services/authService";
import UserService from "@/app/http/services/userService";
import FakeBackendService from "@/app/http/services/fakeBackendService";

const authService = new AuthService();
const userService = new UserService();
const fakeBackendService = new FakeBackendService();

export { authService, userService, fakeBackendService };
