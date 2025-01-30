"use client";

import { useContext } from "react";
import PetContext from "@/context/PetContext";

function SearchResults() {
  const data = useContext(PetContext);
  // const {petResults} = useContext(PetContext);
  console.log(data?.petResults);

  return (
    <div>
      <h1>Search results page</h1>
      {/* <h2>{data}</h2> */}
    </div>
  );
};

export default SearchResults;

