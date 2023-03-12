/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 *
 */
const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
  // inside the request callback ...
  // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const IPAddress = JSON.parse(body);
    callback(null, IPAddress.ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  // use request to fetch IP address from JSON API
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
  // inside the request callback ...
  // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    const parsedBody = JSON.parse(body);
    // if no info found
    if (!parsedBody.success) {
      const message = `Status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }

    //const { latitude, longitude } = parsedBody;
    const coords = { latitude: parsedBody.latitude, longitude: parsedBody.longitude };

    callback(null, coords);
  });
};



module.exports = { fetchCoordsByIP };
