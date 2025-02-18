"use client";
import { useState, useEffect, ReactElement } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";
import Image from "next/image";

// ---------- Intefaces ----------
interface PetDetails {
  animal: {
    name: string;
    age: string;
    gender: string;
    description: string;
    size: string;
    status: string;
    species: string;
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
      return <span key={characteristic}>{characteristic}</span>
    });
  };

  // ---------- Component ----------
  return (
    <Layout>
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
                    {/* ---------- Image ---------- */}
                    <div className="image-container size-[600px] mx-auto mb-[80px]">
                      {/* Check to see if the data has an image available; if not, set image src to default image */}
                      <Image src={hasPicture ? pet.animal.photos[0].full : "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt={`Picture of ${pet.animal.name}`} width="600" height="600" className="size-full object-cover border-[6px] rounded-xl border-[#422206]" />
                      {/* <Image src={hasPicture ? pet.animal.photos[0].full : "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt={`Picture of ${pet.animal.name}`} fill sizes="100%" className="size-full" /> */}
                    </div>
                    
                    {/* ---------- Intro ---------- */}
                    <div className="pet-intro">
                      <h1 className="text-8xl font-bold">Hi!  I&apos;m {pet.animal.name}.</h1>
                      <p className="font-size-[40px]">
                        I&apos;m {pet.animal.age.toLowerCase() === "adult" ? "an" : "a"} <span className={pet.animal.gender === "Female" ? "text-[#fc7c86]" : "text-[#4369fc]" }>{pet.animal.age.toLowerCase()} {pet.animal.gender.toLowerCase()}</span> {pet.animal.breeds.primary.toLowerCase()}{pet.animal.breeds.secondary ? `, ${pet.animal.breeds.secondary.toLowerCase()} mix.` : "." }&nbsp;
                        I&apos;m a <span className={pet.animal.size === "Small" ? "text-[#007b7f]" : pet.animal.size === "Medium" ? "text-[#d88c00]" : "text-[#d4194d]"}>{pet.animal.size.toLowerCase()}</span> {pet.animal.species.toLowerCase()}. 
                        {pet.animal.tags.length !== 0 ? `Humans describe me as ${characteristics}` : null}
                      </p>
                      <p>I&apos;m <span className={pet.animal.status === "adoptable" ? "text-[#179E00]" : "text-[#000]"}>{pet.animal.status === "adoptable" ? "adoptable" : "taken"}</span>!</p>
                    </div>
                    
                    {/* ---------- Description ---------- */}
                    <div className="pet-description">
                      <h2>Here&apos;s more information about me:</h2>
                      <p>{pet.animal.description}</p>
                    </div>
                    
                    {/* ---------- Location ---------- */}
                    <div className="pet-location">
                      <h2>You can find me here:</h2>
                      <p>{pet.animal.contact.address.address1}</p>
                      <p>{pet.animal.contact.address.city}</p>
                      <p>{pet.animal.contact.address.state}</p>
                      <p>{pet.animal.contact.address.postcode}</p>
                    </div>
                    
                    {/* ---------- Contact ---------- */}
                    <div className="pet-contact">
                      <h2>Interested?  Reach out using the information below!</h2>
                      <p>Email: {pet.animal.contact.email ? pet.animal.contact.email : "Not available"}</p>
                      <p>Phone: {pet.animal.contact.phone ? pet.animal.contact.phone : "Not available"}</p>
                    </div>
                  </div>
                :
                  // otherwise, show the loading status
                  <h1>Loading</h1>
        }
      </div>
    </Layout>
    
  );
};

export default PetDetails;
