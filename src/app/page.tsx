"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import PetButton from "./../components/PetButton";
import SearchResultCard from "./../components/SearchResultCard";
// import Image from "next/image";
// import styles from "@/app/styles/home.module.css";


interface Animal {
  id: number;
  name: string;
  gender: string;
  age: string;
  breeds: {
    primary: string;
  };
  contact: {
    address: {
      city: string
    }
  };
  primary_photo_cropped: {
    full: string;
  }
};



export default function Home() {
  // ---------- State ----------
  const [isSelected, setIsSelected] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [searchResults, setSearchResults] = useState<Animal[]>([]);

  // ---------- Functions ----------
  const fetchAnimals = async () => {
    // make request to "/api/fetch-token" and get a response
    try {
      const response = await fetch("/api/fetch-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({animal: isSelected, zipcode: zipcode})
      });

      // Convert the response to JSON, then set the "searchResults" state to have the results
      const data = await response.json();
      console.log("Here is the fetched data:", data);

      setSearchResults(data.animals);
    } catch (error) {
      console.log(error);
    };
  };

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
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form submission check
    if(isSelected === "" && zipcode === "") {
      // if an animal wasn't selected and zipcode is empty
      alert("Please select an animal and enter a zipcode.");
    } else if(zipcode === "") {
      // if an animal was selected, but zipcode is empty
      alert("Please enter a 5-digit zipcode.");
    } else {
      // make API request
      fetchAnimals();
    };
  };

  // create the list of results
  const renderedSearchResults = searchResults.map((result: Animal) => {
    console.log("line 88!", result.primary_photo_cropped);

    return (
      // <h1 key={result.id}>{result.name} {result.age} {result.breeds.primary} {result.contact.address.city} </h1>
      <SearchResultCard 
        key={result.id}
        id={result.id}
        name={result.name}
        age={result.age}
        breed={result.breeds.primary}
        city={result.contact.address.city}
        gender={result.gender}
        photo={result.primary_photo_cropped ? result.primary_photo_cropped.full : null}
      />
    );
  });


  // console.log("line 106", searchResults[0].primary_photo_cropped)

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

      

      

      {/* <div className={styles.testDiv}>This is a div</div> */}

      <div>{renderedSearchResults}</div>
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
