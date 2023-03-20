import { AnimatePresence, motion, useScroll } from "framer-motion";
import { IGetSearchResult, getSearch } from "../api/search";
import { useMatch, useNavigate, useSearchParams } from "react-router-dom";

import SearchSlider from "../components/SearchSlider";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import { useQuery } from "react-query";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
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

const Title = styled.div`
  font-size: 30px;
  text-align: center;
  padding: 30px 0;
`;

const Text = styled.div`
  font-size: 18px;
  text-align: center;

  span {
    font-size: 20px;
    font-weight: 600;
    //color: ${(props) => props.theme.red};
  }
`;

export default function Search() {
  const { scrollY } = useScroll();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("keyword");
  const isSearchMatch = useMatch("/search/:searchId");
  const category = searchParams.get("category");

  const { data: searchData, isLoading: searchLoading } = useQuery<IGetSearchResult>(
    ["search", keyword],
    () => getSearch(keyword || "")
  );

  const onClickOverlay = () => {
    navigate(-1);
  };

  console.log(searchData?.results);

  const clickedMovie =
    isSearchMatch?.params.searchId &&
    category &&
    searchData?.results.find((search: any) => "" + search.id === isSearchMatch?.params.searchId);

  return (
    <>
      {searchLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Title>Search</Title>
          <Text>
            <span>"{keyword}"</span>으로 검색한 결과입니다.
          </Text>
          <SearchSlider data={searchData} category="search" />

          <AnimatePresence>
            {isSearchMatch !== null && (
              <>
                <Overlay onClick={onClickOverlay} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                <Modal
                  style={{
                    top: scrollY.get() + 100,
                  }}
                  layoutId={`${category}_${isSearchMatch.params.searchId}`}
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
      )}
    </>
  );
}
