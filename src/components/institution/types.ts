export type InstitutionListingType = {
    id: string | number;
    name: string;
    description: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
};


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