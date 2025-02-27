import{ useState } from "react";
import Link from "next/link";
import PetButton from "@/components/PetButton";


function Navbar() {
  // ---------- State ----------
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSelected, setIsSelected] = useState("");

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
        </div>
      }
    </div>
  );
};

export default Navbar;
