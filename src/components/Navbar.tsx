import{ useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import PetButton from "@/components/PetButton";


function Navbar() {
  // ---------- State ----------
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSelected, setIsSelected] = useState("");
  const [zipcode, setZipcode] = useState("");

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


  // ---------- Component ----------
  return (
    <div>
      <Link href="/"><p>Home</p></Link>
      <p onClick={handleSearchClick}>Search again</p>
      {/* if "isSearchActive" is true, show the search box, otherwise hide it */}
      {
        isSearchActive && 
        <div className="search-dropdown">
          <p>What are you looking for?</p>
          <PetButton src="/images/dog-icon.png" alt="Dog" text="Dog" onClick={handleClick} animalType="dog" isSelected={isSelected === "dog"} />
          <PetButton src="/images/cat-icon.png" alt="Cat" text="Cat" onClick={handleClick} animalType="cat" isSelected={isSelected === "cat"} />

          {/* ---------- Zipcode ---------- */}
          {/* <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col"> */}
          <form className="flex items-center justify-center flex-col">
                <label className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Enter your zipcode</label>

                
                  <input name="zipcode" type="text" pattern="[0-9]{5}" title="Five digit zip code" onChange={handleChange} value={zipcode} className="border-2 border-[#422206] rounded-xl h-[40px] pl-[8px] pt-[6px] text-2xl w-[40%] lg:w-[24%] mb-4" />
                  <button className="text-base sm:text-2xl border-4 border-[#422206] rounded-3xl w-[40%] lg:w-[24%] bg-[#ffda9c] flex items-center justify-center active:scale-95">Submit</button>
                
                
              </form>
        </div>
      }
    </div>
  );
};

export default Navbar;
