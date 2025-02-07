"use client";
import { useState } from "react";
import usePetContext from "@/hooks/usePetContext";
import SearchResultCard from "@/components/SearchResultCard";
import type { Animal } from "@/interfaces/Animal";

function SearchResults() {
  // Get search results from the PetContext
  const { petResults } = usePetContext();
  console.log("in search results", petResults);

  
  const renderedSearchResults = petResults?.searchResults.map((result: Animal) => {
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

  
  

  // ---------- Component ----------
  return (
    <div>
      <h1>Search results page</h1>

      <div className="flex flex-wrap">
        {petResults?.status === 500 ? "something went wrong" : renderedSearchResults}
      </div>
    </div>
  );
};

export default SearchResults;
