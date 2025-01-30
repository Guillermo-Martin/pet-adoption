"use client";

import { useContext } from "react";
import PetContext from "@/context/PetContext";

function SearchResults() {
  const data = useContext(PetContext);
  console.log(data);

  return (
    <div>
      <h1>Search results page</h1>
      {/* <h2>{data}</h2> */}
    </div>
  );
};

export default SearchResults;

