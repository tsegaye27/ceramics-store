import React from "react";

const SearchBar = () => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search Ceramics..."
        className="bg-gray-100 outline-none text-gray-500 shadow-md py-[0.4rem] pl-5 w-[13rem] rounded-l-2xl"
      />
      <button className="bg-gray-700 text-white px-[0.85rem] p-[0.5rem] mx-[-1rem] shadow-md rounded-3xl">
        &#8594;
      </button>
    </div>
  );
};

export default SearchBar;
