import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider, createGlobalStyle } from "styled-components";

import App from "./App";

const GlobalStyle = createGlobalStyle`
  /* css reset */
  *{margin:0;padding:0;font:inherit;color:inherit;}
  *, :after, :before {box-sizing:border-box;}
  :root {-webkit-tap-highlight-color:transparent;-webkit-text-size-adjust:100%;text-size-adjust:100%;cursor:default;line-height:1.5;overflow-wrap:break-word;word-break:break-word;tab-size:4;background-color:#F9F9F9}
  html, body, #root {height:100%;}
  img, picture, video, canvas, svg {display: block;max-width:100%;}
  button {background:none;border:0;cursor:pointer;}
  a {text-decoration:none}
  table {border-collapse:collapse;border-spacing:0}

  /* font */
  * {
    @font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    }
  }
  * {
      box-sizing: border-box;
      font-family: 'Pretendard-Regular';
  }
`;

const theme = {
  Color: {
    mainColor1: "#FF7A00",

    backgroundColor1: "#F9F9F9",
    backgroundColor2: "#FCFCFC",

    borderColor: "#D9D9D9",

    btnColor1: "#ee6a6a",
    btnColor2: "#d0d0d0",
    btnHoverColor1: "#D05f5f",
    btnHoverColor2: "#c9c9c9",
    yellow1: "#ffd43b",
    yellow2: "#ffea7a",
    gray1: "#eaeaea",
    gray2: "#c9c9c9",
  },

  Fs: {
    size28: "1.75rem",
    size24: "1.5rem",
    size20: "1.25rem",
    size18: "1.125rem",
    size16: "1rem",
    size14: "0.875rem",
    size12: "0.75rem",
  },

  Is: {
    size28: "1.75rem",
    size24: "1.5rem",
    size20: "1.25rem",
    size18: "1.125rem",
    size16: "1rem",
    size14: "0.875rem",
    size12: "0.75rem",
  },
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
);
