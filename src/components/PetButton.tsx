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
    // if the animal is selected show a border
    // <div onClick={handleClick} data-animal={animalType} className={isSelected ? "border cursor-pointer" : "cursor-pointer"}>
    <div onClick={handleClick} data-animal={animalType}>
      <div className={`size-[150] sm:size-[200] bg-[#ffda9c]  border-[6px] rounded-[10px] border-[#422206] flex items-center justify-center mb-2 cursor-pointer ${isSelected && "outline outline-[6px] outline-[#4369fc] border-[#4369fc]"}`}>
        <Image src={src} alt={alt} width={200} height={200} className="size-[100] sm:size-[140]"/>
      </div>
      <p className="text-2xl text-center">{text}</p>
    </div>
  );
};

export default PetButton;
