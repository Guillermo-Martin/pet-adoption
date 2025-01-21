"use client";
import { useState, MouseEvent } from "react";
import Image from "next/image";

// ---------- Interface ----------
interface PetButtonProps {
  src: string;
  alt: string;
  text: string;
  animalType: string;
};

function PetButton({ src, alt, text, animalType }: PetButtonProps) {
  // ---------- State ----------
  const [animal, setAnimal] = useState();

  // ---------- Functions ----------
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    console.log(event.currentTarget.getAttribute("data-animal"), "line 15");
  };
  

  return (
    <div onClick={handleClick} data-animal={animalType}>
      <Image src={src} alt={alt} width={200} height={200}/>
      <p>{text}</p>
    </div>
  );
};

export default PetButton;
