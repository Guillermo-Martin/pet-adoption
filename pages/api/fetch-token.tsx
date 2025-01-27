import { NextApiRequest, NextApiResponse } from 'next';

let token: string | null = null;
let tokenType: string | null = null;
let tokenExpiration: number;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ---------- testing ----------
  console.log('fetch token api hit!');
  // res.status(200).json({ message: 'Hello from the server!' });


  // ---------- get data from the client ----------
  const { animal, zipcode } = req.body;
  // console.log(animal, zipcode);



  // Check to see if there's no token or the token has expired, get a new token
  if(token === null || Date.now() >= tokenExpiration) {
    console.log("serverside:  token missing or expired! getting a new token");

    try {
      // ---------- get token ----------
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

      console.log(token, tokenType, tokenExpiration);

      // ---------- fetch pets ----------
      // console.log("serverside", data);

      // ---------- fetch pets ----------
      const petResponse = await fetch(`https://api.petfinder.com/v2/animals?type=${animal}&location=${zipcode}`, {
        method: "GET",
        headers: {
          "Authorization": `${tokenType} ${token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      // convert the data to json
      const searchData = await petResponse.json();
      console.log("serverside: got token then data", searchData);
      
      // send the data to the client
      res.status(200).json(searchData);

    } catch(error) {
      console.error("Error fetching token", error);
      res.status(500).json({ error: "Failed to fetch token" });
    };
  } else {
    console.log("token not expired, so let's fetch some pets!");

    // ---------- fetch pets ----------
    const response = await fetch(`https://api.petfinder.com/v2/animals?type=${animal}&location=${zipcode}`, {
      method: "GET",
      headers: {
        "Authorization": `${tokenType} ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // convert the data to json
    const searchData = await response.json();
    console.log("serverside", searchData);
    
    // send the data to the client
    res.status(200).json(searchData);
  };
};


// *** TO DOS ***
// STEP 1 - GETTING A TOKEN
// X 1. add in the clientId and clientSecret correctly from the environment variables
//    (correct this in the ".env.local" file)
// X 2. after getting the token, store it in a variable
// X 3. store the time the token has before it expires

// STEP 2 - GETTING PET INFORMATION
// 1. check to see if the token has expired.  if it has, request a new one.
// 2. if the token hasn't expired, make an api GET request to "https://api.petfinder.com/v2/types/{type}"
//    (where "{type}" is the animal requested; get this from the client)