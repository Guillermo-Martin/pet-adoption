"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import PetButton from "@/components/PetButton";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import usePetContext from "@/hooks/usePetContext";

export default function Home() {
  // ---------- State ----------
  const [isSelected, setIsSelected] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSelectedError, setShowSelectedError] = useState(false);
  const [showZipcodeError, setShowZipcodeError] = useState(false);

  // ---------- useRouter ----------
  const router = useRouter();

  // Get the "fetchAnimals" function from PetContext
  const { fetchAnimals } = usePetContext();

  // ---------- Functions ----------
  // ----- selecting animal type -----
  const handleClick = (animal: string) => {
    // set "isSelected" state to the animal that was clicked on
    setIsSelected(animal);

    // if an animal was selected, hide the message for selecting a pet
    setShowSelectedError(false);
  };

  // ----- zipcode input -----
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setZipcode(event.target.value);

    // hide the zipcode error message when a user types something
    setShowZipcodeError(false);
  };

  // ----- handleSubmit -----
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form submission check
    if(isSelected === "" && zipcode === "") {
      // if an animal wasn't selected and zipcode is empty, show both error messages
      setShowSelectedError(true);
      setShowZipcodeError(true);
    } else if(zipcode === "") {
      // if an animal was selected, but zipcode is empty, show zipcode error message
      setShowZipcodeError(true);
    } else if(isSelected === "") {
      // if zipcode is entered by no animal was selected, show pet error message
      setShowSelectedError(true);
    } else {
      // set isLoading to true
      setIsLoading(true);

      // make API request, wait to get back something
      await fetchAnimals(isSelected, zipcode);

      // get the search params to add to the URL
      const urlParams = new URLSearchParams({
        type: isSelected,
        zipcode: zipcode
      });

      // then send the user to the "search-results" page
      router.push(`/search?${urlParams.toString()}`);
    };
  };

  // ---------- Component ----------
  return (
    <div>
      <main className="relative homepage-container min-h-screen flex items-center justify-center px-4 py-3 md:px-16 md:py-4 xl:px-20">
        <div className="homepage-container-content">
          {/* If "isLoading" is true, show the loading screen... */}
          { isLoading 
            ? 
              // ---------- Loading screen ----------
              <>
                <LoadingScreen message="Finding some new friends..." error={false} bounce petSelected={isSelected} />
              </>
            : 
              // ...otherwise show the homepage content
              <>
                <div className="hero-header text-center mb-6 lg:mb-8">
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-4">Pet adoption</h1>
                  <p className="text-3xl sm:text-4xl lg:text-5xl">Your new pet bestie is waiting for&nbsp;you.</p>
                </div>

                {/* ---------- Pet search options ----------  */}
                <div className="pet-search-options flex items-center justify-center flex-col">
                  <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">What are you looking&nbsp;for?</h2>

                  {/* ----- Pet buttons container ------ */}
                  <div className="button-container relative w-[80%] xs:w-[88%] lg:w-[60%] max-w-sm lg:max-w-none flex items-center justify-evenly mb-12">
                    <PetButton src="/images/dog-icon.png" alt="Dog" text="Dog" onClick={handleClick} animalType="dog" isSelected={isSelected === "dog"} />
                    <PetButton src="/images/cat-icon.png" alt="Cat" text="Cat" onClick={handleClick} animalType="cat" isSelected={isSelected === "cat"} />
                    
                    {/* if a pet type wasn't selected, show the error message */}
                    {showSelectedError && <p className="absolute bottom-[-35%] xs:bottom-[-26%] lg:bottom-[-18%] text-center leading-5 text-[#db1919] italic">Oops! Looks like you haven&apos;t selected a&nbsp;pet!</p>}
                  </div>
                </div>
                
                {/* ---------- Form for Zipcode ---------- */}
                <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col relative">
                  <label className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Enter your zipcode</label>
                    <input name="zipcode" type="text" pattern="[0-9]{5}" title="Five digit zip code" onChange={handleChange} value={zipcode} className="border-2 rounded-xl h-[40px] pl-[8px] pt-[6px] text-2xl w-[60%] max-w-[260px] lg:w-[24%] mb-10" />
                    
                    {/* if a zipcode wasn't inputted, show the error message */}
                    {showZipcodeError && <p className="absolute bottom-[24%] sm:bottom-[27%] text-[#db1919] italic">Don&apos;t forget to put in a zipcode!</p>}
                    <button className="submit-button text-base sm:text-2xl border-4 rounded-3xl w-[40%] lg:w-[24%] max-w-[260px] bg-[#ffda9c] flex items-center justify-center active:scale-95 hover:scale-[104%] transition duration-150">Submit</button>
                </form>
              </>
          }
        </div>
      </main>

      {/* If results are loading, hide the footer on the "loading" screen */}
      {isLoading === false && <Footer position="" />}
    </div>
  );
}
