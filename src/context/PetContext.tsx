"use client";
import { createContext, ReactNode, useState, useEffect } from "react";
import type { Animal } from "@/interfaces/Animal";

// --------------------------------------------------------------------
//                            Interfaces
// --------------------------------------------------------------------
interface ProviderProps {
  children: ReactNode;
};

interface SearchResults {
  animal: string;
  searchResults: Animal[] | [];
  zipcode: string;
  status: number | null;
};

interface PetContextTypes {
  petResults: SearchResults | null;
  fetchAnimals: (type: string, zipcode: string) => void;
};


// --------------------------------------------------------------------
//                       Creating the context
// --------------------------------------------------------------------
// create the context (an object) and define its structure (it will use the "PetContext")
const PetContext = createContext<PetContextTypes | undefined>(undefined);


// --------------------------------------------------------------------
//                       Creating the provider
// --------------------------------------------------------------------
// the "children" props is of type "ReactNode" (defined in the "ProviderProps" interface)
function Provider({ children }: ProviderProps) {
  // ---------- State ----------
  const [petResults, setPetResults] = useState<SearchResults | null>(null);

  // Check to see if there's data in local storage
  useEffect(() => {
    // get data from localStorage
    const storedPetResults = localStorage.getItem("petResults");

    // check to see if there's data in local storage.  if there's nothing (null), set "petResults" to an object with empty data...
    if(storedPetResults === null) {
      setPetResults({searchResults: [], animal: "", zipcode: "", status: null});
    } else {
      // ...else set "petResults" state to be localStorage data
      setPetResults(JSON.parse(storedPetResults));
    };
  }, []);
  
  // ---------- Functions ----------
  const fetchAnimals = async (type: string, zipcode: string) => {
    // make request to "/api/fetch-animals" and get a response (containing data)
    try {
      const response = await fetch(`/api/fetch-animals?type=${type}&zipcode=${zipcode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });

      // Convert the response to JSON
      const data: SearchResults = await response.json();

      // add status to data
      data.status = response.status;

      // update the petResults state with all the data
      setPetResults(data);

      // add the pet results to localStorage
      localStorage.setItem("petResults", JSON.stringify(data));
    } catch (error) {
      console.error("Error:", error);
    };
  };

  // ---------- Values to share with application ----------
  // valuesToShare is an object that will have the "PetContextTypes" type
  const valuesToShare: PetContextTypes = {
    petResults,
    fetchAnimals,
  };


  // ---------- Provider component ----------
  return (
    <PetContext.Provider value={valuesToShare}>
      {children}
    </PetContext.Provider>
  );
};

export { Provider };
export default PetContext;
