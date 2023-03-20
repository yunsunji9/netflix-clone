import { AnimatePresence, motion, useScroll } from "framer-motion";
import {
  IGetMovieResult,
  getLatestMovies,
  getMovie,
  getTopRatedMovies,
  getUpComing,
} from "../api/movie";
import { useMatch, useNavigate, useSearchParams } from "react-router-dom";

import Banner from "../components/Banner";
import Slider from "../components/Slider";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import { useQuery } from "react-query";

const Loader = styled.div`
  color: #fff;
  font-size: 28px;
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled(motion.div)`
  width: 500px;
  height: 500px;
  position: absolute;
  background: gray;
  left: 50%;
  margin-left: -250px;
`;

const Poster = styled.div`
  position: absolute;
  top: -30px;
  left: 20px;
  width: 150px;
  height: 200px;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const SliderWrapper = styled.div`
  margin-top: -300px;
`;

export default function Main() {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const isMovieMatch = useMatch("/movies/:movieId");

  const { data: nowPlayingData, isLoading: nowPlayingLoading } = useQuery<IGetMovieResult>(
    ["nowPlayingId", "nowPlaying"],
    getMovie
  );
  const { data: latestData, isLoading: latestLoading } = useQuery<IGetMovieResult>(
    ["lastestId", "lastest"],
    getLatestMovies
  );
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<IGetMovieResult>(
    ["topRatedId", "topRated"],
    getTopRatedMovies
  );
  const { data: upComingData, isLoading: upComingLoading } = useQuery<IGetMovieResult>(
    ["upComingId", "upComing"],
    getUpComing
  );

  const isLoading = () => {
    return nowPlayingLoading || latestLoading || topRatedLoading || upComingLoading;
  };

  const getCategoryData = (): IGetMovieResult | undefined => {
    switch (category) {
      case "nowplaying":
        return nowPlayingData;
      case "latest":
        return latestData;
      case "toprated":
        return topRatedData;
      case "upcoming":
        return upComingData;
      default:
        return;
    }
  };

  const clickedMovie =
    isMovieMatch?.params.movieId &&
    category &&
    getCategoryData()?.results.find((movie: any) => "" + movie.id === isMovieMatch?.params.movieId);

  const onClickOverlay = () => {
    navigate(-1);
  };

  return isLoading() ? (
    <Loader>Loading...</Loader>
  ) : (
    <>
      <Banner
        image={nowPlayingData?.results[0]?.backdrop_path || ""}
        title={nowPlayingData?.results[0]?.title || ""}
        overview={nowPlayingData?.results[0]?.overview || ""}
      />
      <SliderWrapper>
        <Slider data={nowPlayingData} title="Now Playing" category="movies" />
        <Slider data={topRatedData} title="Top Rated" category="movies" />
        <Slider data={upComingData} title="UpComing" category="movies" />
        <Slider data={latestData?.results || null} title="Latest" category="movies" />
      </SliderWrapper>

      <AnimatePresence>
        {isMovieMatch !== null && (
          <>
            <Overlay onClick={onClickOverlay} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <Modal
              style={{
                top: scrollY.get() + 100,
              }}
              layoutId={`${category}_${isMovieMatch.params.movieId}`}
            >
              {clickedMovie && (
                <>
                  <div style={{ overflow: "hidden", height: 250 }}>
                    <img
                      src={makeImagePath(clickedMovie.backdrop_path)}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ position: "relative" }}>
                    <Poster>
                      <img src={makeImagePath(clickedMovie.poster_path)} alt="" />
                    </Poster>
                    <div style={{ paddingLeft: 200, paddingTop: 20 }}>
                      <p style={{ fontSize: 26 }}>{clickedMovie.title}</p>
                      <p style={{ overflow: "hidden", marginTop: 10, maxHeight: 94 }}>
                        {clickedMovie.overview}
                      </p>
                      <p style={{ marginTop: 10 }}>평점: {clickedMovie.vote_average}</p>
                    </div>
                  </div>
                </>
              )}
            </Modal>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
