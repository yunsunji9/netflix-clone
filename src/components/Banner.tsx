import { makeImagePath } from "../utils";
import styled from "styled-components";

const BannerWrapper = styled.div<{ bg: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(${(props) => props.bg});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

interface IBanner {
  image: string;
  title: string;
  overview: string;
}

export default function Banner({ image, title, overview }: IBanner) {
  return (
    <BannerWrapper bg={makeImagePath(image)}>
      <Title>{title}</Title>
      <Overview>{overview}</Overview>
    </BannerWrapper>
  );
}
