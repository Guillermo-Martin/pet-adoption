"use client";
import { useState, MouseEvent } from "react";
import Image from "next/image";

// ---------- Interface ----------
interface PetButtonProps {
  src: string;
  alt: string;
  text: string;
  animalType: string;
  isSelected: boolean;
  onClick: (animal: string) => void;
};

function PetButton({ src, alt, text, animalType, isSelected, onClick }: PetButtonProps) {
  // ---------- Functions ----------
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    // get the animal clicked on
    const animal: string | null = event.currentTarget.getAttribute("data-animal");

    // check to see if "animal" is not null; if it's not, call the function.  Send the animal type to the parent.
    if(animal !== null) {
      onClick(animal as string);
    };
  };

  
  // ---------- Component ----------
  return (
    <div onClick={handleClick} data-animal={animalType} className={isSelected ? "border" : ""}>
      <Image src={src} alt={alt} width={200} height={200}/>
      <p className="text-2xl">{text}</p>
    </div>
  );
};

export default PetButton;
