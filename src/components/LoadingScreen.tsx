import Image from "next/image";
import Link from "next/link";

// --------------------------------------------------------------------
//                            Interfaces
// --------------------------------------------------------------------
interface LoadingScreenProps {
  message: string;
  error: boolean;
  bounce: boolean;
  petSelected: string;
}

// --------------------------------------------------------------------
//                            Component
// --------------------------------------------------------------------
function LoadingScreen({ message, error, bounce, petSelected }: LoadingScreenProps) {
  // variables to conditionally render loading screen images
  let imageSource;
  let alt;

  // if a "dog" was selected and there's no error, show the dog smiling...
  if(petSelected === "dog" && error === false){
    imageSource = "/images/dog-icon.png";
    alt = "Dog winking and smiling"
  } else if(petSelected === "dog" && error === true) {
    // if a "dog" was selected and there's ab error, show the error dog...
    imageSource = "/images/wrong-dog.png";
    alt = "Dog with Xs for eyes"
  } else if(petSelected === "cat" && error === false) {
    // if a "cat" was selected and there's no error, show the cat smiling...
    imageSource = "/images/cat-icon.png";
    alt = "Cat smiling"
  } else {
    // if a "cat" was selected and there's an error, show the error cat...
    imageSource = "/images/wrong-cat.png";
    alt = "Cat with Xs for eyes"
  }
  
  return (
    <div className="loading-container-content">
      <Image src={imageSource} alt={alt} width={200} height={200} className={`w-[40%] xs:w-[60%] lg:w-[80%] max-w-[102.4px] xs:max-w-[163.54px] lg:max-w-[218.06px] mx-auto mb-6 ${bounce ? "animate-bounce" : null}`} />
      <p className="text-center text-lg xs:text-xl">{message}</p>
      {/* If "error" is true, show a link to the homepage */}
      {error && <Link href="/" className="block mx-auto mt-2 w-fit underline hover:text-[#4369fc] transition duration-150">Go back to the homepage.</Link>}
    </div>
  );
};

export default LoadingScreen;
