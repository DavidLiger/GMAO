import {useEffect, useState} from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import {FaChevronDown, FaChevronUp, FaSort, FaSortDown, FaSortUp} from "react-icons/fa";
import i18n from "../../i18n";
import Filter from "./validation";
import BioPagination from "./bioPagination";


const ReactTable = ({defaultData, columns, showableColumn}) => {
    const [data, setData] = useState(defaultData);
    const [isOpen, setIsOpen] = useState(false);
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
            pagination,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        filterFns: {
            strictEquals: (row, columnId, filterValue) => {
                return row.getValue(columnId) === filterValue;
            },
            dateRange: (row, columnId, filterValue) => {
                if (!filterValue) return true;

                const rowDate = new Date(row.getValue(columnId));
                if (isNaN(rowDate)) return false;

                const min = filterValue.min ? new Date(filterValue.min) : null;
                const max = filterValue.max ? new Date(filterValue.max) : null;

                return (!min || rowDate >= min) && (!max || rowDate <= max);
            }
        },
    });

    useEffect(() => {
        setData(defaultData);
    }, [defaultData]);

    return (
        <div className="p-4 mt-0">
            {showableColumn && (
                <div className="relative">
                    <div className="flex justify-start gap-2">
                        <ResetFiltersButton table={table}/>
                        <button
                            className="px-3 py-1 bg-gray-200 text-sm flex flex-row items-center justify-center gap-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span>{i18n.t("columns")}</span>
                            {isOpen ? <FaChevronDown size={10}/> : <FaChevronUp size={10}/>}
                        </button>
                    </div>
                    {isOpen && (
                        <div
                            className="absolute mt-2  bg-gray-50 border border-gray-300 shadow-lg rounded-lg w-64 z-20">
                            <div className="px-4 py-2 border-b border-gray-200">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        {...{
                                            type: 'checkbox',
                                            checked: table.getIsAllColumnsVisible(),
                                            onChange: table.getToggleAllColumnsVisibilityHandler(),
                                        }}
                                        className="cursor-pointer"
                                    />
                                    <span>{i18n.t("allColumns")}</span>
                                </label>
                            </div>
                            {table.getAllLeafColumns()
                                .filter(column => !column.columnDef.id) // Filtrer les colonnes sans header
                                .map(column => (
                                    <div key={column.id} className="px-4 py-2 border-b border-gray-200">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                {...{
                                                    type: 'checkbox',
                                                    checked: column.getIsVisible(),
                                                    onChange: column.getToggleVisibilityHandler(),
                                                }}
                                                className="cursor-pointer"
                                            />
                                            <span>{column.columnDef.header}</span>
                                        </label>
                                    </div>
                                ))}

                        </div>
                    )}
                </div>
            )}
            <table className="min-w-full table-auto border-collapse">
                <thead className="bg-primary text-white">
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} colSpan={header.colSpan}
                                className="p-2 text-xl text-center border-r border-b border-r-gray-300">
                                {header.isPlaceholder ? null : (
                                    <>
                                        <div
                                            className={`${
                                                header.column.getCanSort() ? 'cursor-pointer select-none' : 'cursor-default'
                                            } w-fit min-w-12 flex-shrink text-base sm:text-sm md:text-md`}
                                            onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                        >
                                            {header.column.columnDef.header}
                                            {header.column.getCanSort() && header.column.getIsSorted() && (
                                                header.column.getIsSorted() === 'asc' ? (
                                                    <FaSortUp className="inline-block ml-2"/>
                                                ) : (
                                                    <FaSortDown className="inline-block ml-2"/>
                                                )
                                            )}
                                            {header.column.getCanSort() && !header.column.getIsSorted() && (
                                                <FaSort className="inline-block ml-2"/>
                                            )}
                                        </div>

                                        {header.column.getCanFilter() && (
                                            <div className="mt-1 text-black">
                                                <Filter column={header.column}/>
                                            </div>
                                        )}
                                    </>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="odd:bg-gray-100 even:bg-white">
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className={`p-2 border`}>
                                {cell.column.columnDef.cell(cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="h-4"/>
            <BioPagination
                currentPage={table.getState().pagination.pageIndex + 1}
                totalPage={table.getPageCount()}
                onPageChange={(page) => table.setPageIndex(page - 1)}
                pageSize={table.getState().pagination.pageSize}
                onPageSizeChange={(pageSize) => table.setPageSize(pageSize)}
            />
        </div>
    );
};

const ResetFiltersButton = ({table}) => {
    return (
        <button
            onClick={() => table.setColumnFilters([])}
            className="px-3 py-1 bg-gray-200 text-sm"
        >
            {i18n.t("resetFilters")}
        </button>
    );
};

export default ReactTable;
