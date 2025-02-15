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
    <Link href={`/pet/${id}`} data-petid={id} className="w-[24%] min-w-2xs bg-[#ffda9c] border-[6px] rounded-xl border-[#422206] overflow-hidden hover:scale-[104%]">
      {/* Optimizing images: https://nextjs.org/docs/pages/building-your-application/optimizing/images */}
      <div className="image-container w-full h-[200px] relative mb-[12px]">
        <Image src={photo ? photo : "/images/dog-icon.png"} alt="" fill className="object-cover" />
      </div>
      
      <div className="text-container pl-[12px] pb-[12px]">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-[10px]">{name}</h2>
        <p className="text-xl mb-[4px]">{age} {gender}</p>
        <p className="text-xl mb-[4px]">{breed}</p>
        <p className="text-xl mb-[4px]">{city}</p>
      </div>

    </Link>
  );
}

export default SearchResultCard;
