import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const SearchInput = ({ onSearch }) => {
    const [query, setQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск..."
            className="search-input"
        />
    );
};

export default SearchInput;
