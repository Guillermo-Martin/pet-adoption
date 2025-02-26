"use client";
import { useState, useEffect, ReactElement } from "react";
import { useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Layout from "@/components/Layout";
import Image from "next/image";
import L from 'leaflet';

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
    };
    type: string;
  };
  orgDetails: {
    organization: {
      name: string;
      address: {
        address1: string;
        city: string;
        state: string;
        postcode: string;
      };
      email: string;
      phone: string;
      website: string;
    };
    coordinates: {
      lat: string;
      long: string;
    };
  }
}




// component
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
  let characteristics: string[] | undefined = [];

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
      return characteristic.toLowerCase();
    });
  };

  // getting the marker to work in React leaflet:  https://github.com/PaulLeCam/react-leaflet/issues/453
  // ---------- Animal icons for map ----------
  const customCatIcon = L.icon({
    iconUrl: "/images/cat-icon.png", // <-- Path inside 'public/'
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [8, -34],
  });

  const customDogIcon = L.icon({
    iconUrl: "/images/dog-icon.png", // <-- Path inside 'public/'
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [8, -34],
  });

  // ---------- Component ----------
  return (
    // <Layout>
      <main className="main-content-container min-h-screen flex items-center justify-center">
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
                    </div>
                    
                    {/* ---------- Intro ---------- */}
                    <div className="pet-intro text-[#422206] mb-[100px]">
                      <h1 className="text-8xl font-bold border-b-[6px] border-b-[#422206] mb-[40px]">Hi!  I&apos;m {pet.animal.name}.</h1>
                      <p className="text-[40px]">
                        I&apos;m {pet.animal.age.toLowerCase() === "adult" ? "an" : "a"} <span className={pet.animal.gender === "Female" ? "text-[#fc7c86]" : "text-[#4369fc]" }>{pet.animal.age.toLowerCase()} {pet.animal.gender.toLowerCase()}</span> {pet.animal.breeds.primary.toLowerCase()}{pet.animal.breeds.secondary ? `, ${pet.animal.breeds.secondary.toLowerCase()} mix.` : "." }&nbsp;
                        I&apos;m a <span className={pet.animal.size === "Small" ? "text-[#007b7f] text-3xl font-extralight" : pet.animal.size === "Medium" ? "text-[#d88c00]" : "text-[#d4194d] text-5xl font-extrabold"}>{pet.animal.size.toLowerCase()}</span> {pet.animal.species.toLowerCase()}.&nbsp;
                        {pet.animal.tags.length !== 0 ? `Humans describe me as ${characteristics?.join(", ")}.` : null}
                      </p>
                      <p className="text-[40px]">I&apos;m <span className={pet.animal.status === "adoptable" ? "text-[#179E00]" : "text-[#000]"}>{pet.animal.status === "adoptable" ? "adoptable" : "taken"}</span>!</p>
                    </div>
                    
                    {/* ---------- Description ---------- */}
                    {/* <div className="pet-description text-[#422206] mb-[100px]">
                      <h2 className="text-[64px] font-bold border-b-[6px] border-b-[#422206] mb-[40px]">Here&apos;s more information about me:</h2>
                      <p className="text-2xl">{pet.animal.description}</p>
                    </div> */}
                    
                    {/* ---------- Location ---------- */}
                    <div className="pet-location text-[#422206] mb-[100px]">
                      <h2 className="text-[64px] font-bold border-b-[6px] border-b-[#422206] mb-[40px]">You can find me here:</h2>
                    
                      {/* ----- Shelter container ----- */}
                      <div className="shelter-container flex justify-content items-center">
                        {/* ----- Shelter info ----- */}
                        <div className="shelter-info w-[50%]">
                          <h3 className="text-[40px]"><a href={pet.orgDetails.organization.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#4369fc]">{pet.orgDetails.organization.website ? pet.orgDetails.organization.name : "Shelter not available"}</a></h3>
                          <p className="text-[40px]">{pet.orgDetails.organization.address.address1}</p>
                          <p className="text-[40px]">{pet.orgDetails.organization.address.city}, {pet.orgDetails.organization.address.state} {pet.orgDetails.organization.address.postcode}</p>
                        </div>
                      
                        {/* ----------- MAP ---------- */}
                        {/* Getting the leaflet map setup correctly: https://react-leaflet.js.org/docs/start-setup/ and https://github.com/PaulLeCam/react-leaflet/issues/1052 */}
                        <MapContainer center={[parseFloat(pet.orgDetails.coordinates.lat), parseFloat(pet.orgDetails.coordinates.long)]} zoom={16} scrollWheelZoom={false} className="h-[400px] w-[50%]">
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[parseFloat(pet.orgDetails.coordinates.lat), parseFloat(pet.orgDetails.coordinates.long)]} icon={ pet.animal.type === "Dog" ? customDogIcon : customCatIcon }>
                            <Popup>
                              {pet.orgDetails.organization.name}
                              <br />
                              {pet.orgDetails.organization.address.address1}
                              <br />
                              {pet.orgDetails.organization.address.city}, {pet.orgDetails.organization.address.state} {pet.orgDetails.organization.address.postcode}
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    </div>
                    
                    {/* ---------- Contact ---------- */}
                    <div className="pet-contact text-[#422206] mb-[100px]">
                      <h2 className="text-[64px] font-bold border-b-[6px] border-b-[#422206] mb-[40px]">Interested?  Reach out using the information below!</h2>
                      <p className="text-2xl"><span className="font-bold">Email:</span> <a href={`mailto:${pet.orgDetails.organization.email}`} className="underline hover:text-[#4369fc]">{pet.orgDetails.organization.email ? pet.orgDetails.organization.email : "Not available"}</a></p>
                      <p className="text-2xl"><span className="font-bold">Phone:</span> {pet.orgDetails.organization.phone ? pet.orgDetails.organization.phone : "Not available"}</p>
                      <p className="text-2xl"><span className="font-bold">Website:</span> <a href={pet.orgDetails.organization.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#4369fc]">{pet.orgDetails.organization.website ? pet.orgDetails.organization.website : "Not available"}</a></p>
                    </div>
                  </div>
                :
                  // otherwise, show the loading status
                  // <h1>Loading...</h1>
                  "Loading..."
        }
      </main>
    // </Layout>
    
  );
};

export default PetDetails;
