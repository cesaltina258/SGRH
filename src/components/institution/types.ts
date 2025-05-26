export type InstitutionListingType = {
    id: string | number;
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    incomeTaxNumber: string;
    institutionType: string | null;
    enable: string;

    maxNumberOfDependents: number | null;
    childrenMaxAge: number | null;
    healthPlanLimit: string | null;
    fixedAmount: number | null;
    salaryComponent: string | null;
    companyContributionPercentage: number | null;

    createdAt: Date | null;
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
    institutionType: string | null;

    maxNumberOfDependents: number | null;
    childrenMaxAge: number | null;
    healthPlanLimit: string | null;
    fixedAmount: number | null;
    salaryComponent: string | null;
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