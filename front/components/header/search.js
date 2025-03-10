import {useEffect, useState} from "react";
import {Popover, TextInput} from "flowbite-react";
import {FaSearch} from "react-icons/fa";
import BioButton from "../button/BioButton";
import i18n from "../../i18n";

const Search = () => {
    const [pages, setPages] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        fetch("/json/pages.json")
            .then(res => res.json())
            .then((result) => {
                setPages(result);
            });
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredResults([]);
        } else {
            setFilteredResults(
                pages.filter(item =>
                    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.link.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, pages]);

    return (
        <Popover
            aria-labelledby="search-popover"
            content={
                <div className="w-64 group p-2">
                    <TextInput
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="search"
                        name="search"
                        placeholder={i18n.t("searchPlaceholder")}
                    />
                    <div className="space-y-2">
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item, index) => (
                                <div key={index} className="p-1 rounded hover:bg-gray-300 dark:hover:bg-muted-900">
                                    <a href={item.link}>
                                        {item.label}
                                        <div className="text-muted-300 text-xs pl-4">{item.link}</div>
                                    </a>
                                </div>
                            ))
                        ) : (
                            <span className="text-xs">{i18n.t("noResultsFound")}</span>
                        )}
                    </div>
                </div>
            }
        >
            <BioButton
                color={"gray"}
                className="rounded-full transition-all duration-300"
            >
                <FaSearch size={24} className={"text-gray-600"}/>
            </BioButton>
        </Popover>
    );
};

export default Search;
