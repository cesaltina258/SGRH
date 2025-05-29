
import AuthService from "@/app/http/services/authService";
import UserService from "@/app/http/services/userService";
import EmployeeService from "@/app/http/services/employeeService";
import InstitutionService from "@/app/http/services/institution/institutionService";
import DepartmentService from "@/app/http/services/institution/departmentService";
import PositionService from "@/app/http/services/institution/positionService";
import ContactPersonService from "@/app/http/services/institution/contactPersonService";

//BASETABLES
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
const institutionService = new InstitutionService();
const departmentService = new DepartmentService();
const positionService = new PositionService();
const contactPersonService = new ContactPersonService();

//BASETABLES
const countryService = new CountryService();
const currencyService = new CurrencyService();
const hospitalProcedureTypeService = new HospitalProcedureTypeService();
const institutionTypeService = new InstitutionTypeService();
const leaveReasonService = new LeaveReasonService();
const languageService = new LanguageService();

// FakeBackendService is used for mocking API responses
const fakeBackendService = new FakeBackendService();

export {
    authService,
    userService, 
    employeeService, 
    fakeBackendService, 
    countryService, 
    currencyService, 
    hospitalProcedureTypeService, 
    institutionTypeService, 
    leaveReasonService, 
    languageService, 
    institutionService, 
    departmentService, 
    positionService,
    contactPersonService
};
