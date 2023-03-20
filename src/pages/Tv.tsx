import { AnimatePresence, motion, useScroll } from "framer-motion";
import { IGetTvResult, getAiringToday, getLatestShows, getPopular, getTopRated } from "../api/tv";
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
  const isTvMatch = useMatch("/tvs/:tvId");

  const { data: airingTodayData, isLoading: airingTodayLoading } = useQuery<IGetTvResult>(
    ["airingTodayId", "airingToday"],
    getAiringToday
  );
  const { data: latestData, isLoading: latestLoading } = useQuery<IGetTvResult>(
    ["lastestTvId", "lastestTv"],
    getLatestShows
  );
  const { data: popularData, isLoading: popularLoading } = useQuery<IGetTvResult>(
    ["popularId", "popular"],
    getPopular
  );
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<IGetTvResult>(
    ["topRatedId", "topRated"],
    getTopRated
  );

  const isLoading = () => {
    return airingTodayLoading || latestLoading || popularLoading || topRatedLoading;
  };

  const getCategoryData = (): IGetTvResult | undefined => {
    switch (category) {
      case "nowplaying":
        return airingTodayData;
      case "latest":
        return latestData;
      case "toprated":
        return popularData;
      case "upcoming":
        return topRatedData;
      default:
        return;
    }
  };

  const clickedMovie =
    isTvMatch?.params.tvId &&
    category &&
    getCategoryData()?.results.find((tv: any) => "" + tv.id === isTvMatch?.params.tvId);

  const onClickOverlay = () => {
    navigate(-1);
  };

  return isLoading() ? (
    <Loader>Loading...</Loader>
  ) : (
    <>
      <Banner
        image={airingTodayData?.results[0]?.backdrop_path || ""}
        title={airingTodayData?.results[0]?.name || ""}
        overview={airingTodayData?.results[0]?.overview || ""}
      />
      <SliderWrapper>
        <Slider data={airingTodayData} title="Now Playing" category="tvs" />
        <Slider data={popularData} title="Top Rated" category="tvs" />
        <Slider data={topRatedData} title="UpComing" category="tvs" />
        <Slider data={latestData?.results || null} title="Latest" category="tvs" />
      </SliderWrapper>

      <AnimatePresence>
        {isTvMatch !== null && (
          <>
            <Overlay onClick={onClickOverlay} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <Modal
              style={{
                top: scrollY.get() + 100,
              }}
              layoutId={`${category}_${isTvMatch.params.tvId}`}
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
                      <p style={{ fontSize: 26 }}>{clickedMovie.name}</p>
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
