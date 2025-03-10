import i18n from "@/../i18n";
import Select from "react-select";
import {BiChevronLeft, BiChevronRight, BiFirstPage, BiLastPage} from "react-icons/bi";

const pageSizeOptions = [15, 30, 45, 60].map(pageSize => ({
    value: pageSize,
    label: i18n.t("showEntries", {pageSize}),
}));


const BioPagination = ({currentPage, totalPage, totalItems, onPageChange, pageSize, onPageSizeChange}) => {

    const pageCount = totalPage ?? Math.max(Math.ceil(totalItems / pageSize), 1)

    return (
        <div className="flex items-center gap-2">
            <button
                className="border rounded p-1 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onPageChange(1)}
                disabled={currentPage <= 1}
            >
                <BiFirstPage/>
            </button>
            <button
                className="border rounded p-1 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <BiChevronLeft/>
            </button>
            <button
                className="border rounded p-1 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= pageCount}
            >
                <BiChevronRight/>
            </button>
            <button
                className="border rounded p-1 hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => onPageChange(pageCount)}
                disabled={currentPage >= pageCount}
            >
                <BiLastPage/>
            </button>
            <span className="flex items-center gap-1">
                    {i18n.t('pageOf', {
                        currentPage: currentPage,
                        maxPage: Math.max(pageCount, 1),
                    })}
                </span>
            <span className="flex items-center gap-1 before:content-['|']">
                    {i18n.t("goToPage")}
                <input
                    type="number"
                    min="1"
                    max={pageCount}
                    defaultValue={currentPage}
                    onChange={e => {
                        const page = Math.min(
                            Math.max(
                                e.target.value ? Number(e.target.value) - 1 : 0,
                                0
                            ),
                            pageCount
                        );
                        onPageChange(page);
                    }}
                    className="border p-1 rounded w-16"
                />
                </span>
            <Select
                value={{
                    value: pageSize,
                    label: i18n.t("showEntries", {pageSize: pageSize}),
                }}
                onChange={o => {
                    if (o) {
                        onPageSizeChange(Number(o.value));
                    }
                }}
                options={pageSizeOptions}
            />
        </div>
    )
}

export default BioPagination;