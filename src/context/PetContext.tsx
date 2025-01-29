"use client";
import { createContext, ReactNode, useState } from "react";


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

interface PetContext {
  petResults: Animal[];
  fetchAnimals: (type: string, zipcode: string) => void;
};


// create the context and define its structure
// const PetContext = createContext<PetContext>({} as PetContext);
const PetContext = createContext<PetContext | undefined>(undefined);

// create the Provider
function Provider({ children }: ProviderProps) {
  // state
  const [petResults, setPetResults] = useState<Animal[]>([]);


  // functions
  const fetchAnimals = async (type: string, zipcode: string) => {
    // make request to "/api/fetch-token" and get a response
    try {
      // set "isLoading" to be true
      // setIsLoading(!isLoading);

      const response = await fetch("/api/fetch-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({animal: type, zipcode: zipcode})
      });

      // Convert the response to JSON, then set the "searchResults" state to have the results
      const data = await response.json();
      console.log("Here is the fetched data:", data);

      // set the state to be the fetched data
      setPetResults(data.animals);

      // send user to "results" page after getting the data
      // router.push("/search");
    } catch (error) {
      console.log(error);
    };
  };

  // values to share (this needs a type)
  const valuesToShare: PetContext = {
    petResults: petResults,
    fetchAnimals: fetchAnimals
  };

  // console.log("in petContext", valuesToShare);

  return (
    <PetContext.Provider value={valuesToShare}>
      {children}
    </PetContext.Provider>
  );
};

export { Provider };
export default PetContext;
