const express = require('express');
const axios = require('axios');
const app = express();
const cheerio = require('cheerio'); // Import cheerio
const PORT = 3000;
let fr = "Network Error";
let it = "Network Error";
let be = "Network Error";
let uk = "Network Error";
let es = "Network Error";
let se = "Network Error";
let nl = "Network Error";
let pl = "Network Error";
let sfr, sit, sbe, suk, ses, sse, snl, spl;


// Middleware to parse JSON request bodies
app.use(express.json());




function extractNumericValue(input) {
    if (typeof input === "string") {
      // Use a regular expression to match numeric parts (including commas and periods)
      const matches = input.match(/[0-9,\.]+/g);
  
      if (matches) {
        // Join all matched numeric parts and replace any commas with periods (for numeric value formatting)
        const numericValue = matches.join('').replace(',', '.');
  
        return parseFloat(numericValue);
      }
    }
  
    return null; // Return null if no numeric value is found or if input is not a string
  }
  



function getShipping(country) {
    if (country !== "Not Found") {
        const regexPattern = /data-csa-c-delivery-price="([^"]*)"/;

        // Use the regular expression to extract the attribute value
        const match = country.match(regexPattern);

        if (match && match.length > 1) {
            const deliveryPrice = match[1];
            return deliveryPrice;
            console.log(deliveryPrice);
        } else {
            return "devlivery not found "
            console.log("Attribute not found.");
        }
    }
}


// Define the price function
function price(country) {
    if (country !== "Not Found") {
        const $ = cheerio.load(country); // Load the HTML content using cheerio

        // Find the parent element with the specified class
        const parentElement = $('.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay');

        if (parentElement.length > 0) {
            // Find the "a-offscreen" element within the parent element
            const aOffscreenElement = parentElement.find('.a-offscreen');

            if (aOffscreenElement.length > 0) {
                // Get the text content of the "a-offscreen" element
                const value = aOffscreenElement.text().trim();
                console.log("Value: " + value);
                return value;
            } else {
                console.log("a-offscreen element not found within the parent element.");
                return "Unavailable";
            }
        } else {
            console.log("Parent element not found.");
            return "Unavailable";
        }
    }
}

// ... (rest of your code)
//By importing and using cheerio, you can parse the HTML content within a Node.js environment. This should resolve the "ReferenceError: DOMParser is not defined" issue and allow you to parse HTML content successfully.







async  function getPrice() {
    // Call the price function for each country if it's not "Not Found"
    if (fr != "Not Found" && fr != "Network Error" && fr != undefined) {
        sfr = getShipping(fr);
        fr = price(fr);
    }
    if (it != "Not Found" && it != "Network Error" && it != undefined) {
        sit = getShipping(it);
        it = price(it);
    }
    if (be != "Not Found" && be != "Network Error" && be != undefined) {
        sbe = getShipping(be);
        be = price(be);
    }
    if (uk != "Not Found" && uk != "Network Error" && uk != undefined) {
        suk = getShipping(uk);
        uk = price(uk);
    }
    if (es != "Not Found" && es != "Network Error" && es != undefined) {
        ses = getShipping(es);
        es = price(es);
    }
    if (se != "Not Found" && se != "Network Error" && se != undefined) {
        sse = getShipping(se);
        se = price(se);
    }
    if (nl != "Not Found" && nl != "Network Error" && nl != undefined) {
        snl = getShipping(nl);
        nl = price(nl);
    }
    if (pl != "Not Found" && pl != "Network Error" && pl != undefined) {
        spl = getShipping(pl);
        pl = price(pl);
    }





    sfr = extractNumericValue(sfr);
    sit = extractNumericValue(sit);
    sbe = extractNumericValue(sbe);
    suk = extractNumericValue(suk);
    ses = extractNumericValue(ses);
    sse = extractNumericValue(sse);
    snl = extractNumericValue(snl);
    spl = extractNumericValue(spl);

    //   console.log("sfr:", sfr); // Output: 32.49
    //   console.log("sit:", sit); // Output: 27.87
    //   console.log("sbe:", sbe); // Output: null
    //   console.log("suk:", suk); // Output: null
    //   console.log("ses:", ses); // Output: 21.67
    //   console.log("sse:", sse); // Output: null
    //   console.log("snl:", snl); // Output: null
    //   console.log("spl:", spl); // Output: null
    // It's unclear where 'element' comes from. You should define and use it appropriately.
    // if (element) {
    //   // Get the text content of the element
    //   var textContent = element.textContent.trim();
    //   console.log(textContent);
    // } else {
    //   console.log("Element not found.");
    //   console.log("sfr: " + sfr);
    //   console.log("sit: " + sit);
    //   console.log("sbe: " + sbe);
    //   console.log("suk: " + suk);
    //   console.log("ses: " + ses);
    //   console.log("sse: " + sse);
    //   console.log("snl: " + snl);
    //   console.log("spl: " + spl);

    // }
}

app.post('/fetch-data', async (req, res) => {
    try {
        // Get the productN from the request
        const { productN } = req.body;

        // Define the array of Amazon URLs
        const urls = [
            "https://www.amazon.fr/dp/" + productN,
            "https://www.amazon.it/dp/" + productN,
            "https://www.amazon.com.be/dp/" + productN,
            "https://www.amazon.co.uk/dp/" + productN,
            "https://www.amazon.es/dp/" + productN,
            "https://www.amazon.se/dp/" + productN,
            "https://www.amazon.nl/dp/" + productN,
            "https://www.amazon.pl/dp/" + productN
        ];

        // Create an array of fetch promises for each URL
        const fetchPromises = urls.map(url => axios.get(url).catch(() => "Network Error"));

        // Use Promise.all to wait for all requests to complete
        const responses = await Promise.all(fetchPromises);

        // Process the responses
        const data = {};
        responses.forEach((response, index) => {
            if (response !== "Network Error") {
                data[index] = response.data;
                //    console.log(`Amazon data ${index}:`, response.data);
            } else {
                data[index] = "Not Found";
                //  console.log(`Amazon data ${index}: Not Found`);
            }
        });

        fr = data[0];
        it = data[1];
        be = data[2];
        uk = data[3];
        es = data[4];
        se = data[5];
        nl = data[6];
        pl = data[7];

        await getPrice();

        // Create a new response object with updated data
        const newdata = {
            fr: [fr,sfr],
            it: [it,sit],
            be: [be, sbe],
            uk: [uk,suk],
            es: [es,ses],
            se: [se,sse],
            nl: [nl,snl],
            pl: [pl,spl],
        
        }

        res.json(newdata);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
