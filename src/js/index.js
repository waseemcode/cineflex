"use strict";

// Import all components and functions
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { sidebar } from "./sidebar.js";
import { search } from "./search.js";

const container = document.querySelector(".container");

sidebar();

/**
 * Home page sections (Top rated, Upcoming, Trending movies)
 */

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "/movie/upcoming",
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending/movie/week",
  },
  {
    title: "Top Rated Movies",
    path: "/movie/top_rated",
  },
];

const genreList = {
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]);
    }

    return newGenreList.join(", ");
  },
};

// Fetching genre list and popular movies list data for banner slider and control
fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  fetchDataFromServer(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`, heroBanner);
});

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");

  banner.innerHTML = `
    <div class="slider" banner-slider></div>
    <div class="control">
    <div class="control__box"></div>
    </div>
  `;

  let sliderControlIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const { backdrop_path, title, release_date, genre_ids, overview, poster_path, vote_average, id } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider__item");

    sliderItem.innerHTML = `
              <div class="slider__item--content">
                <h1 class="slider__item--title">${title}</h1>
                <div class="slider__item--meta">
                  <div class="year">${release_date?.split("-")[0] ?? "Not Released"}</div>
                  <div class="rating">${vote_average.toFixed(1)}</div>
                </div>
                <div class="slider__item--genre">${genreList.asString(genre_ids)}</div>
                <div class="slider__item--description">
                  ${overview}
                </div>
                <a href="./detail.html" class="slider__item--btn" onClick="getMovieDetail(${id})">
                  <img src="./src/images/play_circle.png" alt="">
                  <span>Watch Now</span>
                </a>
              </div>
              <img src="${imageBaseURL}w1280${backdrop_path}" alt="${title}" class="slider__item--img" loading=${
      index === 0 ? "eager" : "lazy"
    }>
    `;

    // Appending the sliderItem
    banner.querySelector(".slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box");
    controlItem.setAttribute("slider-control", `${sliderControlIndex}`);

    sliderControlIndex++;

    controlItem.innerHTML = `
    <img src="${imageBaseURL}w154${poster_path}" alt="Slide to ${title}">
    `;

    // Appending the controlItem
    banner.querySelector(".control__box").appendChild(controlItem);
  }

  container.appendChild(banner);

  // Hero Slider Functionality
  addHeroSlide();

  // fetch data for home page sections
  for (const { title, path } of homePageSections) {
    fetchDataFromServer(`https://api.themoviedb.org/3${path}?api_key=${api_key}&page=1`, createMovieList, title);
  }
};

const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll(".slider__item");
  const posterBoxes = document.querySelectorAll(".poster-box");

  let lastSliderItem = sliderItems[0];
  let lastPosterBox = posterBoxes[0];

  lastSliderItem.classList.add("active");
  lastPosterBox.classList.add("active");

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastPosterBox.classList.remove("active");

    sliderItems[Number(this.getAttribute("slider-control"))].classList.add("active");
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastPosterBox = this;
  };

  addEventOnElements(posterBoxes, "click", sliderStart);
};

const createMovieList = function ({ results: movieList }, title) {
  const slider = document.createElement("section");
  slider.classList.add("slider");
  slider.innerHTML = `
    <h1 class="slider__title">${title}</h1>
    <div class="slider__content"></div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);
    slider.querySelector(".slider__content").appendChild(movieCard);
  }

  container.appendChild(slider);
};

search();
