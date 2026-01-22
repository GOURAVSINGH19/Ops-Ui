export interface SkeletonDetails {
    variant: string,
    width?: string | number,
    height?: string | number,
    className?: string
}

export interface TableDetails {
    columns?: any[];
    data?: any[];
    isLoading?: boolean;
    actions?: any[];
    sortConfig?: {
        key: string | null;
        direction: string | null;
    };
    onSort?: (key: string) => void;
    emptyState?: string;
    onRowClick?: (row: any) => void;
    className?: string;
}

