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
  /* * {
    @font-face {
    font-family: 'Roboto';
    src: url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap') format('ttf');
    font-weight: 400;
    }
  } */
  * {
      box-sizing: border-box;
      font-family: 'Noto Sans KR', sans-serif;
      /* font-family: 'Roboto'; */
  }
`;

const theme = {
  Color: {
    mainColor: "#7064FF",
    hoverColor: "#4B3DE3",
    activeColor: "#ECEBFF",

    backgroundColor: "#F9F9F9",
    mainWhite: "#FCFCFC",

    mainBlack: "#333333",
    mainGray: "#595959",
    inactiveGray: "#B0B0B0",
  },

  Border: {
    thickBorder: "1.5px solid #D9D9D9",
    thinBorder: "1px solid #DFDFDF",
  },

  // Font-size
  Fs: {
    sidebarTitle: "1.2rem",
    modalTitle: "1.12rem",
    tagTitle: "1.12rem",
    default: "0.875rem",

    size28: "1.75rem",
    size24: "1.5rem",
    size20: "1.25rem",
    size18: "1.125rem",
    size16: "1rem",
    size14: "0.875rem",
    size12: "0.75rem",
  },

  // Icon-size
  Is: {
    size28: "1.75rem",
    size24: "1.5rem",
    size20: "1.25rem",
    size18: "1.125rem",
    size16: "1rem",
    size14: "0.875rem",
    size12: "0.75rem",
  },

  // Border-radius
  Br: {
    default: "10px",
    small: "7px",
  },

  // Box-shadow
  Bs: {
    default: "3px 4px 16px 2px rgba(0, 0, 0, 0.06)",
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
