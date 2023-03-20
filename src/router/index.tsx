import { Route, Routes } from "react-router-dom";

import Layout from "../pages/Layout";
import Main from "../pages/Main";
import Search from "../pages/Search";
import Tv from "../pages/Tv";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Main />} />
        <Route path="/movies/:movieId" element={<Main />} />
        <Route path="/tv" element={<Tv />} />
        <Route path="/tvs/:tvId" element={<Tv />} />
        <Route path="/search" element={<Search />} />
        <Route path="/search/:searchId" element={<Search />} />
      </Route>
    </Routes>
  );
};

export default Router;
