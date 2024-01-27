"use strict";

// Import all components and functions
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { sidebar } from "./sidebar.js";

const container = document.querySelector(".container");

const urlParam = window.localStorage.getItem("urlParam");
const genreName = window.localStorage.getItem("genreName");

sidebar();

let currentPage = 1;
let totalPages = 0;

fetchDataFromServer(
  `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`,
  function ({ results: movieList, total_pages }) {
    totalPages = total_pages;

    document.title = `${genreName} Movie - Cineflex`;
    // console.log("working");
    const movieListEl = document.createElement("div");
    movieListEl.classList.add("movie-list");
    movieListEl.innerHTML = `
    <h1 class="movie-list__title">All ${genreName} Movies</h1>
    <div class="movie-list__grid"></div>
    <button class="movie-list__btn">Load More</button>
    `;

    for (const movie of movieList) {
      const movieCard = createMovieCard(movie);
      movieListEl.querySelector(".movie-list__grid").appendChild(movieCard);
    }

    container.appendChild(movieListEl);

    // Loadmore button functionality
    document.querySelector(".movie-list__btn").addEventListener("click", function () {
      console.log("working");
      if (currentPage >= totalPages) {
        this.style.display = "none";
        return;
      }

      currentPage++;
      this.classList.add("loading"); // this == loading-btn

      fetchDataFromServer(
        `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`,
        ({ results: movieList }) => {
          this.classList.remove("loading"); // this == loading-btn

          for (const movie of movieList) {
            const movieCard = createMovieCard(movie);
            movieListEl.querySelector(".movie-list__grid").appendChild(movieCard);
          }
        }
      );
    });
  }
);

search();
