import Image from "next/image";
import Link from "next/link";

// --------------------------------------------------------------------
//                            Interfaces
// --------------------------------------------------------------------
interface LoadingScreenProps {
  message: string;
  imageSrc: string;
  alt: string;
  error: boolean;
  bounce: boolean;
}

// --------------------------------------------------------------------
//                            Component
// --------------------------------------------------------------------
function LoadingScreen({ message, imageSrc, alt, error, bounce }: LoadingScreenProps) {
  return (
    <div className="loading-container-content">
      <Image src={imageSrc} alt={alt} width={200} height={200} className={`w-[40%] xs:w-[60%] lg:w-[80%] max-w-[102.4px] xs:max-w-[163.54px] lg:max-w-[218.06px] mx-auto mb-6 ${bounce ? "animate-bounce" : null}`} />
      <p className="text-center text-lg xs:text-xl">{message}</p>
      {/* If "error" is true, show a link to the homepage */}
      {error && <Link href="/" className="block mx-auto mt-2 w-fit underline hover:text-[#4369fc] transition duration-150">Go back to the homepage.</Link>}
    </div>
  );
};

export default LoadingScreen;
