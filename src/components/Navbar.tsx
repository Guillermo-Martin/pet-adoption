import{ useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import PetButton from "@/components/PetButton";
import { useRouter } from "next/navigation";
import usePetContext from "@/hooks/usePetContext";



function Navbar() {
  // ---------- State ----------
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSelected, setIsSelected] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSelectedError, setShowSelectedError] = useState(false);
  const [showZipcodeError, setShowZipcodeError] = useState(false);

  // ---------- useRouter ----------
  const router = useRouter();

  // get the "fetchAnimals" function from PetContext
  const { fetchAnimals } = usePetContext();

  // ---------- Functions ----------
  // open/close search dropdown
  const handleSearchClick = () => {
    // set isSearchActive
    setIsSearchActive(!isSearchActive);
  };

  // animal selection
  const handleClick = (animal: string) => {
    setIsSelected(animal);
  };

  // zipcode input
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setZipcode(event.target.value);
  };

  // handleSubmit
  // ----- handleSubmit -----
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form submission check
    if(isSelected === "" && zipcode === "") {
      // if an animal wasn't selected and zipcode is empty
      console.log("Please select an animal and enter a zipcode.");
      setShowSelectedError(true);
      setShowZipcodeError(true);
    } else if(zipcode === "") {
      // if an animal was selected, but zipcode is empty
      console.log("Please enter a 5-digit zipcode.");
      setShowZipcodeError(true);
    } else if(isSelected === "") {
      console.log("Please select an animal.");
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

      // after going to the "SearchResults" page, hide the "search" dropdown and set "isLoading" to false
      setIsLoading(false);
      setIsSearchActive(false);
    };
  };


  // ---------- Component ----------
  return (
    <div className="navbar relative lg:static bg-red-100 xs:bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500 xl:bg-red-600 2xl:bg-red-700 border-b-[6px] mb-10 px-4 py-3 md:px-16 md:py-4 xl:px-20">
      <div className="navbar-inner-container lg:relative max-w-7xl mx-auto bg-sky-900">
        {/* <div className="navbar-links flex gap-x-[40px]"> */}
        <div className="navbar-links flex gap-x-[40px]">
          <Link href="/"><p className="text-base sm:text-xl hover:text-[#4369fc]">Home</p></Link>
          <p onClick={handleSearchClick} className="text-base sm:text-xl cursor-pointer hover:text-[#4369fc]">Search again</p>
        </div>
        
        {/* ---------- Search dropdown ---------- */}
        {
          // if "isSearchActive" is true, show the search dropdown, otherwise hide it 
          isSearchActive && 
          <div className="search-dropdown absolute w-full lg:w-[80%] bg-[blue] z-[1] top-[113%] sm:top-[112%] md:top-[110%] lg:top-[50px] left-0 xl:left-[90px] px-4 py-6 md:py-10 md:px-8 border-b-[6px] border-b-[#422206] lg:border-x-[6px] lg:border-x-[#422206] lg:rounded-b-xl">
            { 
              // if "isLoading" is true, show the loading, otherwise, show the search dropdown
              isLoading 
                ? "loading..."
                :
                <div>
                  <span onClick={handleSearchClick} className="text-3xl font-bold cursor-pointer absolute right-4 lg:right-6 top-3 lg:top-4">x</span>
                  <h2 className="text-3xl lg:text-4xl 2xl:text-6xl font-bold text-center mb-6 max-w-[80%] mx-auto">What are you looking&nbsp;for?</h2>
                  <div className="form-container flex flex-col justify-center items-center md:flex-row md:justify-evenly md:max-w-[800px] md:mx-auto">
                    <div className="relative button-container flex justify-evenly items-center w-full max-w-[320px] lg:max-w-[400px] mb-6 md:mb-0">
                      <PetButton src="/images/dog-icon.png" alt="Dog" text="Dog" onClick={handleClick} animalType="dog" isSelected={isSelected === "dog"} />
                      <PetButton src="/images/cat-icon.png" alt="Cat" text="Cat" onClick={handleClick} animalType="cat" isSelected={isSelected === "cat"} />
                      {showSelectedError && <p className="absolute bottom-[-30%] bottom-[-16%] lg:bottom-[-18%] text-xs text-center leading-5 text-[#db1919] italic">Oops! Looks like you haven&apos;t selected a pet!</p>}
                    </div>
                    
        
                    {/* ---------- Zipcode ---------- */}
                    <form onSubmit={handleSubmit} className="relative flex items-center justify-center flex-col">
                    {/* <form className="flex items-center justify-center flex-col"> */}
                      <label className="text-2xl font-bold mb-2">Enter your zipcode</label>
                        <input name="zipcode" type="text" pattern="[0-9]{5}" title="Five digit zip code" onChange={handleChange} value={zipcode} className="border-2 border-[#422206] rounded-xl h-[40px] pl-[8px] pt-[6px] text-2xl w-full md:w-[80%] mb-6" />
                        {showZipcodeError && <p className="absolute bottom-[30%] sm:bottom-[27%] text-xs text-[#db1919] italic">Don&apos;t forget to put in a zipcode!</p>}
                        <button className="text-base border-4 border-[#422206] rounded-3xl w-[80%] bg-[#ffda9c] py-1 flex items-center justify-center active:scale-95">Submit</button>
                    </form>
                  </div>
                </div>
            }
          </div>
        }
      </div>
    </div>
  );
};

export default Navbar;
