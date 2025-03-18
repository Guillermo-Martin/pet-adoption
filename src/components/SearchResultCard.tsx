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

function SearchResultCard({ id, name, age, breed, city, gender, photo }: SearchCardProps) {
  return (
    <Link href={`/pet/${id}`} data-petid={id} className="search-results-card w-full sm:w-[48%] lg:w-[30%] max-w-[290px] bg-[#ffda9c] border-[6px] rounded-xl overflow-hidden hover:scale-[104%] transition duration-150">
      {/* ----- Pet image ----- */}
      <div className="image-container w-full h-[200px] relative mb-[12px]">
        {/* If the pet has a photos, show it, otherwise, show no image is available */}
        { photo 
          ? 
            <Image src={photo} alt="Pet's picture" fill sizes="100%" className="object-cover"/> 
          : 
            <div className="no-image bg-[#fff5eb] h-full flex justify-center items-center flex-col">
              <div className="no-image-content">
                <Image src="/images/wrong-dog.png" alt="Dog with 'x's for eyes" width={200} height={200} className="max-w-[100px] mx-auto mb-2"/>
                <p className="h-full">No image available.</p>
              </div>
            </div>
        }
      </div>
      
      {/* ----- Basic pet info ----- */}
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
