"use client";
import { useContext } from "react";
import PetContext from "@/context/PetContext";
import SearchResultCard from "@/components/SearchResultCard";
import type { Animal } from "@/interfaces/Animal";

function SearchResults() {
  // get access to the "PetContext"
  const petContext = useContext(PetContext);

  if(!petContext) {
    throw new Error("PetContext must be used within a provider.");
  };

  const {petResults} = petContext;
  
  const renderedSearchResults = petResults.map((result: Animal) => {
    return (
      <SearchResultCard 
        key={result.id}
        id={result.id}
        name={result.name}
        age={result.age}
        breed={result.breeds.primary}
        city={result.contact.address.city}
        gender={result.gender}
        photo={result.primary_photo_cropped ? result.primary_photo_cropped.full : null}
      />
    );
  });

  return (
    <div>
      <h1>Search results page</h1>

      <div className="flex flex-wrap">
        {renderedSearchResults}
      </div>
    </div>
  );
};

export default SearchResults;
