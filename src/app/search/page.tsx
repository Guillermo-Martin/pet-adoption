"use client";
import usePetContext from "@/hooks/usePetContext";
import SearchResultCard from "@/components/SearchResultCard";
import type { Animal } from "@/interfaces/Animal";
import Layout from "./../../components/Layout";

function SearchResults() {
  // Get search results from the PetContext
  const { petResults } = usePetContext();
  console.log("in search results", petResults);

  // check for preventing hydration error
  if(petResults === null) {
    return <div>No pets found.</div>
  };

  // render search results
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
    <Layout>
      <div className="main-content text-[#422206]">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-4">Results for <span className="italic">{petResults?.animal}</span> near <span className="italic">{petResults?.zipcode}</span></h1>

        <hr className="mb-20 border-t-[6px] border-t-[#422206]" />

        <div className="flex flex-wrap justify-center gap-[16px]">
          {petResults?.status === 500 ? "something went wrong" : renderedSearchResults}
        </div>
      </div>
    </Layout>
  );
};

export default SearchResults;
