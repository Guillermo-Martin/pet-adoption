import Image from "next/image";

interface PetButtonProps {
  src: string;
  alt: string;
  text: string;
};

function PetButton({ src, alt, text }: PetButtonProps) {
  console.log(src, alt, text, "line 4");

  return (
    <div>
      <Image 
        src="/images/placeholder-01.jpg"
        alt="Placeholder"
        width={200}
        height={200}
      />
      <p>Name of animal</p>
    </div>
  );
};

export default PetButton;
