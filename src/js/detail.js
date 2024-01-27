"use strict";

// Import all components and functions
import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { sidebar } from "./sidebar.js";

const container = document.querySelector(".container");

sidebar();

const getGenres = function (genres) {
  let x = [];
  for (const { id, name } of genres) {
    x.push(name);
  }
  return x.join(", ");
};

const getCasts = function (cast) {
  let x = [];
  let count = 0;
  for (const { name } of cast) {
    if (count < 10) {
      x.push(name);
    }
    count++;
  }
  return x.join(", ");
};

const getDirectors = function (crew) {
  let x = [];
  for (const { name, job } of crew) {
    if (job === "Director") {
      x.push(name);
    }
  }
  return x.join(", ");
};

const filterVideos = function (videos) {
  let x = [];
  for (const { key, name } of videos) {
    x.push({ key, name });
  }
  return x;
};

const movieId = window.localStorage.getItem("movieId");

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=casts,videos,images,releases&api_key=${api_key}`,
  movieDetail
);

function movieDetail(movie) {
  console.log(movie);
  const {
    backdrop_path,
    poster_path,
    title,
    release_date,
    runtime,
    vote_average,
    releases: {
      countries: [{ certification } = { certification: "N/A" }],
    },
    genres,
    overview,
    casts: { cast, crew },
    videos: { results: videos },
  } = movie;

  document.title = `${title} - Cineflex`;

  const detail = document.createElement("section");
  detail.classList.add("detail");

  detail.innerHTML = `
          <div class="detail__bg" style="background-image: url('${imageBaseURL}/w1280/${backdrop_path}')"></div>
          <div class="detail__img">
            <img src="${imageBaseURL}w342${poster_path}" alt="">
          </div>
          <div class="detail__content">
            <div class="detail__content--box">
              <h1 class="detail__content--title">${title}</h1>
              <div class="detail__content--meta">
                <div class="detail__content--rating">
                  <img src="./src/images/star.png" alt="">
                  <span>${vote_average.toFixed(1)}</span>
                </div>
                <div class="detail__content--separater"></div>
                <span class="detail__content--runtime">${runtime}m</span>
                <div class="detail__content--separater"></div>
                <span class="detail__content--year">${release_date?.split("-")[0] ?? "Not Released"}</span>
                <span class="detail__content--badge">${certification}</span>
              </div>
              <p class="detail__content--genre">${getGenres(genres)}</p>
              <p class="detail__content--description">
                ${overview}
              </p>
              <div class="detail__content--team">
                <span class="title">Starring</span>
                <span class="content">${getCasts(cast)}
                </span>
              </div>
              <div class="detail__content--team">
                <span class="title">Directed By</span>
                <span class="content">${getDirectors(crew)}</span>
              </div>
            </div>
            <div class="slider">
              <h1 class="slider__title">Trailers and Clips</h1>
              <div class="slider__content"></div>
            </div>
          </div>
  `;

  for (const { key, name } of filterVideos(videos)) {
    const videoCard = document.createElement("div");
    videoCard.classList.add("video-card");
    videoCard.innerHTML = `
    <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0"
        frameborder="0" allowfullscreen="1" title="${name}" loading="lazy"></iframe>
    `;

    detail.querySelector(".slider__content").appendChild(videoCard);
  }

  container.appendChild(detail);

  // Implemetnign the bottom slider on detail page
  fetchDataFromServer(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&page=1`,
    addSuggestedMovies,
    "You May Also Like"
  );
}

const addSuggestedMovies = function ({ results: movieList }, title) {
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
