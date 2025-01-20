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
      <Image src={src} alt={alt} width={200} height={200}/>
      <p>{text}</p>
    </div>
  );
};

export default PetButton;
