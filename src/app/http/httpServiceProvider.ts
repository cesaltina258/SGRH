import AuthService from "@/app/http/services/authService";
import UserService from "@/app/http/services/userService";
import EmployeeService from "@/app/http/services/employeeService";
import InstitutionService from "@/app/http/services/institution/institutionService";
import DepartmentService from "@/app/http/services/institution/departmentService";
import PositionService from "@/app/http/services/institution/positionService";
import CountryService from "@/app/http/services/baseTables/country/countryService";
import ProvinceService from "@/app/http/services/baseTables/country/provinceService";

// FakeBackendService is used for mocking API responses
import FakeBackendService from "@/app/http/services/fakeBackendService";

const authService = new AuthService();
const userService = new UserService();
const employeeService = new EmployeeService();
const institutionService = new InstitutionService();
const departmentService = new DepartmentService();
const countryService = new CountryService();
const provinceService = new ProvinceService();
const positionService = new PositionService();

// FakeBackendService is used for mocking API responses
const fakeBackendService = new FakeBackendService();

export { authService, userService, employeeService, fakeBackendService, countryService, provinceService, institutionService, departmentService, positionService };
