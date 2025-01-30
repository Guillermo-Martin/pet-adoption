"use client";
import usePetContext from "@/hooks/usePetContext";
import SearchResultCard from "@/components/SearchResultCard";
import type { Animal } from "@/interfaces/Animal";

function SearchResults() {
  // Get search results from the PetContext
  const { petResults } = usePetContext();
  
  // Render the results in a card
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

  // ---------- Component ----------
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
