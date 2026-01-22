import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpFromLine, Loader } from "lucide-react";
import Link from "next/link";
import { IconButton } from "nucleo-glass";
import Skeleton from "../docs/Skeleton";
import { TableDetails } from "../../types/Types";

export default function Table({
    columns = [],
    data = [],
    isLoading,
    actions = [],
    sortConfig = { key: null, direction: null },
    onSort,
    emptyState,
    onRowClick,
    className
}: TableDetails) {

    const handleSort = (key: any) => {
        if (onSort) {
            onSort(key);
        }
    };


    return (
        <section className={cn("w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm", className)}>
            <div className="w-full">
                <div className="min-w-full text-sm" aria-label="customized table">
                    <div className="bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center overflow-auto bg-neutral-100">
                            {columns.map((col) => (
                                <div
                                    key={col.key}
                                    className={cn(
                                        "px-4 py-3 font-semibold text-gray-700 select-none",
                                        col.className
                                    )}

                                >
                                    <div
                                        className={cn(
                                            "flex items-center gap-1",
                                            col.sortable && "cursor-pointer",
                                            col.align === 'right' && "justify-end",
                                            col.align === 'center' && "justify-center"
                                        )}
                                        onClick={() => col.sortable && handleSort(col.key)}
                                    >
                                        {col.label}
                                        {col.sortable && (
                                            <span className="flex items-center text-gray-400">
                                                {sortConfig.key === col.key ? (
                                                    sortConfig.direction === "asc" ? (
                                                        <ArrowUp fontSize="small" className="text-blue-600 w-4 h-4 ml-1" />
                                                    ) : (
                                                        <ArrowDown fontSize="small" className="text-blue-600 w-4 h-4 ml-1" />
                                                    )
                                                ) : (
                                                    <div className="w-4 h-4 ml-1" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {actions.length > 0 && (
                                <div className="px-4 py-3 font-semibold text-gray-700 w-[1%] whitespace-nowrap">
                                    Actions
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        {isLoading ? (
                            [...Array(5)].map((_, index) => (
                                <div key={`skeleton-${index}`} className="border-b border-gray-100 last:border-0">
                                    {columns.map((col, colIndex) => (
                                        <div key={colIndex} className="px-4 py-3">
                                            <Skeleton variant="text" width="80%" height={24} />
                                        </div>
                                    ))}
                                    {actions.length > 0 && (
                                        <div className="px-4 py-3">
                                            <Skeleton variant="rectangular" width={60} height={30} className="rounded ml-auto" />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <div
                                    key={rowIndex}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={cn(
                                        "border-b border-gray-100 last:border-0 transition-colors",
                                        onRowClick && "cursor-pointer hover:bg-blue-50/50"
                                    )}
                                >
                                    {columns.map((col) => {
                                        const cellValue = row[col.key];
                                        let displayValue = cellValue;


                                        if (col.key === 'created_at' && cellValue) {
                                            displayValue = cellValue.length > 10 ? cellValue.slice(0, 4) : cellValue;
                                        }

                                        if (col.render) {
                                            displayValue = col.render(cellValue, row);
                                        }

                                        if (displayValue === undefined || displayValue === null || displayValue === "") {
                                            displayValue = "-";
                                        }

                                        return (
                                            <div
                                                key={col.key}
                                                className={cn("px-4 py-3", col.cellClassName)}
                                            >
                                                {displayValue}
                                            </div>
                                        );
                                    })}
                                    {actions.length > 0 && (
                                        <div className="px-4 py-2">
                                            <div className="flex items-center justify-end gap-2">
                                                {actions.map((action, actionIndex) => {
                                                    const isDisabled = action.disabled ? action.disabled(row) : false;
                                                    const ActionIcon = action.icon;

                                                    const linkPath = typeof action.link === 'function'
                                                        ? action.link(row)
                                                        : action.link;
                                                    const divTitle = typeof action.div === 'function'
                                                        ? action.div(row)
                                                        : (action.div || action.label || '');

                                                    return (
                                                        <div key={actionIndex} title={divTitle}>
                                                            {linkPath ? (
                                                                <Link href={linkPath}>
                                                                    <span>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                action.onClick?.(row);
                                                                            }}
                                                                            color={action.color || "default"}
                                                                            className={cn(
                                                                                isDisabled && "opacity-50 cursor-not-allowed",
                                                                                !isDisabled && "hover:bg-gray-100"
                                                                            )}
                                                                        >
                                                                            {ActionIcon ? <ActionIcon size={16} className="text-black" /> : <ArrowUpFromLine size={16} className="text-black" />}
                                                                        </IconButton>
                                                                    </span>
                                                                </Link>
                                                            ) : (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        action.onClick?.(row);
                                                                    }}
                                                                    color={action.color || "default"}
                                                                    className={cn(
                                                                        isDisabled && "opacity-50 cursor-not-allowed",
                                                                        !isDisabled && "hover:bg-gray-100"
                                                                    )}
                                                                >
                                                                    {ActionIcon ? <ActionIcon size={16} className="text-black" /> : <ArrowUpFromLine size={16} className="text-black" />}
                                                                </IconButton>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div>
                                <div
                                    className="h-24 text-gray-500 flex justify-center items-center"
                                >
                                    {emptyState || (
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader size={16} />
                                            Loading...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}