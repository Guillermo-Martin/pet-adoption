"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import PetButton from "./../components/PetButton";
import { useRouter } from "next/navigation";
import usePetContext from "@/hooks/usePetContext";
import Footer from "@/components/Footer";
// import Image from "next/image";
import styles from "@/app/styles/home.module.css";

export default function Home() {
  // ---------- State ----------
  const [isSelected, setIsSelected] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSelectedError, setShowSelectedError] = useState(false);
  const [showZipcodeError, setShowZipcodeError] = useState(false);

  // ---------- useRouter ----------
  const router = useRouter();

  // Get the "fetchAnimals" function from PetContext
  const { fetchAnimals } = usePetContext();

  // ---------- Functions ----------
  // ----- selecting animal type -----
  const handleClick = (animal: string) => {
    // set "isSelected" state to the animal that was clicked on
    setIsSelected(animal);

    // if an animal was selected, hide the message for selecting a pet
    setShowSelectedError(false);
  };

  // ----- zipcode input -----
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setZipcode(event.target.value);

    // hide the zipcode error message when a user types something
    setShowZipcodeError(false);
  };

  // ----- handleSubmit -----
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form submission check
    if(isSelected === "" && zipcode === "") {
      // if an animal wasn't selected and zipcode is empty, show both error messages
      console.log("Please select an animal and enter a zipcode.");
      setShowSelectedError(true);
      setShowZipcodeError(true);
    } else if(zipcode === "") {
      // if an animal was selected, but zipcode is empty, show zipcode error message
      console.log("Please enter a 5-digit zipcode.");
      setShowZipcodeError(true);
    } else if(isSelected === "") {
      // if zipcode is entered by no animal was selected, show pet error message
      console.log("Please select an animal.");
      setShowSelectedError(true);
    } else {
      // set isLoading to true
      setIsLoading(true);

      // make API request, wait to get back something
      await fetchAnimals(isSelected, zipcode);

      // get the search params to add to the URL
      const urlParams = new URLSearchParams({
        type: isSelected,
        zipcode: zipcode
      });

      // then send the user to the "search-results" page
      router.push(`/search?${urlParams.toString()}`);
    };
  };

  // ---------- Component ----------
  return (
    <div>
      <main className="relative homepage-container min-h-screen flex items-center justify-center px-4 py-3 md:px-16 md:py-4 xl:px-20">
        {/* <div className="homepage-container-content text-[#422206]"> */}
        <div className="homepage-container-content">
          { isLoading 
            ? "loading..." 
            : 
              <>
                <div className="hero-header text-center mb-12">
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-4">Pet adoption</h1>
                  <p className="text-3xl sm:text-4xl lg:text-5xl">Your new pet bestie is waiting for you.</p>
                </div>

                {/* ---------- Pet search options ----------  */}
                <div className="pet-search-options flex items-center justify-center flex-col">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">What are you looking for?</h2>

                  <div className="button-container relative w-[80%] lg:w-[60%] flex items-center justify-evenly mb-12">
                    <PetButton src="/images/dog-icon.png" alt="Dog" text="Dog" onClick={handleClick} animalType="dog" isSelected={isSelected === "dog"} />
                    <PetButton src="/images/cat-icon.png" alt="Cat" text="Cat" onClick={handleClick} animalType="cat" isSelected={isSelected === "cat"} />
                    {showSelectedError && <p className="absolute bottom-[-35%] xs:bottom-[-26%] lg:bottom-[-18%] text-center leading-5 text-[#db1919] italic">Oops! Looks like you haven&apos;t selected a pet!</p>}
                    {/* ***** vvv  For later  vvv ***** */}
                    {/* <PetButton src="/images/placeholder-03.jpg" alt="Fish" text="Something else" onClick={handleClick} animalType="something-else" /> */}
                  </div>
                </div>
                
                {/* ---------- Zipcode ---------- */}
                <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col relative">
                  <label className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Enter your zipcode</label>

                  
                    {/* <input name="zipcode" type="text" pattern="[0-9]{5}" title="Five digit zip code" onChange={handleChange} value={zipcode} className="border-2 border-[#422206] rounded-xl h-[40px] pl-[8px] pt-[6px] text-2xl w-[60%] max-w-[260px] lg:w-[24%] mb-10" /> */}
                    <input name="zipcode" type="text" pattern="[0-9]{5}" title="Five digit zip code" onChange={handleChange} value={zipcode} className="border-2 rounded-xl h-[40px] pl-[8px] pt-[6px] text-2xl w-[60%] max-w-[260px] lg:w-[24%] mb-10" />
                    {showZipcodeError && <p className="absolute bottom-[24%] sm:bottom-[27%] text-[#db1919] italic">Don&apos;t forget to put in a zipcode!</p>}
                    {/* <button className="text-base sm:text-2xl border-4 border-[#422206] rounded-3xl w-[40%] lg:w-[24%] max-w-[260px] bg-[#ffda9c] flex items-center justify-center active:scale-95">Submit</button> */}
                    <button className="submit-button text-base sm:text-2xl border-4 rounded-3xl w-[40%] lg:w-[24%] max-w-[260px] bg-[#ffda9c] flex items-center justify-center active:scale-95">Submit</button>
                  
                  
                </form>

                

                {/* ---------- Testing styles ---------- */}
                {/* <div className={styles.testDiv}>This is a div</div> */}
              </>
          }
        </div>
      </main>

      {/* If results are loading, hide the footer on the "loading" screen */}
      {isLoading === false && <Footer position="absolute bottom-0" />}
    </div>


    // ---------- Default homepage ----------
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    //   <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    //     <Image
    //       className="dark:invert"
    //       src="/next.svg"
    //       alt="Next.js logo"
    //       width={180}
    //       height={38}
    //       priority
    //     />
    //     <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
    //       <li className="mb-2">
    //         Get started by editing{" "}
    //         <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
    //           src/app/page.tsx
    //         </code>
    //         .
    //       </li>
    //       <li>Save and see your changes instantly.</li>
    //     </ol>

    //     <div className="flex gap-4 items-center flex-col sm:flex-row">
    //       <a
    //         className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <Image
    //           className="dark:invert"
    //           src="/vercel.svg"
    //           alt="Vercel logomark"
    //           width={20}
    //           height={20}
    //         />
    //         Deploy now
    //       </a>
    //       <a
    //         className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         Read our docs
    //       </a>
    //     </div>
    //   </main>
    //   <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/file.svg"
    //         alt="File icon"
    //         width={16}
    //         height={16}
    //       />
    //       Learn
    //     </a>
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/window.svg"
    //         alt="Window icon"
    //         width={16}
    //         height={16}
    //       />
    //       Examples
    //     </a>
    //     <a
    //       className="flex items-center gap-2 hover:underline hover:underline-offset-4"
    //       href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/globe.svg"
    //         alt="Globe icon"
    //         width={16}
    //         height={16}
    //       />
    //       Go to nextjs.org →
    //     </a>
    //   </footer>
    // </div>
  );
}
