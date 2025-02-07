"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// ---------- Intefaces ----------
interface PetDetails {
  animal: {
    name: string;
    age: string;
    gender: string;
    description: string;
    size: string;
    status: string;
    breeds: {
      primary: string;
      secondary: string;
    };
    photos: {full: string}[] | [];
    tags: string[];
  }
}


function PetDetails() {
  // ----- State -----
  const [pet, setPet] = useState<PetDetails | number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ----- get the pet id from the URL -----
  const params = useParams<{id: string}>();

  // handle case if the "params" type is "undefined"
  if(!params) {
    throw new Error("Unable to get URL information.");
  };

  // destructure id from url
  const { id } = params;
  console.log("here's the pet's id", typeof id);

  // ---------- Make request to get pet by id ----------
  useEffect(() => {
    // function to get pet by id
    const fetchPetById = async (petId: string) => {
      try {
        // set isLoading to "true"
        setIsLoading(true);

        // make a request and get the response
        const response = await fetch(`/api/fetch-animals?id=${petId}`, {
          method: "GET"
        });
  
        // convert the response to data
        const data = await response.json();

        // check to see if individual data was retrieved
        if(data.status === 500) {
          // if not, set pet to "500" (the status)
          setPet(500);
        } else {
          // otherwise add the data to the "pet" state
          setPet(data);
        };
      } catch (error) {
        console.log(error);
      } finally {
        // set isLoading to "false"
        setIsLoading(false);
      };
    };

    // call the function to get the data
    fetchPetById(id);
  }, [id]);

  // ---------- Pet characteristics ----------
  // see if the pet data exists; if so, map through the tags and create an element with
  // the characteristics
  // const renderedChar = pet?.animal.tags.map((char: string) => {
  //   return <p key={char}>{char}</p>
  // });

  // ---------- Component ----------
  return (
    <div>
      {
        // if the status is "500", display error message
        (pet === 500) 
          ? 
            "something went wrong" 
          : 
            // otherwise, load the data.
            // if there's pet data, isLoading is false, and "pet" isn't a number, show the data
            (pet && isLoading === false && typeof pet !== "number")
              ?
                <div>
                  <img src={pet.animal.photos[0].full} />
                  <p>{pet.animal.name}</p>
                  <p>{pet.animal.breeds.primary}, {pet.animal.breeds.secondary}</p>
                  <p>{pet.animal.age}</p>
                  <p>{pet.animal.gender}</p>
                  <p>{pet.animal.description}</p>
                  <p>{pet.animal.size}</p>
                  <p>{pet.animal.status}</p>
                  {/* <div>{renderedChar}</div> */}
                </div>
              :
                // otherwise, show the loading status
                <h1>Loading</h1>
      }
    </div>
  );
};

export default PetDetails;
