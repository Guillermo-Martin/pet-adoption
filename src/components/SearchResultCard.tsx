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
  console.log(photo);

  return (
    <Link href={`/pet/${id}`} data-petid={id} className="border w-[20%]">
      <Image width={278} height={187} src={photo ? photo : "/images/dog-icon.png"} alt=""/>
      
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
