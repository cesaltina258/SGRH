export type InstitutionListingType = {
    id: string  ;
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    incomeTaxNumber: string;
    institutionType?: {
        id: number;
        name: string
    } | null;
    enable: boolean;

    maxNumberOfDependents: number | null;
    childrenMaxAge: number | null;
    healthPlanLimit: string | null;
    fixedAmount: number | null;
    salaryComponent: string | null;
    companyContributionPercentage: number | null;

    createdAt: Date ;
    updatedAt: Date | null;
    deletedAt: Date | null;
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
};

export type InstitutionResponseType = { 
    id: string  ;
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    description?: string;
    incomeTaxNumber: string;
    institutionType: {
        id: string;
        name: string
    } | undefined ;
    enable: boolean;

    maxNumberOfDependents: number | null;
    childrenMaxAge: number | null;
    healthPlanLimit: string | null;
    fixedAmount: number | null;
    salaryComponent: string | null;
    companyContributionPercentage: number | null;

    createdAt: Date ;
    updatedAt: Date | null;
    deletedAt: Date | null;
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
};

export type InstitutionInsertType = {
    name: string;
    address: string | null;
    phone: string;
    email: string;
    website: string | null;
    description: string | null;
    incomeTaxNumber: string;
    institutionType: string | undefined;

    maxNumberOfDependents: number | null;
    childrenMaxAge: number | null;
    healthPlanLimit: string | undefined;
    fixedAmount: number | null;
    salaryComponent: string | undefined;
    companyContributionPercentage: number | null;
}


export type DepartmentListingType = {
    id: string | number;
    name: string;
    description: string;
    institution: {
        id: string | number;
        name: string;
        description: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        deletedAt: Date | null;
        createdBy: string;
        updatedBy: string;
        deletedBy: string;
    },
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
};

export type PositionListingType = {
    id: string | number;
    name: string;
    description: string;
    department: {
        id: string | number;
        name: string;
        description: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        deletedAt: Date | null;
        createdBy: string;
        updatedBy: string;
        deletedBy: string;
    },
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
};