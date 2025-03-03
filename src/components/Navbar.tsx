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
      alert("Please select an animal and enter a zipcode.");
    } else if(zipcode === "") {
      // if an animal was selected, but zipcode is empty
      alert("Please enter a 5-digit zipcode.");
    } else if(isSelected === "") {
      alert("Please select an animal.")
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
    <div className="navbar relative bg-red-100 xs:bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500 xl:bg-red-600 2xl:bg-red-700 border-b-[6px] border-b-[#422206] mb-10 px-4 py-3 md:px-16 md:py-4 xl:px-20">
      <div className="navbar-inner-container max-w-7xl mx-auto bg-sky-900">
        {/* <div className="navbar-links flex gap-x-[40px]"> */}
        <div className="navbar-links flex gap-x-[40px]">
          <Link href="/"><p className="text-base sm:text-xl hover:text-[#4369fc]">Home</p></Link>
          <p onClick={handleSearchClick} className="text-base sm:text-xl cursor-pointer hover:text-[#4369fc]">Search again</p>
        </div>
        
        {/* ---------- Search dropdown ---------- */}
        {
          // if "isSearchActive" is true, show the search dropdown, otherwise hide it 
          isSearchActive && 
          <div className="search-dropdown absolute w-full bg-[blue] z-[1] top-[113%] left-0 px-4 py-6 border-b-[6px] border-b-[#422206]">
            { 
              // if "isLoading" is true, show the loading, otherwise, show the search dropdown
              isLoading 
                ? "loading..."
                :
                <div>
                  <h2 className="text-3xl font-bold text-center mb-6">What are you looking for?</h2>
                  <div className="form-container flex flex-col justify-center items-center">
                    <div className="button-container flex justify-evenly items-center w-full mb-6">
                      <PetButton src="/images/dog-icon.png" alt="Dog" text="Dog" onClick={handleClick} animalType="dog" isSelected={isSelected === "dog"} />
                      <PetButton src="/images/cat-icon.png" alt="Cat" text="Cat" onClick={handleClick} animalType="cat" isSelected={isSelected === "cat"} />
                    </div>
                    
        
                    {/* ---------- Zipcode ---------- */}
                    <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col">
                    {/* <form className="flex items-center justify-center flex-col"> */}
                      <label className="text-2xl font-bold mb-2">Enter your zipcode</label>
                        <input name="zipcode" type="text" pattern="[0-9]{5}" title="Five digit zip code" onChange={handleChange} value={zipcode} className="border-2 border-[#422206] rounded-xl h-[40px] pl-[8px] pt-[6px] text-2xl w-[100%] mb-6" />
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
