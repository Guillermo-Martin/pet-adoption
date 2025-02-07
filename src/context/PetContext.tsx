"use client";
import { createContext, ReactNode, useState } from "react";
import type { Animal } from "@/interfaces/Animal";

// ---------- Interfaces ----------
interface ProviderProps {
  children: ReactNode;
};

interface SearchResults {
  animal: string;
  searchResults: Animal[];
  token: string;
  tokenExpiration: number;
  tokenType: string;
  zipcode: string;
};

interface PetContextTypes {
  petResults: Animal[] | number;
  fetchAnimals: (type: string, zipcode: string) => void;
};


// ---------- Create the context ----------
// create the context (an object) and define its structure (it will use the "PetContext")
const PetContext = createContext<PetContextTypes | undefined>(undefined);

// ---------- Create the provider ----------
// the "children" props is of type "ReactNode" (defined in the "ProviderProps" interface)
function Provider({ children }: ProviderProps) {
  // ----- State -----
  const [petResults, setPetResults] = useState<Animal[]>([]);

  // ----- Functions -----
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
      console.log("Here is the fetched data for all pets:", data);

      // send all the data
      setPetResults(data);

      
    } catch (error) {
      console.log(error);
    };
  };

  // ----- Values to share with application ----
  // valuesToShare is an object that will have the "PetContextTypes" type
  const valuesToShare: PetContextTypes = {
    petResults,
    fetchAnimals
  };


  // ----- Provider component -----
  return (
    <PetContext.Provider value={valuesToShare}>
      {children}
    </PetContext.Provider>
  );
};

export { Provider };
export default PetContext;
