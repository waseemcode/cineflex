"use strict";

import { api_key, fetchDataFromServer } from "./api.js";

export function sidebar() {
  const genreList = {};

  fetchDataFromServer(`https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`, function ({ genres }) {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }

    genreLink();
  });

  const sidebar = document.createElement("div");
  sidebar.classList.add("sidebar");
  sidebar.innerHTML = `
        <ul class="sidebar__list">
          <li class="sidebar__item">
            <a href="#/" class="sidebar__link sidebar__title">Genre</a>
          </li>
        </ul>
        <ul class="sidebar__list">
          <li class="sidebar__item">
            <a href="#/" class="sidebar__link sidebar__title">Language</a>
          </li>
          <li class="sidebar__item">
            <a href="./movie-list.html" class="sidebar__link" onClick='getMovieList("with_original_language=en", "English")'>English</a>
          </li>
          <li class="sidebar__item">
            <a href="./movie-list.html" class="sidebar__link" onClick='getMovieList("with_original_language=hi", "Hindi")'>Hindi</a>
          </li>
          <li class="sidebar__item">
            <a href="./movie-list.html" class="sidebar__link" onClick='getMovieList("with_original_language=bn", "Bengali")'>Bengali</a>
          </li>
        </ul>
        <div class="sidebar__copyright">
          <p>Copyright 2024 waseemcode</p>
          <img src="./src/images/tmdb-logo.png" alt="" />
        </div>
  `;

  const genreLink = function () {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const item = document.createElement("li");
      item.classList.add("sidebar__item");
      item.setAttribute("onclick", `getMovieList("with_genres=${genreId}", "${genreName}")`);

      item.innerHTML = `
            <a href="./movie-list.html" class="sidebar__link">${genreName}</a>
      `;

      sidebar.querySelectorAll(".sidebar__list")[0].appendChild(item);
    }

    document.querySelector(".sidebar").replaceWith(sidebar);
  };
}
