"use strict";

const api_key = "df90ad676c260408589f86378c689b7a";
const imageBaseURL = "https://image.tmdb.org/t/p/";

const fetchDataFromServer = function (url, callback, optionalParam) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data, optionalParam));
};

export { api_key, imageBaseURL, fetchDataFromServer };
