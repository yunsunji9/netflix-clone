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

export interface IGetSearchResult {
  page: number;
  results: IResult[];
  total_page: number;
  total_results: number;
}

// Latest Shows
export function getSearch(query?: string){
  return fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${query}`).then((response) => response.json())
}
