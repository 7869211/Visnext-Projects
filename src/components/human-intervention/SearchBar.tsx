import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";


interface SearchBarProps {
  handleSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ handleSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    handleSearch(event.target.value);
  };

  return (
    <div className="flex items-center gap-2.5 self-stretch p-2.5 h-[44px] rounded-md border border-[#cbd2e0] bg-white">
       <LuSearch  className="text-[#8c268c]"/>

      <input
        type="text"
        className="flex-1 outline-none bg-transparent text-[#4A5468] placeholder-[#4A5468] text-sm font-medium"
        placeholder="Search Issues"
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
