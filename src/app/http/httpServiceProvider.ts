import AuthService from "@/app/http/services/authService";
import UserService from "@/app/http/services/userService";
import EmployeeService from "@/app/http/services/employeeService";
import CountryService from "@/app/http/services/baseTables/country/countryService";

// FakeBackendService is used for mocking API responses
import FakeBackendService from "@/app/http/services/fakeBackendService";

const authService = new AuthService();
const userService = new UserService();
const employeeService = new EmployeeService();
const countryService = new CountryService();

// FakeBackendService is used for mocking API responses
const fakeBackendService = new FakeBackendService();

export { authService, userService, employeeService, fakeBackendService, countryService};
