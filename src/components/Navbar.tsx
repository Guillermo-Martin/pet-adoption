import{ useState } from "react";
import Link from "next/link";


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
      {isSearchActive && "showing search box"}
    </div>
  );
};

export default Navbar;
