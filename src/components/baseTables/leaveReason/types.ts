export type LeaveReasonInsert = {
    id: string;
    name: string;
    description: string;
  };
  
  export type LeaveReasonListing = {
    id: string;
    name: string;
    description: string;
  };
  
  export type LeaveReasonUpdate = {
    name: string;
    description: string;
  };

  export type LeaveReasonResponse = {
    id: string;
    name: string;
    description: string;
  };

  export type LeaveReasonOption = {
    page: number;
    itemsPerPage: number;
    sortBy: { key: string; order: 'asc' | 'desc' }[];
    search: string;
  };
  