"use client";
import { useState, useEffect, ReactElement } from "react";
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
    contact: {
      address: {
        address1: string;
        city: string;
        state: string;
        postcode: string;
      },
      email: string;
      phone: string;
    }
  }
}


function PetDetails() {
  // ----- State -----
  const [pet, setPet] = useState<PetDetails | number | null>(null);
  const [hasPicture, setHasPicture] = useState(false);
  const [hasCharacteristics, setHasCharacteristics] = useState(false);
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

  // variable to hold pet characteristics
  let characteristics: ReactElement[] | undefined = [];


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

        console.log("here is the individual pet data, line 58", data);

        // check to see if individual data was retrieved
        if(data.status === 500) {
          // if not, set pet to "500" (the status)
          setPet(500);
        } else {
          // otherwise add the data to the "pet" state
          setPet(data);
        };

        // check to see if the data has an image, if so, set "hasPicture" to true
        if(data.animal.photos.length !== 0) {
          setHasPicture(true);
        };

        // check to see if the data has animal characteristics, if so, set "hasCharacteristics" to true
        if(data.animal.tags.length !== 0) {
          setHasCharacteristics(true);
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

  // ---------- Rendering pet characteristics ----------
  // typing a map of JSX elements:  https://stackoverflow.com/questions/69210695/type-element-is-not-assignable-to-type-string-ts2322
  if(hasCharacteristics && typeof pet !== "number") {
    characteristics = pet?.animal.tags.map((characteristic: string) => {
      return <p key={characteristic}>{characteristic}</p>
    });
  };

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
                  {/* Check to see if the data has an image available; if not, set image src to default image */}
                  <img src={hasPicture ? pet.animal.photos[0].full : "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} />
                  <p>{pet.animal.name}</p>
                  <p>{pet.animal.breeds.primary}, {pet.animal.breeds.secondary}</p>
                  <p>{pet.animal.age}</p>
                  <p>{pet.animal.gender}</p>
                  <p>{pet.animal.description}</p>
                  <p>{pet.animal.size}</p>
                  <p>{pet.animal.status}</p>
                  <div>{characteristics}</div>
                  <h2>Contact</h2>
                  <p>{pet.animal.contact.address.address1}</p>
                  <p>{pet.animal.contact.address.city}</p>
                  <p>{pet.animal.contact.address.state}</p>
                  <p>{pet.animal.contact.address.postcode}</p>
                </div>
              :
                // otherwise, show the loading status
                <h1>Loading</h1>
      }
    </div>
  );
};

export default PetDetails;
