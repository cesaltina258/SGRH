import AuthService from "@/app/http/services/authService";
import UserService from "@/app/http/services/userService";
import EmployeeService from "@/app/http/services/employeeService";
import CountryService from "@/app/http/services/baseTables/country/countryService";
import CurrencyService from "@/app/http/services/baseTables/currency/currencyService";
import HospitalProcedureTypeService from "@/app/http/services/baseTables/hospitalProcedureType/hospitalProcedureTypeService";
import InstitutionTypeService from "@/app/http/services/baseTables/institutionTypes/institutionTypeService";
import LeaveReasonService from "@/app/http/services/baseTables/leaveReason/leaveReasonService";
import LanguageService from "@/app/http/services/baseTables/languages/languageService";

// FakeBackendService is used for mocking API responses
import FakeBackendService from "@/app/http/services/fakeBackendService";

const authService = new AuthService();
const userService = new UserService();
const employeeService = new EmployeeService();
const countryService = new CountryService();
const currencyService = new CurrencyService();
const hospitalProcedureTypeService = new HospitalProcedureTypeService();
const institutionTypeService = new InstitutionTypeService();
const leaveReasonService = new LeaveReasonService();
const languageService = new LanguageService();


// FakeBackendService is used for mocking API responses
const fakeBackendService = new FakeBackendService();

export { authService, userService, employeeService, fakeBackendService, countryService, currencyService, hospitalProcedureTypeService, institutionTypeService, leaveReasonService, languageService };
