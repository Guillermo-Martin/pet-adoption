"use client";
import Link from "next/link";
import Image from "next/image";

// ---------- Interfaces ----------
interface SearchCardProps {
  id: number;
  name: string;
  age: string;
  breed: string;
  city: string;
  gender: string;
  photo: string | null;
};

function SearchResultCard({id, name, age, breed, city, gender, photo}: SearchCardProps) {
  return (
    <Link href={`/pet/${id}`} data-petid={id} className="w-[20%] bg-[#ffda9c] border-[6px] rounded-xl border-[#422206] overflow-hidden">
      {/* Optimizing images: https://nextjs.org/docs/pages/building-your-application/optimizing/images */}
      <div className="image-container w-full h-[200px] relative">
        <Image src={photo ? photo : "/images/dog-icon.png"} alt="" fill className="object-cover" />
      </div>

      
      
      <div className="text-container">
        <h2>{name}</h2>
        <p>{age} {gender}</p>
        <p>{breed}</p>
        <p>{city}</p>
      </div>
      

    </Link>
  );
}

export default SearchResultCard;
