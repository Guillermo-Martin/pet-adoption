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
    <div className="navbar relative bg-red-100 xs:bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500 xl:bg-red-600 2xl:bg-red-700 border-b-[6px] border-b-[#422206] w-full py-[20px] sm:px-[40px] mb-20">
      <div className="navbar-inner-container max-w-7xl mx-auto">
        <div className="navbar-links flex gap-x-[40px]">
          <Link href="/"><p className="text-base lg:text-xl xl:text-2xl hover:text-[#4369fc]">Home</p></Link>
          <p onClick={handleSearchClick} className="text-base lg:text-xl xl:text-2xl cursor-pointer hover:text-[#4369fc]">Search again</p>
        </div>
        
        {/* ---------- Search dropdown ---------- */}
        {
          // if "isSearchActive" is true, show the search dropdown, otherwise hide it 
          isSearchActive && 
          <div className="search-dropdown absolute w-full bg-[blue] z-[1] sm:top-[100%] sm:left-0">
            { 
              // if "isLoading" is true, show the loading, otherwise, show the search dropdown
              isLoading 
                ? "loading..."
                :
                <div>
                  <p>What are you looking for?</p>
                  <div className="form-container flex">
                    <PetButton src="/images/dog-icon.png" alt="Dog" text="Dog" onClick={handleClick} animalType="dog" isSelected={isSelected === "dog"} />
                    <PetButton src="/images/cat-icon.png" alt="Cat" text="Cat" onClick={handleClick} animalType="cat" isSelected={isSelected === "cat"} />
        
                    {/* ---------- Zipcode ---------- */}
                    <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col">
                    {/* <form className="flex items-center justify-center flex-col"> */}
                      <label className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Enter your zipcode</label>
                        <input name="zipcode" type="text" pattern="[0-9]{5}" title="Five digit zip code" onChange={handleChange} value={zipcode} className="border-2 border-[#422206] rounded-xl h-[40px] pl-[8px] pt-[6px] text-2xl w-[40%] lg:w-[24%] mb-4" />
                        <button className="text-base sm:text-2xl border-4 border-[#422206] rounded-3xl w-[40%] lg:w-[24%] bg-[#ffda9c] flex items-center justify-center active:scale-95">Submit</button>
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
