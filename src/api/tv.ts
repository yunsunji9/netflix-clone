const API_KEY = "ef3909ff3e59287de69a8c6fe8224408";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IResult {
  id: number;
  backdrop_path: string;
  overview: string;
  poster_path: string;
  name: string;
  vote_average: number;
}

export interface IGetTvResult {
  page: number;
  results: IResult[];
  total_page: number;
  total_results: number;
}

// Latest Shows
export function getLatestShows(){
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((response) => response.json())
}

// Airing Today
export function getAiringToday(){
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((response) => response.json())
}

// Popular
export function getPopular(){
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) => response.json())
}

// Top Rated
export function getTopRated(){
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then((response) => response.json())
}
