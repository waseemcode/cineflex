"use strict";

import { api_key, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
  const headerSearch = document.querySelector(".header__search");
  const headerSearchInput = document.querySelector(".header__search--input");
  //   headerSearch.classList.add("loading");

  const searchResultModal = document.createElement("div");
  searchResultModal.classList.add("search-modal");
  document.querySelector(".main").appendChild(searchResultModal);

  let searchTimeout;

  headerSearchInput.addEventListener("input", function () {
    if (!this.value.trim()) {
      searchResultModal.classList.remove("active");
      headerSearch.classList.remove("loading");
      clearTimeout(searchTimeout);
      return;
    }

    headerSearch.classList.add("loading");
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(function () {
      fetchDataFromServer(
        `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${headerSearchInput.value}&page=1&include_adult=false`,
        function ({ results: movieList }) {
          headerSearch.classList.remove("loading");
          searchResultModal.classList.add("active");
          searchResultModal.innerHTML = "";

          searchResultModal.innerHTML = `
          <p class="search-modal__label">Results for</p>
          <h1 class="search-modal__title">${headerSearchInput.value}</h1>
          <div class="search-modal__grid"></div>
          `;

          for (const movie of movieList) {
            console.log(movie);
            const movieCard = createMovieCard(movie);
            searchResultModal.querySelector(".search-modal__grid").appendChild(movieCard);
          }
        }
      );
    }, 500);
  });
}
