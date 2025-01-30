"use client";
import { useState, useContext, FormEvent, ChangeEvent } from "react";
import PetButton from "./../components/PetButton";
import { useRouter } from "next/navigation";
import PetContext from "@/context/PetContext";
// import Image from "next/image";
// import styles from "@/app/styles/home.module.css";

export default function Home() {
  // ---------- State ----------
  const [isSelected, setIsSelected] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ---------- useRouter ----------
  const router = useRouter();

  // ---------- Getting information from context ----------
  const petContext = useContext(PetContext);

  // Destructuring shows an error: https://stackoverflow.com/questions/68579498/typescript-react-destructuring-from-usecontext-throws-an-error
  // check to see if the context object exists; if it doesn't throw an error
  if(!petContext) {
    throw new Error("PetContext must be used within a provider.");
  };

  // if it does, destructure the information we want from the context
  const { fetchAnimals } = petContext;

  // ---------- Functions ----------
  // ----- selecting animal type -----
  const handleClick = (animal: string) => {
    // set "isSelected" state to the animal that was clicked on
    setIsSelected(animal);
  };

  // ----- zipcode input -----
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setZipcode(event.target.value);
  };

  // ----- handleSubmit -----
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form submission check
    if(isSelected === "" && zipcode === "") {
      // if an animal wasn't selected and zipcode is empty
      alert("Please select an animal and enter a zipcode.");
    } else if(zipcode === "") {
      // if an animal was selected, but zipcode is empty
      alert("Please enter a 5-digit zipcode.");
    } else {
      // set isLoading to true
      setIsLoading(true);

      // make API request, wait to get back something
      await fetchAnimals(isSelected, zipcode);

      // then send the user to the "search-results" page
      router.push("/search");
    };
  };

  // ---------- Component ----------
  return (
    <div>
      <div className="hero-header">
        <h1>Pet adoption</h1>
        <p>Your new pet bestie is waiting for you.</p>
      </div>

      {/* ---------- Pet search options ---------- */}
      <div className="pet-search-options">
        <h2>What are you looking for?</h2>

        <div className="button-container">
          <PetButton src="/images/placeholder-01.jpg" alt="Dog" text="Dog" onClick={handleClick} animalType="dog" isSelected={isSelected === "dog"} />
          <PetButton src="/images/placeholder-02.jpg" alt="Cat" text="Cat" onClick={handleClick} animalType="cat" isSelected={isSelected === "cat"} />
          {/* ***** vvv  For later  vvv ***** */}
          {/* <PetButton src="/images/placeholder-03.jpg" alt="Fish" text="Something else" onClick={handleClick} animalType="something-else" /> */}
        </div>
      </div>
      
      {/* ---------- Zipcode ---------- */}
      <form onSubmit={handleSubmit}>
        <label>Zipcode</label>
        <input name="zipcode" type="text" pattern="[0-9]{5}" title="Five digit zip code" onChange={handleChange} value={zipcode} className="border border-black" />

        <button className="border border-black">Submit</button>
      </form>

      {/* ---------- Is loading logic ---------- */}
      <div className="flex flex-wrap">
        {isLoading && "loading..."}
      </div>

      {/* ---------- Testing styles ---------- */}
      {/* <div className={styles.testDiv}>This is a div</div> */}
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
