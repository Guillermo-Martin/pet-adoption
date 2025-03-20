"use client";
import usePetContext from "@/hooks/usePetContext";
import SearchResultCard from "@/components/SearchResultCard";
import LoadingScreen from "@/components/LoadingScreen";
import Layout from "@/components/Layout";
import type { Animal } from "@/interfaces/Animal";


function SearchResults() {
  // Get search results from PetContext
  const { petResults } = usePetContext();

  // Function to render search results
  const renderedSearchResults = petResults?.searchResults.map((result: Animal) => {
    // destructure variables
    const { id, name, age, breeds, contact, gender, primary_photo_cropped } = result;
    
    // return a SearchResultsCard
    return (
      <SearchResultCard 
        key={id}
        id={id}
        name={name}
        age={age}
        breed={breeds.primary}
        city={contact.address.city}
        gender={gender}
        photo={primary_photo_cropped ? primary_photo_cropped.full : null}
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
          <main className="min-h-screen flex items-center justify-center px-4 py-3 md:px-16 md:py-4 xl:px-20">
            <LoadingScreen message="Loading..." imageSrc="/images/dog-icon.png" alt="Dog winking" error={false} />
          </main>
          :
            // if "petResults" exists, see if there are any results available.  if not, render an "error" screen
            (petResults.searchResults.length === 0 || petResults.status !== 200)
            ? 
              <main className="min-h-screen flex items-center justify-center px-4 py-3 md:px-16 md:py-4 xl:px-20">
                <LoadingScreen message="Hmm...something went wrong!" imageSrc="/images/wrong-dog.png" alt="Dog with 'x's for eyes" error />
              </main>
            :
              // if search results are available, render them
              <Layout>
                <div className="main-content text-[#422206]">
                  <h1 className="text-5xl lg:text-7xl 2xl:text-8xl font-bold mb-4">Results for <span className="italic">{petResults?.animal}</span> near <span className="italic">{petResults?.zipcode}</span></h1>

                  <hr className="mb-20 border-t-[6px] border-t-[#422206]" />

                  {/* ----- Rendered results ----- */}
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
