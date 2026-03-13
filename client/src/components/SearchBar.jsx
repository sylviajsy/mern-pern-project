import React, { useState } from "react";
import "../scss/SearchBar.scss";

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    start: "",
    end: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.start) params.append("start", filters.start);
    if (filters.end) params.append("end", filters.end);

    onSearch(params.toString());
    setFilters({ start: "", end: "" });
  };

  return (
    <div className="search-section">
      <div className="search-field">
        <label>
          Start Date
          <input
            type="date"
            value={filters.start}
            onChange={(e) =>
              setFilters({ ...filters, start: e.target.value })
            }
          />
        </label>

        <label>
          End Date
          <input
            type="date"
            value={filters.end}
            onChange={(e) =>
              setFilters({ ...filters, end: e.target.value })
            }
          />
        </label>
      </div>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;