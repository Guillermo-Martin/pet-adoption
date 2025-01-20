"use client";
import Image from "next/image";

// ---------- Interface ----------
interface PetButtonProps {
  src: string;
  alt: string;
  text: string;
};

// ---------- Functions ----------
const handleClick = () => {
  alert("you clicked me!");
};

function PetButton({ src, alt, text }: PetButtonProps) {
  console.log(src, alt, text, "line 4");

  return (
    <div onClick={handleClick}>
      <Image src={src} alt={alt} width={200} height={200}/>
      <p>{text}</p>
    </div>
  );
};

export default PetButton;
