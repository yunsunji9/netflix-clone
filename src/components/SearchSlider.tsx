import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

import SliderTitle from "./SliderTitle";
import { makeImagePath } from "../utils";
import styled from "styled-components";
import { useState } from "react";

const SliderWrapper = styled.div`
  margin-top: 30px;
  padding: 0 20px;
`;

const SliderArea = styled.div`
  position: relative;
  height: 200px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bg: string }>`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
  background: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  box-sizing: border-box;
  h4 {
    text-align: center;
    font-size: 18px;
    color: #fff;
  }
`;

const PrevBtn = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  border: 0;
  color: #fff;
`;

const NextBtn = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  border: 0;
  color: #fff;
`;

const EmptySlider = styled.div`
  padding: 50px 0;
  text-align: center;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    zIndex: 99,
    scale: 1.3,
    y: -20,
    transition: {
      type: "tween",
      duration: 0.2,
      delay: 0.3,
    },
  },
};

const rowVariants = {
  hidden: (direction: boolean) => ({
    x: direction ? window.innerWidth + 5 : -window.innerWidth - 5,
  }),
  visible: { x: 0 },
  exit: (direction: boolean) => ({ x: direction ? -window.innerWidth - 5 : window.innerWidth + 5 }),
};

const offset = 6;

interface ISlider {
  title?: string;
  category: string;
  data: any;
}

export default function SearchSlider({ title, data, category }: ISlider) {
  const [direction, setDirection] = useState(true);
  const [index, setIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();
  const categoryName = () => {
    return category?.toLowerCase().replaceAll(" ", "");
  };

  const onToggleLeaving = () => {
    setLeaving((prev: boolean) => !prev);
  };
  const onClickBox = (movieId: number) => {
    navigate(`/${category}/${movieId}?category=${categoryName()}&keyword=${keyword}`);
  };
  const onClickControlBtn = (direction: boolean) => {
    setDirection(direction);
    if (!data) return;
    if (leaving) return;
    onToggleLeaving();
    const totalMovies = data?.results.length;
    const maxIndex = Math.floor(totalMovies / offset) - 1;

    setIndex((prev) => {
      if (direction) {
        console.log(prev === maxIndex ? 0 : prev + 1);
        return prev === maxIndex ? 0 : prev + 1;
      } else {
        console.log(prev === 0 ? maxIndex : prev - 1);
        return prev === 0 ? maxIndex : prev - 1;
      }
    });
  };

  return (
    <>
      <SliderWrapper>
        {title && <SliderTitle title={title} />}
        {data ? (
          <SliderArea>
            <AnimatePresence onExitComplete={onToggleLeaving} initial={false} custom={direction}>
              <Row
                variants={rowVariants}
                custom={direction}
                key={index}
                initial="hidden"
                animate="visible"
                transition={{ type: "tween", duration: 0.5 }}
                exit="exit"
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie: any) => (
                    <Box
                      layoutId={`${categoryName()}_${movie.id}`}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => onClickBox(movie.id)}
                      bg={makeImagePath(movie.poster_path, "w500")}
                    >
                      <Info>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <PrevBtn onClick={() => onClickControlBtn(false)}>이전</PrevBtn>
            <NextBtn onClick={() => onClickControlBtn(true)}>다음</NextBtn>
          </SliderArea>
        ) : (
          <EmptySlider>{title} 컨텐츠가 없습니다.</EmptySlider>
        )}
      </SliderWrapper>
    </>
  );
}
