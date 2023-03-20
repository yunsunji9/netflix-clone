import { QueryClient, QueryClientProvider } from "react-query";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import GlobalStyle from "./GlobalStyle";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { darkTheme } from "./theme";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <ThemeProvider theme={darkTheme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  </QueryClientProvider>
);
