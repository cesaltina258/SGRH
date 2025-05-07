import AuthService from "@/app/http/services/authService";
import UserService from "@/app/http/services/userService";
import EmployeeService from "@/app/http/services/employeeService";
import CountryService from "@/app/http/services/baseTables/countryService";
import ProvinceService from "@/app/http/services/baseTables/provinceService";

// FakeBackendService is used for mocking API responses
import FakeBackendService from "@/app/http/services/fakeBackendService";

const authService = new AuthService();
const userService = new UserService();
const employeeService = new EmployeeService();
const countryService = new CountryService();
const provinceService = new ProvinceService();
// Exporting the services for use in the application

// FakeBackendService is used for mocking API responses
const fakeBackendService = new FakeBackendService();

export { authService, userService, employeeService, countryService, provinceService, fakeBackendService };
