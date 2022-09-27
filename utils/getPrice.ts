
/* Example in Node.js */
const axios = require('axios');


let response = null;
new Promise(async (resolve, reject) => {
  try {
    response = await axios.get('https://sandbox-api.coinmarketcap.com/v2/tools/price-conversion', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.API_KEY,
      },
    });
  } catch(ex) {
    response = null;
    // error
    console.log(ex);
    reject(ex);
  }
  if (response) {
    // success
    const json = response.data;
    console.log(json);
    resolve(json);
  }
});