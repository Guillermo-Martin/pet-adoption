import Image from "next/image";

function PetButton(props) {
  console.log(props);

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
