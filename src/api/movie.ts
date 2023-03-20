const API_KEY = "ef3909ff3e59287de69a8c6fe8224408";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IResult {
  id: number;
  backdrop_path: string;
  overview: string;
  poster_path: string;
  title: string;
  vote_average: number;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimun: string;
  },
  page: number;
  results: IResult[];
  total_page: number;
  total_results: number;
}

export interface ILatestResult {
  id:	number;
  original_title: string;
  overview: string;
}

// Latest movies
export function getLatestMovies(){
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then((response) => response.json())
}

// Top Rated Movies
export function getTopRatedMovies(){
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((response) => response.json())
}

// UpComing
export function getUpComing(){
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((response) => response.json())
}

// Now Playing
export function getMovie(){
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json())
}

