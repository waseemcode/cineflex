"use strict";

// Header Search Functionality
const mblSearchBtn = document.querySelector(".header__mobile-search");
const header = document.querySelector(".header");

mblSearchBtn.addEventListener("click", function () {
  header.classList.add("mobile-search-clicked");
});

document.querySelector(".header__search--close")?.addEventListener("click", function () {
  header.classList.remove("mobile-search-clicked");
});

// Sidebar Funcitonality
document.querySelector(".header__menu").addEventListener("click", function () {
  this.classList.toggle("active");
  document.querySelector(".sidebar").classList.toggle("active");
  document.querySelector(".overlay").classList.toggle("active");
});

document.querySelector(".overlay").addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("active");
  document.querySelector(".overlay").classList.toggle("active");
});

/**
 * Add event on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (const elem of elements) elem.addEventListener(eventType, callback);
};

/**
 * store movieId in `localStorage`.
 * when you click any movie card
 */

const getMovieDetail = function (movieId) {
  window.localStorage.setItem("movieId", String(movieId));
};

const getMovieList = function (urlParam, genreName) {
  window.localStorage.setItem("urlParam", urlParam);
  window.localStorage.setItem("genreName", genreName);
};
