"use strict";

import { imageBaseURL } from "./api.js";

export function createMovieCard(movie) {
  const { poster_path, title, vote_average, release_date, id } = movie;

  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.innerHTML = `
              <img src="${imageBaseURL}w342${poster_path}" alt="${title}" class="movie-card__img" loading="lazy">
              <h4 class="movie-card__title">${title}</h4>
              <div class="movie-card__meta">
                <div class="movie-card__rating">
                  <img src="./src/images/star.png" alt="">
                  <span>${vote_average.toFixed(1)}</span>
                </div>
                <p class="movie-card__year">${release_date.split("-")[0]}<p>
              </div>
              <a href="./detail.html" class="movie-card__link" onClick="getMovieDetail(${id})"></a>
  `;

  return card;
}
