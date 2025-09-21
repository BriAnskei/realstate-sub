import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider>
      <UserProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </UserProvider>
    </ThemeProvider>
  </Provider>
);
