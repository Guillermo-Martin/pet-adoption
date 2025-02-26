import{ useState } from "react";
import Link from "next/link";
import PetButton from "@/components/PetButton";


function Navbar() {
  // ---------- State ----------
  const [isSearchActive, setIsSearchActive] = useState(false);

  // ---------- Functions ----------
  const handleClick = () => {
    // set isSearchActive
    setIsSearchActive(!isSearchActive);
  };

  // ---------- Component ----------
  return (
    <div>
      <Link href="/"><p>Home</p></Link>
      <p onClick={handleClick}>Search again</p>
      {/* if "isSearchActive" is true, show the search box, otherwise hide it */}
      {
        isSearchActive && 
        <div className="search-dropdown">
          <p>What are you looking for?</p>
          {/* <PetButton src="/images/dog-icon.png" alt="Dog" text="Dog" onClick={handleClick} animalType="dog" isSelected={isSelected === "dog"} /> */}
          <PetButton src="/images/dog-icon.png" alt="Dog" text="Dog" onClick={handleClick} animalType="dog" />
          {/* <PetButton src="/images/cat-icon.png" alt="Cat" text="Cat" onClick={handleClick} animalType="cat" isSelected={isSelected === "cat"} /> */}
          <PetButton src="/images/cat-icon.png" alt="Cat" text="Cat" onClick={handleClick} animalType="cat" />
        </div>
      }
    </div>
  );
};

export default Navbar;
