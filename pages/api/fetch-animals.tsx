import { NextApiRequest, NextApiResponse } from 'next';
import type { Animal } from "@/interfaces/Animal";

// Configuration for "API resolved without sending a response" message
// https://github.com/vercel/next.js/discussions/40270
export const config = {
  api: {
    externalResolver: true,
  },
};

// --------------------------------------------------------------------
//                            Interfaces
// --------------------------------------------------------------------
interface Token {
  token_type: string;
  expires_in: number;
  access_token: null | string;
}

interface FetchPetsInfo {
  animal: string;
  zipcode: string;
  searchResults: Animal[];
};

interface SearchResults {
  animals: Animal[];
};


// --------------------------------------------------------------------
//                                Data
// --------------------------------------------------------------------
// Token information
const tokenInformation: Token = {
  token_type: "",
  expires_in: 0,
  access_token: null
};

// Pet information and search results
const fetchPetsInfo: FetchPetsInfo = {
  animal: "",
  zipcode: "",
  searchResults: []
};

// --------------------------------------------------------------------
//                             Handler
// --------------------------------------------------------------------
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ---------- Get data from the client, add it to the "fetchPetsInfo" object ----------
  const { type, zipcode, id } = req.query as { type: string; zipcode: string; id: string | null };
  fetchPetsInfo.animal = type;
  fetchPetsInfo.zipcode = zipcode;

  // --------------------------------------------------------------------
  //                            Functions
  // --------------------------------------------------------------------
  // ---------- Get a token ----------
  const getToken = async () => {
    try {
      // make an API request to get a token; make a POST request since we're sending some data to get a token
      const response = await fetch("https://api.petfinder.com/v2/oauth2/token",
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
        }
      );

      // convert the data to json
      const data: Token = await response.json();

      // store the token information in the "tokenInformation" object
      tokenInformation.access_token = data.access_token;
      tokenInformation.token_type = data.token_type;
      tokenInformation.expires_in = Date.now() + data.expires_in * 1000;
    } catch(error) {
      // if there's a problem fetching a token, respond with an error
      console.error("Error fetching token", error);
      res.status(500).json({ error: "Failed to fetch token", status: 500, searchResults: [] });
    };
  };

  // ---------- Get all pets ----------
  const getAllPets = async (obj: FetchPetsInfo) => {
    // function to make the request
    const fetchAllPets = async () => {
      try {
        // make request to get search results
        const response = await fetch(`https://api.petfinder.com/v2/animals?type=${obj.animal}&location=${obj.zipcode}`, {
          method: "GET",
          headers: {
            "Authorization": `${tokenInformation.token_type} ${tokenInformation.access_token}`,
          }
        });

        // ----- Error handling -----
        // check to see if the status was ok (status code of 200).
        // If it wasn't, throw a new Error and cause the "catch" block to run.
        if(response.status !== 200) {
          throw new Error(`Something went wrong. Status code: ${response.status}`);
        } else {
          // otherwise, convert the data to JSON, store it in the "fetchPetsInfo" object, then send "fetchPetsInfo" to the client
          const searchData: SearchResults = await response.json();
          fetchPetsInfo.searchResults = searchData.animals;
          res.status(200).json(fetchPetsInfo);
        };
      } catch(error) {
        // if there was an error, respond with an object with the error, status, and empty searchResults
        console.error("Error fetching search results.", error);
        res.status(500).json({ error: "Failed to fetch search results.", status: 500, searchResults: [] });
      };
    };

    // check to see if a token has already been retrieved and isn't expired
    if(tokenInformation.access_token && !(Date.now() >= tokenInformation.expires_in || tokenInformation.expires_in === null)) {
      // make the request
      fetchAllPets();
    } else {
      // if a token hasn't been retrieved (or is expired) get one...
      await getToken();

      // ...then make the request
      fetchAllPets();
    };
  };

  // ---------- Get pet by id ----------
  const getPetById = async (id: string) => {
    // function to make the request
    const fetchPetById = async () => {
      try {
        // make request to get individual pet
        const petResponse = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `${tokenInformation.token_type} ${tokenInformation.access_token}`,
          }
        });

        // ----- Error handling -----
        // check to see if the status was ok (status code of 200).
        // If it wasn't, throw a new Error and cause the "catch" block to run.
        if(petResponse.status !== 200) {
          throw new Error(`Something went wrong. Status code: ${petResponse.status}`);
        };

        // otherwise, get the data and send it to the client
        // convert response to json
        const petData = await petResponse.json();
        
        // get pet organization details
        const orgHref = petData.animal._links.organization.href;
        const petOrg = await fetch(`https://api.petfinder.com${orgHref}`, {
          method: "GET",
          headers: {
            "Authorization": `${tokenInformation.token_type} ${tokenInformation.access_token}`,
          }
        });

        // convert pet organization details to json
        const petOrgData = await petOrg.json();

        // add orgDetails to petData
        petData.orgDetails = petOrgData;

        // ----- create the shelter's address -----
        // variable to hold shelter address
        let orgAddress;

        // check to see if "address1" exists or contains a PO box
        if(petOrgData.organization.address.address1 === null || petOrgData.organization.address.address1.includes("P.O.")) {
          // if so, the address is city, state, and zipcode
          orgAddress = `${petOrgData.organization.address.city}, ${petOrgData.organization.address.state} ${petOrgData.organization.address.postcode}`;
        } else {
          // otherwise, create the full address
          orgAddress = `${petOrgData.organization.address.address1}, ${petOrgData.organization.address.city}, ${petOrgData.organization.address.state} ${petOrgData.organization.address.postcode}`;
        };

        // convert the address into coordinates
        const coordinatesRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${orgAddress}`); 
        const coordinateData = await coordinatesRes.json();

        // check to see if coordinate data array is 0
        // if coordinate data array is 0 (coordinate data somehow couldn't be obtained), then make another request to get coordinates from just the city
        if(coordinateData.length === 0) {
          orgAddress = `${petOrgData.organization.address.city}, ${petOrgData.organization.address.state} ${petOrgData.organization.address.postcode}`;
          const newCoordinatesRes = await await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${orgAddress}`);
          const newCoordinateData = await newCoordinatesRes.json();

          // add new coordinate data to the petData
          petData.orgDetails.coordinates = {lat: newCoordinateData[0].lat, long: newCoordinateData[0].lon};
        } else {
          // add the original coordinate data to the petData
          petData.orgDetails.coordinates = {lat: coordinateData[0].lat, long: coordinateData[0].lon};
        };

        // send petData to the client
        res.status(200).json(petData);
      } catch(error) {
        // if there was an error, respond with an object with the error and status
        console.error("Error fetching pet by id.", error);
        res.status(500).json({ error: "Failed to fetch individual pet data.", status: 500 });
      };
    };

    // check to see if a token has already been retrieved and isn't expired
    if(tokenInformation.access_token && !(Date.now() >= tokenInformation.expires_in || tokenInformation.expires_in === null)) {
      // then make the api request
      await fetchPetById();
    } else {
      // if a token hasn't been retrieved (or is expired) get one...
      await getToken();

      // ...then make the request
      await fetchPetById();
    };
  };

  
  // --------------------------------------------------------------------
  //                 Determining the type of request
  // --------------------------------------------------------------------
  // ---------- GET request to get all pets ----------
  if(req.method === "GET" && type && zipcode) {
    getAllPets(fetchPetsInfo);
  } else if(req.method === "GET" && id) {
    // ---------- GET request to get pet by id ----------
    getPetById(id);
  };
};
