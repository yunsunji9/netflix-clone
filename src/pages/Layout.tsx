import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  padding-bottom: 100px;
`;

export default function Layout() {
  return (
    <Wrapper>
      <Header />
      <Outlet />
    </Wrapper>
  );
}
