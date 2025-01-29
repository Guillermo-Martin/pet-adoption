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

// create the context.  Tyep: The data is going to be an array of objects or null
const PetContext = createContext<Animal[] | null>(null);

// create the Provider
function Provider({ children }: ProviderProps) {
  // state
  const [petResults, setPetResults] = useState<Animal[]>([]);


  // functions
  const fetchAnimals = async (type, zipcode) => {
    // make request to "/api/fetch-token" and get a response
    // console.log("In pet context", type, zipcode);

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

    // alert("I'm going to fetch animals!");
  };

  // values to share
  const valuesToShare = {
    petResults: petResults,
    fetchAnimals: fetchAnimals
  };

  console.log("in petContext", valuesToShare);

  return (
    <PetContext.Provider value={valuesToShare}>
      {children}
    </PetContext.Provider>
  );
};

export { Provider };
export default PetContext;



// things to do in here:
// X 1.  define state in here
// X 2.  provide the values to share to the value prop
// 3. define the "fetchAnimals" function here