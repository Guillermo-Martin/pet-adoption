"use client";
import usePetContext from "@/hooks/usePetContext";
import SearchResultCard from "@/components/SearchResultCard";
import type { Animal } from "@/interfaces/Animal";
import Layout from "./../../components/Layout";


function SearchResults() {
  // Get search results from PetContext
  const { petResults } = usePetContext();

  console.log("PET RESULTS IN SEARCH RESULTS, ", petResults);

  // Function to render search results
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
    <>
      { 
        // if "petResults" is null (will be null while data is retrieved from localStorage), render a loading screen
        (petResults === null)
          ? 
            <main className="flex justify-center items-center min-h-screen flex-col">
              <p>Image goes here</p>
              <h1>Loading</h1>
            </main>
          :
            // if "petResults" exists, see if there are any results available.  if not, render a "found nothing" screen
            (petResults.searchResults.length === 0 || petResults.status !== 200)
            ? 
              <main className="flex justify-center items-center min-h-screen flex-col">
                <p>Image goes here</p>
                <h1>Hmm...something went wrong</h1>
              </main>
            :
              // if search results are available, render them
              <Layout>
                <div className="main-content text-[#422206]">
                  <h1 className="text-5xl lg:text-7xl 2xl:text-8xl font-bold mb-4">Results for <span className="italic">{petResults?.animal}</span> near <span className="italic">{petResults?.zipcode}</span></h1>

                  <hr className="mb-20 border-t-[6px] border-t-[#422206]" />

                  <div className="flex flex-wrap flex-col sm:flex-row justify-center items-center sm:items-stretch gap-[16px]">
                    {renderedSearchResults}
                  </div>
                </div>
              </Layout>
      }
    </>
  );
};

export default SearchResults;
