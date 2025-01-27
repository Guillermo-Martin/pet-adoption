import { NextApiRequest, NextApiResponse } from 'next';

// Configuration for "API resolved without sending a response" message
// https://github.com/vercel/next.js/discussions/40270
export const config = {
  api: {
    externalResolver: true,
  },
}

let token: string | null = null;
let tokenType: string | null = null;
let tokenExpiration: number;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ---------- testing ----------
  console.log('fetch token api hit!');

  // ---------- get data from the client ----------
  const { animal, zipcode } = req.body;

  // ---------- Functions ---------
  const fetchPets = async (animal, zipcode, tokenType, token) => {
    // make request to get search results
    const response = await fetch(`https://api.petfinder.com/v2/animals?type=${animal}&location=${zipcode}`, {
      method: "GET",
      headers: {
        "Authorization": `${tokenType} ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // convert the data to JSON, then send it to the client
    const searchData = await response.json();
    // console.log("serverside", searchData);
    
    // send the data to the client
    res.status(200).json(searchData);
  };


  // Check to see if there's no token or the token has expired, get a new token
  if(token === null || Date.now() >= tokenExpiration) {
    console.log("serverside:  token missing or expired! getting a new token");

    try {
      // ---------- 1. Get token ----------
      // make an API request to get a token make a POST request since we're sending some data to get a token
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
      const data = await response.json();

      // store the token information
      token = data.access_token;
      tokenType = data.token_type;
      tokenExpiration = Date.now() + data.expires_in * 1000;


      // ---------- 2. Fetch pets ----------
      
      fetchPets(animal, zipcode, tokenType, token);

    } catch(error) {
      console.error("Error fetching token", error);
      res.status(500).json({ error: "Failed to fetch token" });
    };
  } else {
    console.log("token not expired, so let's fetch some pets!");

    // ---------- fetch pets ----------
    fetchPets(animal, zipcode, tokenType, token);
  };
};
