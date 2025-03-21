"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";
import Image from "next/image";
import L from 'leaflet';


// --------------------------------------------------------------------
//                            Interfaces
// --------------------------------------------------------------------
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
};

// --------------------------------------------------------------------
//                            Component
// --------------------------------------------------------------------
function PetDetails() {
  // ---------- State ----------
  const [pet, setPet] = useState<PetDetails | number | null>(null);
  const [hasPicture, setHasPicture] = useState(false);
  const [hasCharacteristics, setHasCharacteristics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ---------- get the pet id from the URL ----------
  const params = useParams<{id: string}>();

  // handle case if the "params" type is "undefined"
  if(!params) {
    throw new Error("Unable to get URL information.");
  };

  // destructure id from url
  const { id } = params;

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
        console.error("Error", error);
        setHasError(true);
      } finally {
        // set isLoading to "false"
        setIsLoading(false);
      };
    };

    // call the function to get the data
    fetchPetById(id);
  }, [id]);

  // ---------- Destructuring variables ----------
  // if pet isn't null, and it's not a number (apply type narrowing since "pet" can be more than one type) then destructure from pet.animal/pet.orgDetails
  // in this example, there's the possibility "pet" can be false, so handle that case by using an empty object if pet is false
  const { name, age, gender, breeds, size, species, tags, status, photos, type } = (pet !== null && typeof pet !== "number") ? pet.animal : {};
  const { website, address, email, phone } = (pet !== null && typeof pet !== "number") ? pet.orgDetails.organization : {};
  const { organization } = (pet !== null && typeof pet !== "number") ? pet.orgDetails : {};
  const { lat, long } = (pet !== null && typeof pet !== "number") ? pet.orgDetails.coordinates : {};

  // ---------- Rendering pet characteristics ----------
  // typing a map of JSX elements:  https://stackoverflow.com/questions/69210695/type-element-is-not-assignable-to-type-string-ts2322
  if(hasCharacteristics && typeof pet !== "number") {
    characteristics = tags?.map((characteristic: string) => {
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
    <> 
      {
        // if the status is "500", display error message...
        (pet === 500 || hasError) 
          ? 
          <main className="min-h-screen flex items-center justify-center px-4 py-3 md:px-16 md:py-4 xl:px-20">
            <LoadingScreen message="Hmm...something went wrong!" imageSrc="/images/wrong-dog.png" alt="Dog with 'x's for eyes" error />
          </main>
          : 
            // ...otherwise, load the data.
            // if there's pet data, "isLoading" is false, and "pet" isn't a number, show the data...
            (pet && isLoading === false && typeof pet !== "number")
              ?
                <Layout>
                    {/* ---------- Image ---------- */}
                    {/* If a picture is available, use "mb-10" for bottom, margin, otherwise, use a custom margin */}
                    <div className={`image-container w-full md:max-w-7xl flex justify-center items-center ${hasPicture ? "mb-10" : "mb-16 md:my-[100px]"}`}>
                      {/* Check to see if the data has an image available; if not, set image src to default image */}
                      {
                        hasPicture 
                        ? 
                          // <Image src={hasPicture ? pet.animal.photos[0].full : "/images/wrong-dog.png"} alt={`Picture of ${pet.animal.name}`} width="600" height="600" className="pet-details-image size-full aspect-square object-cover border-[6px] rounded-xl w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[600px]" />
                          <Image src={(hasPicture && photos) ? photos[0].full : "/images/wrong-dog.png"} alt={`Picture of ${name}`} width="600" height="600" className="pet-details-image size-full aspect-square object-cover border-[6px] rounded-xl w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[600px]" />
                        : 
                          <div className="no-image bg-[#fff5eb] h-full flex justify-center items-center flex-col">
                            <div className="no-image-content">
                              <Image src="/images/wrong-dog.png" alt="Dog with 'x's for eyes" width={200} height={200} className="max-w-[200px] mx-auto mb-5"/>
                              <p className="h-full text-center">No image available.</p>
                            </div>
                          </div>
                        }
                    </div>
                    
                    {/* ---------- Intro ---------- */}
                    <div className="pet-intro mb-10 md:mb-20">
                      {/* ----- Name ----- */}
                      <h1 className="text-5xl lg:text-7xl 2xl:text-8xl font-bold border-b-[6px] mb-[40px]">Hi!  I&apos;m {name}.</h1>
                      
                      {/* ----- General description ----- */}
                      <p className="text-base md:text-3xl lg:text-4xl 2xl:text-5xl mb-4 xl:mb-6">
                        I&apos;m {age?.toLowerCase() === "adult" ? "an" : "a"} <span className={gender === "Female" ? "text-[#fc7c86]" : "text-[#4369fc]" }>{age?.toLowerCase()} {gender?.toLowerCase()}</span> {breeds?.primary.toLowerCase()}{breeds?.secondary ? `, ${breeds.secondary.toLowerCase()} mix.` : "." }&nbsp;
                        I&apos;m a <span className={size === "Small" ? "text-[#007b7f] text-3xl font-extralight" : size === "Medium" ? "text-[#d88c00]" : "text-[#d4194d] text-3xl md:text-5xl lg:text-6xl font-extrabold"}>{size?.toLowerCase()}</span> {species?.toLowerCase()}.&nbsp;
                        {tags?.length !== 0 ? `Humans describe me as ${characteristics?.join(", ")}.` : null}
                      </p>
                      <p className="text-base md:text-3xl lg:text-4xl 2xl:text-5xl">I&apos;m <span className={status === "adoptable" ? "text-[#179E00]" : "text-[#d4194d]"}>{status === "adoptable" ? "adoptable" : "taken"}</span>!</p>
                    </div>
                    
                    {/* ---------- Location ---------- */}
                    <div className="pet-location mb-10 md:mb-20">
                      <h2 className="text-3xl lg:text-4xl 2xl:text-6xl font-bold border-b-[6px] mb-[40px]">You can find me here:</h2>
                    
                      {/* ----- Shelter container ----- */}
                      <div className="shelter-container flex justify-content items-center flex-col-reverse lg:flex-row">
                        {/* ----- Shelter info ----- */}
                        <div className="shelter-info w-full lg:w-[50%] lg:pr-8">
                          {/* Shelter name and link (conditionally rendered) */}
                          <h3 className="text-base md:text-2xl 2xl:text-3xl">
                            {
                              // If shelter name and website are available, render the organization name as a link
                              website && organization?.name 
                              ? <a href={website} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#4369fc] transition duration-150">{organization.name}</a>
                              // If shelter name is available but website isn't available, just render the name
                              : organization?.name && !website
                                ? <span>{organization.name}</span>
                                // If shelter name isn't available but website is available, just render the website
                                : <a href={website} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#4369fc]">{website}</a>
                            }
                          </h3>
                          
                          {/* Shelter address */}
                          <p className="text-base md:text-xl 2xl:text-2xl">{address?.address1}</p>
                          <p className="text-base md:text-xl 2xl:text-2xl">{address?.city}, {address?.state} {address?.postcode}</p>
                        </div>
                      
                        {/* ----------- MAP ---------- */}
                        {/* Getting the leaflet map setup correctly: https://react-leaflet.js.org/docs/start-setup/ and https://github.com/PaulLeCam/react-leaflet/issues/1052 */}
                        <MapContainer center={[parseFloat(lat as string), parseFloat(long as string)]} zoom={16} scrollWheelZoom={false} className="pet-map h-[300px] sm:h-[400px] xl:h-[500px] w-full xl:max-w-[700px] lg:w-[50%] xl:w-[75%] px-4 mb-8 border-[6px] rounded-xl">
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[parseFloat(lat as string), parseFloat(long as string)]} icon={ type === "Dog" ? customDogIcon : customCatIcon }>
                            <Popup>
                              {organization?.name}
                              {/* if the organization name exists, add a break, otherwise don't */}
                              {organization?.name && <br />}
                              {address?.address1}
                              {/* if address exists add a break, otherwise don't */}
                              {address?.address1 && <br />}
                              {address?.city}, {address?.state} {address?.postcode}
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>
                    </div>
                    
                    {/* ---------- Contact ---------- */}
                    <div className="pet-contact mb-20">
                      <h2 className="text-3xl lg:text-4xl 2xl:text-6xl font-bold border-b-[6px] mb-[40px]">Interested?  Reach out using the information below!</h2>
                      <p className="text-base md:text-xl 2xl:text-2xl" ><span className="font-bold">Email:</span> {email ? <a href={`mailto:${email}`} className="underline hover:text-[#4369fc] transition duration-150">{email}</a> : "Not available."}</p>
                      <p className="text-base md:text-xl 2xl:text-2xl"><span className="font-bold">Phone:</span> {phone ? phone : "Not available."}</p>
                      <p className="text-base md:text-xl 2xl:text-2xl"><span className="font-bold">Website:</span> {website ? <a href={website} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#4369fc] transition duration-150">{website}</a> : "Not available."}</p>
                    </div>
                </Layout>
              :
                // ...otherwise, show the loading status
                <main className="min-h-screen flex items-center justify-center px-4 py-3 md:px-16 md:py-4 xl:px-20">
                  <LoadingScreen message="Getting more details on your new best friend..." imageSrc="/images/dog-icon.png" alt="Dog winking" error={false} />
                </main>
      }
    </>
  );
};

export default PetDetails;
