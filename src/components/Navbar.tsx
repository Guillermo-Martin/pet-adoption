import Link from "next/link";

function Navbar() {
  return (
    <div>
      <Link href="/"><p>Home</p></Link>
      <p>Search</p>
    </div>
  );
};

export default Navbar;
