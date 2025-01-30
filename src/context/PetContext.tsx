"use client";
import { createContext, ReactNode, useState } from "react";

// ---------- Interfaces ----------
interface ProviderProps {
  children: ReactNode;
};

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

interface PetContextTypes {
  petResults: Animal[];
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
      // set "isLoading" to be true
      // setIsLoading(!isLoading);

      const response = await fetch("/api/fetch-animals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({animal: type, zipcode: zipcode})
      });

      // Convert the response to JSON, then set the "searchResults" state to have the results
      const data = await response.json();  // data received is going to be an object
      console.log("Here is the fetched data:", data);

      // set the state to be the fetched data
      setPetResults(data.animals);

      // send user to "results" page after getting the data
      // router.push("/search");
    } catch (error) {
      console.log(error);
    };
  };

  // ----- Values to share with application ----
  // valuesToShare is an object that will have the "PetContextTypes" type
  const valuesToShare: PetContextTypes = {
    petResults: petResults,
    fetchAnimals: fetchAnimals
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
