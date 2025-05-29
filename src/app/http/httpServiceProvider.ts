
import AuthService from "@/app/http/services/authService";
import UserService from "@/app/http/services/userService";
import EmployeeService from "@/app/http/services/employeeService";
import InstitutionService from "@/app/http/services/institution/institutionService";
import DepartmentService from "@/app/http/services/institution/departmentService";
import PositionService from "@/app/http/services/institution/positionService";

//BASETABLES
import CountryService from "@/app/http/services/baseTables/country/countryService";
import ProvinceService from "@/app/http/services/baseTables/country/provinceService";
import InstitutionTypeService from "@/app/http/services/baseTables/institutionType/institutionTypeService";

// FakeBackendService is used for mocking API responses
import FakeBackendService from "@/app/http/services/fakeBackendService";

const authService = new AuthService();
const userService = new UserService();
const employeeService = new EmployeeService();
const institutionService = new InstitutionService();
const departmentService = new DepartmentService();
const positionService = new PositionService();

//BASETABLES
const countryService = new CountryService();
const provinceService = new ProvinceService();
const institutionTypeService = new InstitutionTypeService ();

// FakeBackendService is used for mocking API responses
const fakeBackendService = new FakeBackendService();

export { authService, userService, employeeService, fakeBackendService, countryService, provinceService, institutionService, departmentService, positionService, institutionTypeService };
