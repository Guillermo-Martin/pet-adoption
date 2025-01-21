"use client";
import { useState, MouseEvent } from "react";
import Image from "next/image";

// ---------- Interface ----------
interface PetButtonProps {
  src: string;
  alt: string;
  text: string;
  animalType: string;
  onClick: (animal: string) => void;
};

function PetButton({ src, alt, text, animalType, onClick }: PetButtonProps) {
  // ---------- State ----------
  const [isSelected, setIsSelected] = useState(false);

  // ---------- Functions ----------
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    // get the animal clicked on
    const animal: string | null = event.currentTarget.getAttribute("data-animal");

    // check to see if "animal" is not null; if it's not, call the function.  Send the animal type to the parent.
    if(animal !== null) {
      onClick(animal as string);
    };

    // set isSelected to either true or false
    setIsSelected(!isSelected);
  };

  console.log(isSelected);
  
  // ---------- Component ----------
  return (
    <div onClick={handleClick} data-animal={animalType} className={isSelected ? "border border-black" : ""}>
      <Image src={src} alt={alt} width={200} height={200}/>
      <p>{text}</p>
    </div>
  );
};

export default PetButton;
